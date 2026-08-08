const Activity = require("../models/Activity");
const User = require("../models/User");

/* Challenge *definitions* are a fixed list here (title/target/badge),
   but each challenge's *progress* is computed live per-user from real
   Activity/User documents — nothing here is hardcoded per user. */

const CHALLENGE_DEFS = [
    {
        id: "getting-started",
        title: "Getting Started",
        description: "Log your first 5 activities",
        target: 5,
        unit: "activities",
        badge: "Getting Started",
        compute: async (userId) => {
            return Activity.countDocuments({ user: userId });
        }
    },
    {
        id: "weekly-warrior",
        title: "Weekly Warrior",
        description: "Log activities on 3 different days this week",
        target: 3,
        unit: "days",
        badge: "Weekly Warrior",
        compute: async (userId) => {
            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - 7);

            const activities = await Activity.find({
                user: userId,
                createdAt: { $gte: startOfWeek }
            }).select("createdAt");

            const distinctDays = new Set(
                activities.map((a) => new Date(a.createdAt).toDateString())
            );
            return distinctDays.size;
        }
    },
    {
        id: "carbon-cutter",
        title: "Carbon Cutter",
        description: "Log 20kg CO₂ worth of activities this month",
        target: 20,
        unit: "kg CO₂",
        badge: "Carbon Cutter",
        compute: async (userId) => {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const activities = await Activity.find({
                user: userId,
                createdAt: { $gte: startOfMonth }
            }).select("carbon");

            return activities.reduce((sum, a) => sum + (a.carbon || 0), 0);
        }
    },
    {
        id: "streak-keeper",
        title: "Streak Keeper",
        description: "Reach a 7-day logging streak",
        target: 7,
        unit: "days",
        badge: "Streak Keeper",
        compute: async (_userId, user) => user.streak
    },
    {
        id: "century-club",
        title: "Century Club",
        description: "Reach a green score of 100",
        target: 100,
        unit: "points",
        badge: "Century Club",
        compute: async (_userId, user) => user.greenScore
    }
];

// @desc  Get all challenges with live progress for the logged-in user;
//        auto-awards badges + xp the first time a challenge is completed
// @route GET /api/challenges
// @access Private
const getChallenges = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const results = [];
        const newlyEarned = [];

        for (const def of CHALLENGE_DEFS) {
            const rawProgress = await def.compute(user._id, user);
            const alreadyHasBadge = user.badges.includes(def.badge);
            const justCompleted = rawProgress >= def.target && !alreadyHasBadge;

            if (justCompleted) {
                user.badges.push(def.badge);
                user.xp += 25;
                newlyEarned.push(def.badge);
            }

            results.push({
                id: def.id,
                title: def.title,
                description: def.description,
                progress: Math.min(rawProgress, def.target),
                target: def.target,
                unit: def.unit,
                completed: alreadyHasBadge || justCompleted
            });
        }

        if (newlyEarned.length > 0) {
            await user.save();
        }

        res.json({
            success: true,
            data: {
                challenges: results,
                newlyEarned
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = { getChallenges };