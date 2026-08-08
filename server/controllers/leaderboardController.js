const User = require("../models/User");

// @desc  Get top users by greenScore + the logged-in user's own rank
// @route GET /api/leaderboard
// @access Private
const getLeaderboard = async (req, res) => {
    try {
        const topUsers = await User.find()
            .select("name avatar greenScore streak badges")
            .sort({ greenScore: -1 })
            .limit(20);

        const currentUser = await User.findById(req.user._id).select(
            "name avatar greenScore streak badges"
        );

        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Rank = 1 + number of users with a strictly higher greenScore.
        // This works even if the current user isn't in the top 20.
        const higherCount = await User.countDocuments({
            greenScore: { $gt: currentUser.greenScore }
        });

        const inTop = topUsers.some(
            (u) => u._id.toString() === currentUser._id.toString()
        );

        res.json({
            success: true,
            data: {
                topUsers,
                you: {
                    id: currentUser._id,
                    name: currentUser.name,
                    avatar: currentUser.avatar,
                    greenScore: currentUser.greenScore,
                    streak: currentUser.streak,
                    badges: currentUser.badges,
                    rank: higherCount + 1,
                    inTop
                }
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

module.exports = { getLeaderboard };