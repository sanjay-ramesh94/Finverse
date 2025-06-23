import React from "react";
import { motion } from "framer-motion";

export default function GoalsProgress({ goals }) {
  return (
    <div className="bg-zinc-800 p-4 rounded shadow-md">
      <h3 className="mb-4 font-semibold">🎯 Goals Progress</h3>
      <div className="space-y-3">
        {goals.map((goal, i) => {
          const percentage = Math.min(100, (goal.current / goal.target) * 100).toFixed(1);
          const barColor = goal.type === "investment" ? "bg-green-500" :
                           goal.type === "short-term" ? "bg-blue-400" :
                           "bg-purple-500";
          return (
            <motion.div
              key={goal._id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="mb-4"
            >
              <div className="flex justify-between text-sm mb-1">
                <span>{goal.name}</span>
                <span className="text-teal-400">
                  {percentage}% (₹{goal.current.toLocaleString()})
                </span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded overflow-hidden">
                <div className={`${barColor} h-full`} style={{ width: `${percentage}%` }}></div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
