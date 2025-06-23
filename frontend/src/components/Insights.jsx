import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Insights({ transactions = [] }) {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const categories = {};
    const monthly = {};
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((tx) => {
      const month = tx.date.slice(0, 7);
      if (!monthly[month]) monthly[month] = { income: 0, expense: 0 };

      if (tx.type === "income") {
        incomeTotal += tx.amount;
        monthly[month].income += tx.amount;
      } else if (tx.type === "expense") {
        expenseTotal += tx.amount;
        monthly[month].expense += tx.amount;
        categories[tx.category] = (categories[tx.category] || 0) + tx.amount;
      }
    });

    const topCategories = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const insightList = [];

    if (incomeTotal || expenseTotal) {
      const savingsPct = ((incomeTotal - expenseTotal) / incomeTotal) * 100;
      insightList.push(`💰 You saved ${savingsPct.toFixed(1)}% of your income this month.`);
    }

    if (topCategories.length) {
      const top = topCategories[0];
      insightList.push(`🔝 Highest spending: ${top[0]} - ₹${top[1].toFixed(0)}`);
    }

    const months = Object.keys(monthly).sort();
    if (months.length >= 2) {
      const current = months[months.length - 1];
      const prev = months[months.length - 2];
      const diff = monthly[current].expense - monthly[prev].expense;
      const changePct = (diff / monthly[prev].expense) * 100;

      if (!isNaN(changePct)) {
        insightList.push(
          changePct > 0
            ? `📈 Expenses increased by ${changePct.toFixed(1)}% compared to last month.`
            : `📉 Expenses decreased by ${Math.abs(changePct).toFixed(1)}% from last month.`
        );
      }

      // AI-style: Specific category growth
      const categoryGrowth = {};
      transactions.forEach((tx) => {
        const month = tx.date.slice(0, 7);
        if (tx.type === "expense") {
          if (!categoryGrowth[tx.category]) categoryGrowth[tx.category] = {};
          if (!categoryGrowth[tx.category][month]) categoryGrowth[tx.category][month] = 0;
          categoryGrowth[tx.category][month] += tx.amount;
        }
      });

      for (let cat in categoryGrowth) {
        const catData = categoryGrowth[cat];
        if (catData[prev] && catData[current]) {
          const diff = catData[current] - catData[prev];
          const pct = (diff / catData[prev]) * 100;
          if (Math.abs(pct) >= 20) {
            insightList.push(
              pct > 0
                ? `⚠️ You're spending ${pct.toFixed(1)}% more on ${cat} than last month.`
                : `✅ You've cut down ${cat} expenses by ${Math.abs(pct).toFixed(1)}%!`
            );
          }
        }
      }
    }

    setInsights(insightList);
  }, [transactions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-zinc-800 rounded-lg p-6 shadow-lg border border-zinc-700"
    >
      <h2 className="text-2xl font-bold text-teal-400 mb-4">🔍 Smart Insights</h2>
      <ul className="space-y-2 text-sm text-gray-300">
        {insights.length > 0 ? (
          insights.map((msg, i) => <li key={i}>• {msg}</li>)
        ) : (
          <li>Analyzing data...</li>
        )}
      </ul>
    </motion.div>
  );
}
