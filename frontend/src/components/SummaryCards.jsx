import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

const fmt = (n) => "₹" + n.toLocaleString("en-IN");

export default function SummaryCards({ income, expense, balance }) {
  const cards = [
    {
      label: "Total Balance",
      value: fmt(balance),
      icon: Wallet,
      color: "text-indigo-400",
      iconBg: "bg-indigo-500/10",
      trend: balance >= 0 ? "positive" : "negative",
    },
    {
      label: "Income",
      value: fmt(income),
      icon: TrendingUp,
      color: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
    },
    {
      label: "Expenses",
      value: fmt(expense),
      icon: TrendingDown,
      color: "text-rose-400",
      iconBg: "bg-rose-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.35 }}
          className="card p-5 flex items-center gap-4"
        >
          <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center shrink-0`}>
            <c.icon size={18} className={c.color} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">{c.label}</p>
            <p className={`text-xl font-bold tracking-tight mt-0.5 mono ${c.color}`}>{c.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
