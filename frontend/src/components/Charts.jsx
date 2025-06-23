import React from "react";
import { motion } from "framer-motion";
import { Bar, Pie } from "react-chartjs-2";

// ✅ Register required Chart.js components
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

export default function Charts({ barData, pieData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 📊 Bar Chart */}
      <motion.div
        className="bg-zinc-800 p-4 rounded-xl shadow-md h-[300px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="mb-2 font-semibold text-lg text-teal-300">📆 Income vs Expense</h3>
        <div className="h-[220px] w-full">
          <Bar data={barData} options={{ maintainAspectRatio: false }} />
        </div>
      </motion.div>

      {/* 🥧 Pie Chart */}
      <motion.div
        className="bg-zinc-800 p-4 rounded-xl shadow-md h-[300px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="mb-2 font-semibold text-lg text-yellow-400">💸 Expense by Category</h3>
        <div className="h-[220px] w-full">
          <Pie data={pieData} options={{ maintainAspectRatio: false }} />
        </div>
      </motion.div>
    </div>
  );
}
