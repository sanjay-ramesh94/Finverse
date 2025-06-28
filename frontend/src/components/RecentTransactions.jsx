import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RecentTransactions({ transactions }) {
  const recent = [...transactions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // ✅ Ensure latest first
    .slice(0, 5); // ✅ Top 5 recent ones

  return (
    <div className="bg-zinc-800 p-4 rounded shadow-md">
      <h3 className="mb-4 font-semibold text-yellow-400">🕒 Recent Transactions</h3>
      <AnimatePresence>
        {recent.map((tx) => (
          <motion.div
            key={tx._id}
            className="flex justify-between py-2 border-b border-zinc-700"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <span>{tx.note || tx.category}</span>
            <span className={tx.type === "income" ? "text-green-400" : "text-red-400"}>
              ₹{tx.amount}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
