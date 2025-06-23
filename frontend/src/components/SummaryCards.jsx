import React from "react";
import { motion } from "framer-motion";

export default function SummaryCards({ income, expense, savings }) {
  const cardData = [
    { label: "Income", value: income, color: "text-green-400" },
    { label: "Expense", value: expense, color: "text-red-400" },
    { label: "Net", value: savings, color: "text-teal-400" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cardData.map((c) => (
        <motion.div
          key={c.label}
          className="bg-zinc-800 p-4 rounded shadow-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * cardData.indexOf(c) }}
        >
          <h3 className="text-sm text-gray-400">{c.label}</h3>
          <p className={`text-xl font-semibold ${c.color}`}>₹{c.value.toLocaleString()}</p>
        </motion.div>
      ))}
    </div>
  );
}
