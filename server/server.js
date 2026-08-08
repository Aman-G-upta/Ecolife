require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const aiRoutes = require("./routes/aiRoutes");


// Connect Database
connectDB();
app.use("/api/ai", aiRoutes);

app.use("/api/activity", require("./routes/activityRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));
app.use("/api/challenges", require("./routes/challengeRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on Port ${PORT}`);
});