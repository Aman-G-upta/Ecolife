const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://ecolifeaifrontend.vercel.app"   
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json({ limit: "12mb" }));


// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "EcoLife AI Backend Running 🚀"
    });
});

module.exports = app;