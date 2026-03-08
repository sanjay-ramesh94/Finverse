const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  type: { type: String, enum: ["investment", "short-term", "long-term"] },
  target: Number,
  current: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Goal", goalSchema);
