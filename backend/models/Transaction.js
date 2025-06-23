const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Flag to identify if this transaction is an investment
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
      type: String, // URL or uploaded file name
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
