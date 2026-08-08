const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    type: String,
    data: Object,
    carbon: Number
}, { timestamps: true });

module.exports = mongoose.model("Activity", activitySchema);