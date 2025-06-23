// src/components/Insights.jsx
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

export default function Insights() {
  const { user } = useContext(UserContext);
  const [insights, setInsights] = useState({
    topCategories: [],
    savingsPercent: 0,
    m2mGrowth: 0,
  });

  useEffect(() => {
    if (!user?._id) return;

    (async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/user/${user._id}`);
      const tx = res.data;
      const now = new Date();
      const thisMonth = now.toISOString().slice(0, 7);
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonth = lastMonthDate.toISOString().slice(0, 7);

      const txThis = tx.filter(t => t.date.startsWith(thisMonth) && t.type === 'expense');
      const txLast = tx.filter(t => t.date.startsWith(lastMonth) && t.type === 'expense');
      const totalIncome = tx
        .filter(t => t.date.startsWith(thisMonth) && t.type === 'income')
        .reduce((a, b) => a + b.amount, 0);
      const totalExpense = txThis.reduce((a, b) => a + b.amount, 0);
      const lastExpense = txLast.reduce((a, b) => a + b.amount, 0);

      const topCats = Object.entries(
        txThis.reduce((acc, t) => {
          if (t.category) acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {})
      )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      const savingsPercent = totalIncome > 0
        ? ((totalIncome - totalExpense) / totalIncome) * 100
        : 0;

      const m2mGrowth = lastExpense === 0
        ? totalExpense > 0 ? 100 : 0
        : ((totalExpense - lastExpense) / lastExpense) * 100;

      setInsights({
        topCategories: topCats,
        savingsPercent: savingsPercent.toFixed(1),
        m2mGrowth: m2mGrowth.toFixed(1),
      });
    })();
  }, [user]);

  return (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl text-white grid sm:grid-cols-3 gap-6">
      {/* Top categories */}
      <div>
        <h4 className="font-semibold mb-2">Top Spending</h4>
        <ul className="space-y-1">
          {insights.topCategories.length === 0 && <li>—</li>}
          {insights.topCategories.map(([cat, amt]) => (
            <li key={cat} className="flex justify-between">
              <span>{cat}</span>
              <span>₹ {amt.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Savings % */}
      <div>
        <h4 className="font-semibold mb-2">Savings This Month</h4>
        <p className="text-4xl">{insights.savingsPercent}%</p>
      </div>

      {/* Month-over-month growth */}
      <div>
        <h4 className="font-semibold mb-2">Expense Trend</h4>
        <p className={`text-4xl ${insights.m2mGrowth >= 0 ? "text-red-400" : "text-green-400"}`}>
          {insights.m2mGrowth >= 0 ? "↑ " : "↓ "}
          {Math.abs(insights.m2mGrowth)}%
        </p>
        <small className="text-gray-300">vs last month</small>
      </div>
    </div>
  );
}
