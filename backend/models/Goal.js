const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ["investment", "short-term", "long-term"], required: true },
  target: { type: Number, required: true },
  current: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Goal", goalSchema);
