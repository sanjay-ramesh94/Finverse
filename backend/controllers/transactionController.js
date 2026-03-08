const Transaction = require('../models/Transaction');
const Goal = require('../models/Goal');

const investCats = ["mutual fund", "gold", "silver", "stocks"];

exports.createTransaction = async (req, res) => {
    try {
        const data = req.body;
        data.isInvestment = investCats.includes((data.category || "").toLowerCase());
        if (req.file) data.image = `/uploads/${req.file.filename}`;

        // Gold/Silver calculations
        if (
            data.isInvestment &&
            data.category?.toLowerCase() === "gold" &&
            data.type === "expense" &&
            data.liveGoldPricePerGram
        ) {
            data.goldGrams = Number(data.amount) / Number(data.liveGoldPricePerGram);
            data.goldPriceAtPurchase = Number(data.liveGoldPricePerGram);
        }

        const tx = new Transaction(data);
        await tx.save();

        // Goal tracking logic
        if (data.type === "transfer") {
            const g = await Goal.findOne({ userId: data.userId, name: data.category });
            if (g) {
                g.current += Number(data.amount);
                await g.save();
            }
        }

        res.status(201).json(tx);
    } catch (err) {
        console.error("❌ Transaction creation error:", err);
        res.status(500).json({ msg: "Server error" });
    }
};

exports.getTransactionsByUser = async (req, res) => {
    try {
        const txs = await Transaction.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(txs);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

exports.getInvestmentsByUser = async (req, res) => {
    try {
        const investments = await Transaction.find({ userId: req.params.userId, isInvestment: true }).sort({ createdAt: -1 });
        res.json(investments);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ msg: "Transaction not found" });
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const data = req.body;
        data.isInvestment = investCats.includes((data.category || "").toLowerCase());
        if (req.file) data.image = `/uploads/${req.file.filename}`;

        if (
            data.isInvestment &&
            data.category?.toLowerCase() === "gold" &&
            data.type === "expense" &&
            data.liveGoldPricePerGram
        ) {
            data.goldGrams = Number(data.amount) / Number(data.liveGoldPricePerGram);
            data.goldPriceAtPurchase = Number(data.liveGoldPricePerGram);
        } else {
            data.goldGrams = 0;
            data.goldPriceAtPurchase = 0;
        }

        const updated = await Transaction.findByIdAndUpdate(req.params.id, data, { new: true });
        res.json(updated);
    } catch (err) {
        console.error("❌ Transaction update error:", err);
        res.status(500).json({ msg: "Server error" });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ msg: "Deleted" });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};
