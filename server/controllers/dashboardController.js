const Activity = require("../models/Activity");
const User = require("../models/User");

const getDashboard = async (req, res) => {

    const userId = req.user._id;

    // Total Activities
    const totalActivities = await Activity.countDocuments({ user: userId });

    // Total Carbon
    const activities = await Activity.find({ user: userId });

    const totalCarbon = activities.reduce((sum, item) => sum + item.carbon, 0);

    // Weekly Data (last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const weeklyActivities = await Activity.find({
        user: userId,
        createdAt: { $gte: last7Days }
    });

    // Simple grouping
    const weeklyData = weeklyActivities.map(a => ({
        date: a.createdAt,
        carbon: a.carbon
    }));

    // User Data
    const user = await User.findById(userId);

    res.json({
        success: true,
        data: {
            totalActivities,
            totalCarbon,
            weeklyData,
            greenScore: user.greenScore,
            streak: user.streak
        }
    });
};

module.exports = { getDashboard };