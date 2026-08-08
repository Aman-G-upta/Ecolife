const { GoogleGenerativeAI } = require("@google/generative-ai");
const Activity = require("../models/Activity");
const User = require("../models/User");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Google has been retiring Gemini model IDs for new API keys faster than
// their published shutdown dates (multiple models 404'd for new users in
// 2026 well ahead of schedule). Rather than hardcode one model name, try
// a short list in order — if one gets retired, the next still works
// without needing a code change.
const MODEL_CANDIDATES = [
    "gemini-3.6-flash",
    "gemini-3.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-flash-latest", // Google's auto-updating alias, last resort
];

const CARBON_BY_CATEGORY = {
    Recyclable: 0.3,
    Compostable: 0.2,
    "E-waste": 0.5,
    Hazardous: 0.1,
    Landfill: 0,
};

const PROMPT = `You are a waste disposal assistant for a sustainability app.
Look at the item in this image and respond with ONLY raw JSON (no markdown,
no backticks, no extra text) in exactly this shape:
{
  "item": "short name of the item, e.g. 'Plastic water bottle'",
  "category": "Recyclable" | "Compostable" | "Hazardous" | "Landfill" | "E-waste",
  "instructions": "1-2 sentence disposal instructions specific to this item",
  "tip": "one short, specific eco tip related to this item"
}
If the image does not clearly show a disposable item, still make your best
guess at the closest matching category and say so briefly in "instructions".`;

// Used when the API is genuinely unreachable/exhausted (daily quota hit),
// so the demo degrades gracefully instead of showing a broken error.
// Framed honestly as "AI unavailable" — not a fake identification.
const FALLBACK_RESULT = {
    item: "Item (AI temporarily unavailable)",
    category: "Landfill",
    instructions:
        "We couldn't reach the AI service right now. As a general rule: check for a recycling symbol, rinse before recycling, and compost food scraps where possible.",
    tip: "When unsure, your local municipality's waste guide is the most reliable source.",
    fallback: true,
};

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRateLimitError(error) {
    return error?.status === 429 || /RESOURCE_EXHAUSTED|rate limit|quota/i.test(error?.message || "");
}

function isModelUnavailableError(error) {
    return error?.status === 404 || /no longer available|NOT_FOUND/i.test(error?.message || "");
}

// Retries a couple of times on transient per-minute rate limits (which
// usually clear within seconds) before giving up. Daily-quota exhaustion
// won't clear on retry, so this is only useful for the RPM case, not RPD.
async function generateWithRetry(model, parts, attempts = 2) {
    for (let i = 0; i <= attempts; i++) {
        try {
            return await model.generateContent(parts);
        } catch (error) {
            const isLastAttempt = i === attempts;
            if (!isRateLimitError(error) || isLastAttempt) throw error;
            await sleep(1000 * Math.pow(2, i)); // 1s, then 2s
        }
    }
}

async function updateUserStats(userId) {
    const user = await User.findById(userId);
    const now = new Date();
    const isSameDay = (a, b) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (!user.lastActivityDate) {
        user.streak = 1;
    } else if (isSameDay(user.lastActivityDate, now)) {
        // already logged today
    } else if (isSameDay(user.lastActivityDate, yesterday)) {
        user.streak += 1;
    } else {
        user.streak = 1;
    }
    user.lastActivityDate = now;
    user.greenScore += 10;
    user.xp += 5;
    await user.save();
}

// @desc  Identify a waste item from an uploaded photo and return disposal info
// @route POST /api/ai/scan
// @access Private
const analyzeWaste = async (req, res) => {
    try {
        const { imageBase64, mimeType } = req.body;

        if (!imageBase64) {
            return res.status(400).json({
                success: false,
                message: "No image provided",
            });
        }

        const imagePart = { inlineData: { data: imageBase64, mimeType: mimeType || "image/jpeg" } };

        let parsed;
        let lastError;

        for (const modelName of MODEL_CANDIDATES) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await generateWithRetry(model, [imagePart, PROMPT]);

                const rawText = result.response.text();
                const cleaned = rawText.replace(/```json|```/g, "").trim();
                parsed = JSON.parse(cleaned);
                break; // success — stop trying further models
            } catch (aiError) {
                lastError = aiError;
                if (isModelUnavailableError(aiError)) {
                    console.warn(`Model ${modelName} unavailable, trying next candidate...`);
                    continue; // try the next model in the list
                }
                if (isRateLimitError(aiError)) {
                    console.warn("Gemini quota/rate limit hit — using fallback response");
                    parsed = FALLBACK_RESULT;
                    break;
                }
                console.error("Gemini call failed:", aiError);
                return res.status(502).json({
                    success: false,
                    message: "Couldn't read the AI response — try another photo",
                });
            }
        }

        // Every model in the list was unavailable (very unlikely, but possible
        // mid-migration) — degrade gracefully instead of crashing.
        if (!parsed) {
            console.error("All model candidates failed:", lastError);
            parsed = FALLBACK_RESULT;
        }

        const carbon = parsed.fallback ? 0 : CARBON_BY_CATEGORY[parsed.category] ?? 0;

        // Log this scan as a real Activity so it feeds the dashboard/streak/greenScore too
        await Activity.create({
            user: req.user._id,
            type: "scan",
            data: { item: parsed.item, category: parsed.category },
            carbon,
        });

        await updateUserStats(req.user._id);

        res.json({
            success: true,
            data: { ...parsed, carbon },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = { analyzeWaste };