const express = require("express");
const router = express.Router();
const Goal = require("../models/Goal");

router.post("/", async (req, res) => {
  try {
    const { userId, name, type, target } = req.body;

    if (!userId || !name || !type || !target) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const goal = new Goal({ userId, name, type, target });
    await goal.save();

    res.status(201).json(goal);
  } catch (error) {
    console.error("❌ Goal creation error:", error);
    res.status(500).json({ msg: "Failed to create goal" });
  }
});

// ✅ Get all goals for a user
router.get("/:userId", async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    console.error("❌ Failed to fetch goals:", err.message);
    res.status(500).json({ msg: "Failed to fetch goals" });
  }
});

// ✅ Delete a goal
router.delete("/:id", async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.json({ msg: "Goal deleted" });
  } catch (err) {
    console.error("❌ Failed to delete goal:", err.message);
    res.status(500).json({ msg: "Failed to delete goal" });
  }
});

// ✅ Increment goal progress (e.g., when transfer transaction occurs)
router.put("/:goalId/add", async (req, res) => {
  try {
    const { amount } = req.body;

    const goal = await Goal.findById(req.params.goalId);
    if (!goal) return res.status(404).json({ msg: "Goal not found" });

    goal.current += amount;
    await goal.save();

    res.json(goal);
  } catch (err) {
    console.error("❌ Failed to update goal progress:", err.message);
    res.status(500).json({ msg: "Failed to update goal" });
  }
});

module.exports = router;
