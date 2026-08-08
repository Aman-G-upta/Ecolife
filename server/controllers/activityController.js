const Activity = require("../models/Activity");
const User = require("../models/User");

const CARBON_FACTORS = {
    travel: (data) => (Number(data.distance) || 0) * 0.2,
    electricity: (data) => (Number(data.units) || 0) * 0.5,
    water: (data) => (Number(data.liters) || 0) * 0.0003,
    recycling: (data) => -((Number(data.kg) || 0) * 0.15),
    diet: (data) => -((Number(data.meals) || 0) * 1.2),
};

const POINTS_PER_LOG = 10;
const XP_PER_LOG = 5;

function isSameDay(a, b) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function isYesterday(date, today) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return isSameDay(date, yesterday);
}

const addActivity = async (req, res) => {
    try {
        const { type, data } = req.body;

        if (!type || !data) {
            return res.status(400).json({
                success: false,
                message: "type and data are required",
            });
        }

        const calcCarbon = CARBON_FACTORS[type];
        if (!calcCarbon) {
            return res.status(400).json({
                success: false,
                message: `Unsupported activity type: ${type}`,
            });
        }

        const carbon = Math.round(calcCarbon(data) * 100) / 100;

        const activity = await Activity.create({
            user: req.user._id,
            type,
            data,
            carbon,
        });

        const user = await User.findById(req.user._id);
        const now = new Date();

        if (!user.lastActivityDate) {
            user.streak = 1;
        } else if (isSameDay(user.lastActivityDate, now)) {
        } else if (isYesterday(user.lastActivityDate, now)) {
            user.streak += 1;
        } else {
            user.streak = 1; 
        }
        user.lastActivityDate = now;

        const savedBonus = carbon < 0 ? Math.round(-carbon) : 0;
        user.greenScore += POINTS_PER_LOG + savedBonus;
        user.xp += XP_PER_LOG;

        await user.save();

        res.json({
            success: true,
            activity,
            stats: {
                greenScore: user.greenScore,
                streak: user.streak,
                xp: user.xp,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find({
            user: req.user._id,
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            activities,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    addActivity,
    getActivities,
};