import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { TrendingUp, TrendingDown, PiggyBank } from "lucide-react";

export default function Insights() {
  const { user } = useContext(UserContext);
  const [data, setData] = useState({ topCategories: [], savingsPercent: 0, m2mGrowth: 0 });

  const fmtMonth = (d) => {
    const dt = new Date(d);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!user?._id) return;
    (async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/user/${user._id}`);
        const tx = res.data;
        const now = new Date();
        const thisMonth = fmtMonth(now);
        const lastMonth = fmtMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
        const txThis = tx.filter(t => fmtMonth(t.date) === thisMonth && t.type === "expense");
        const txLast = tx.filter(t => fmtMonth(t.date) === lastMonth && t.type === "expense");
        const totalIncome = tx.filter(t => fmtMonth(t.date) === thisMonth && t.type === "income").reduce((a, b) => a + b.amount, 0);
        const totalExpense = txThis.reduce((a, b) => a + b.amount, 0);
        const lastExpense = txLast.reduce((a, b) => a + b.amount, 0);
        const topCats = Object.entries(txThis.reduce((acc, t) => {
          const key = t.category?.trim().toLowerCase();
          if (key) acc[key] = (acc[key] || 0) + t.amount;
          return acc;
        }, {})).sort((a, b) => b[1] - a[1]).slice(0, 3);
        const savingsPercent = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
        const m2mGrowth = lastExpense === 0 ? (totalExpense > 0 ? 100 : 0) : ((totalExpense - lastExpense) / lastExpense) * 100;
        setData({ topCategories: topCats, savingsPercent: savingsPercent.toFixed(1), m2mGrowth: m2mGrowth.toFixed(1) });
      } catch { /* silently fail */ }
    })();
  }, [user]);

  const isGood = Number(data.m2mGrowth) <= 0;

  return (
    <div className="card p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Top spending */}
      <div>
        <p className="section-title">Top Spending</p>
        <div className="space-y-1.5">
          {data.topCategories.length === 0
            ? <p className="text-sm text-slate-600">No data this month</p>
            : data.topCategories.map(([cat, amt]) => (
              <div key={cat} className="flex items-center justify-between text-sm">
                <span className="text-slate-400 capitalize">{cat}</span>
                <span className="text-slate-200 font-medium">₹{amt.toLocaleString("en-IN")}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Savings rate */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
          <PiggyBank size={17} className="text-emerald-400" />
        </div>
        <div>
          <p className="section-title">Savings Rate</p>
          <p className="text-3xl font-bold text-slate-100 leading-none">{data.savingsPercent}<span className="text-base text-slate-500 ml-0.5">%</span></p>
          <p className="text-xs text-slate-500 mt-1">This month</p>
        </div>
      </div>

      {/* Expense trend */}
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${isGood ? "bg-emerald-500/10" : "bg-rose-500/10"}`}>
          {isGood ? <TrendingDown size={17} className="text-emerald-400" /> : <TrendingUp size={17} className="text-rose-400" />}
        </div>
        <div>
          <p className="section-title">Expense Trend</p>
          <p className={`text-3xl font-bold leading-none ${isGood ? "text-emerald-400" : "text-rose-400"}`}>
            {isGood ? "−" : "+"}{Math.abs(data.m2mGrowth)}<span className="text-base ml-0.5">%</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">vs last month</p>
        </div>
      </div>
    </div>
  );
}
