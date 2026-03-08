const Goal = require('../models/Goal');

exports.createGoal = async (req, res) => {
    try {
        const goal = new Goal(req.body);
        await goal.save();
        res.status(201).json(goal);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

exports.getGoalsByUser = async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(goals);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

exports.addProgressToGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.goalId);
        if (!goal) return res.status(404).json({ msg: "Goal not found" });

        goal.current += Number(req.body.amount);
        await goal.save();
        res.json(goal);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

exports.deleteGoal = async (req, res) => {
    try {
        await Goal.findByIdAndDelete(req.params.id);
        res.json({ msg: "Goal deleted" });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};
