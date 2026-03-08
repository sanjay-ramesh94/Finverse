import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#F43F5E", "#8B5CF6", "#06B6D4"];

export default function Investment() {
  const { user } = useContext(UserContext);
  const [investments, setInvestments] = useState([]);
  const [totalInvested, setTotalInvested] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/investments/${user._id}`)
      .then(res => {
        const data = res.data || [];
        setInvestments(data);
        setTotalInvested(data.reduce((s, t) => s + t.amount, 0));
        const catMap = {};
        data.forEach(tx => { catMap[tx.category] = (catMap[tx.category] || 0) + tx.amount; });
        setChartData(Object.entries(catMap).map(([name, value]) => ({ name, value })));
      })
      .catch(err => console.error("Failed to fetch investments:", err.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">Investments</h1>
        <p className="text-sm text-slate-500 mt-1">Your investment portfolio overview</p>
      </div>

      {/* Total invested card */}
      <div className="card p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
          <TrendingUp size={18} className="text-indigo-400" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">Total Invested</p>
          <p className="text-2xl font-bold mono text-indigo-400 mt-0.5">₹{totalInvested.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {chartData.length > 0 ? (
        <>
          {/* Pie chart */}
          <div className="card p-6">
            <p className="section-title">Allocation by Category</p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={110} paddingAngle={3}>
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />)}
                </Pie>
                <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Amount"]} contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", color: "#F1F5F9" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Investment cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {investments.map((tx, i) => (
              <motion.div key={tx._id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <p className="text-sm font-semibold text-slate-200 capitalize">{tx.category}</p>
                </div>
                <p className="text-xs text-slate-500 mb-2">{tx.date}</p>
                <p className="text-lg font-bold mono text-emerald-400">₹{tx.amount?.toLocaleString("en-IN")}</p>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="card p-12 flex flex-col items-center text-center">
          <TrendingUp size={40} className="text-slate-700 mb-3" />
          <p className="text-slate-400 font-medium">No investments found</p>
          <p className="text-sm text-slate-600 mt-1">Add a transaction with an investment category to see your portfolio here</p>
        </div>
      )}
    </motion.div>
  );
}
