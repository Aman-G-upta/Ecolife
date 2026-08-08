const express = require("express");
const router = express.Router();

const { analyzeWaste } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

router.post("/scan", protect, analyzeWaste);

module.exports = router;