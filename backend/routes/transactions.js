const express = require("express");
const router = express.Router();
const multer = require("multer");
const Transaction = require("../models/Transaction");
const Goal = require("../models/Goal");

// ✅ Categories that are considered investments
const investmentCategories = ["mutual fund", "gold", "silver", "stocks"];

// ✅ Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/**
 * @route   POST /api/transactions
 * @desc    Create a new transaction
 */
router.post("/", upload.single("image"), async (req, res) => {
  console.log("📥 Transaction POST received:", req.body);
  try {
    const {
      date,
      amount,
      category,
      account,
      note,
      description,
      userId,
      type,
    } = req.body;

    if (!userId || !amount || !type) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const isInvestment = investmentCategories.includes((category || "").toLowerCase());

    const transaction = new Transaction({
      date,
      amount,
      category,
      account,
      note,
      description,
      userId,
      type,
      isInvestment,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    await transaction.save();

    // 🧠 If it's a transfer and matches a goal, increment the goal
    if (type === "transfer") {
      const goal = await Goal.findOne({ userId, name: category });
      if (goal) {
        goal.current += Number(amount);
        await goal.save();
        console.log(`✅ Goal "${goal.name}" updated by ₹${amount}`);
      }
    }

    res.status(201).json({ msg: "Transaction saved", transaction });
  } catch (error) {
    console.error("❌ Error saving transaction:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   GET /api/transactions/user/:userId
 * @desc    Get all transactions for a user
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    console.error("❌ Error fetching transactions:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   GET /api/transactions/:id
 * @desc    Get a single transaction by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ msg: "Transaction not found" });
    res.json(transaction);
  } catch (err) {
    console.error("❌ Error fetching transaction by ID:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete a transaction by ID
 */
router.delete("/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ msg: "Transaction deleted" });
  } catch (err) {
    console.error("❌ Error deleting transaction:", err);
    res.status(500).json({ msg: "Delete failed" });
  }
});

/**
 * @route   PUT /api/transactions/:id
 * @desc    Update a transaction (with or without image)
 */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { category } = req.body;
    const isInvestment = investmentCategories.includes((category || "").toLowerCase());

    const updateData = { ...req.body, isInvestment };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await Transaction.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json({ msg: "Transaction updated", transaction: updated });
  } catch (err) {
    console.error("❌ Error updating transaction:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   GET /api/transactions/investments/:userId
 * @desc    Get investment-related transactions for a user
 */
router.get("/investments/:userId", async (req, res) => {
  try {
    const investments = await Transaction.find({
      userId: req.params.userId,
      isInvestment: true,
    }).sort({ createdAt: -1 });

    res.json(investments);
  } catch (err) {
    console.error("❌ Error fetching investments:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
