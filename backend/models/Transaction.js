const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isInvestment: {
      type: Boolean,
      default: false,
    },

    type: {
      type: String,
      enum: ["income", "expense", "transfer"],
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
    },

    account: {
      type: String,
    },

    note: {
      type: String,
    },

    description: {
      type: String,
    },

    image: {
      type: String,
    },

    // ✅ Add this field to store grams of gold purchased
    goldGrams: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
