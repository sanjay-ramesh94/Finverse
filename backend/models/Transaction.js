const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isInvestment: { type: Boolean, default: false },
  type: { type: String, enum: ["income", "expense", "transfer"] },
  date: String,
  amount: Number,
  category: String,
  account: String,
  note: String,
  description: String,
  image: String,

  // New fields for gold/silver investments
  goldGrams: { type: Number, default: 0 },
  goldPriceAtPurchase: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
