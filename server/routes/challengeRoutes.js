const express = require("express");
const router = express.Router();

const { getChallenges } = require("../controllers/challengeController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getChallenges);

module.exports = router;