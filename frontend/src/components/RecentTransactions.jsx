import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight, ArrowRight, Coffee, Car, ShoppingBag, Gamepad2, Pill, Zap, Home, Briefcase, Laptop, LineChart, Coins, BarChart, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const CATEGORY_ICONS = {
  food: Coffee, transport: Car, shopping: ShoppingBag, entertainment: Gamepad2,
  health: Pill, utilities: Zap, rent: Home, salary: Briefcase,
  freelance: Laptop, investment: LineChart, gold: Coins, mutual: BarChart,
  default: CreditCard
};

const getCategoryIcon = (cat) => {
  if (!cat) return CATEGORY_ICONS.default;
  const key = Object.keys(CATEGORY_ICONS).find(k => cat.toLowerCase().includes(k));
  return key ? CATEGORY_ICONS[key] : CATEGORY_ICONS.default;
};

export default function RecentTransactions({ transactions }) {
  const navigate = useNavigate();
  const recent = [...transactions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <div className="card p-6 rounded-[2rem] shadow-lg shadow-slate-200/40 border border-slate-100 bg-white">
      <div className="flex items-center justify-between mb-5">
        <p className="section-title mb-0">Recent Transactions</p>
        <button onClick={() => navigate("/history")}
          className="text-xs text-slate-800 hover:text-slate-700 transition-colors flex items-center gap-1">
          View all <ArrowRight size={13} />
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="h-40 flex flex-col items-center justify-center text-slate-600">
          <p className="text-sm">No transactions yet</p>
          <button onClick={() => navigate("/add")} className="mt-3 btn-ghost text-xs px-3 py-1.5">
            Add your first one
          </button>
        </div>
      ) : (
        <div className="space-y-1">
          {recent.map((tx, i) => (
            <motion.div
              key={tx._id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 px-4 py-3.5 mb-2 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-[1.25rem] transition-all group"
            >
              <div className="w-11 h-11 rounded-[1rem] flex items-center justify-center text-slate-600 shrink-0 bg-white shadow-sm border border-slate-100"
                >
                {(() => { const Icon = getCategoryIcon(tx.category); return <Icon size={16} />; })()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{tx.note || tx.category || "Transaction"}</p>
                <p className="text-xs text-slate-500">{tx.date} · {tx.category}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-sm font-semibold mono ${tx.type === "income" ? "text-emerald-400" : tx.type === "expense" ? "text-rose-400" : "text-slate-800"}`}>
                  {tx.type === "income" ? "+" : tx.type === "expense" ? "−" : ""}₹{tx.amount?.toLocaleString("en-IN")}
                </p>
                {tx.type === "income"
                  ? <ArrowUpRight size={12} className="ml-auto text-emerald-500" />
                  : <ArrowDownRight size={12} className="ml-auto text-rose-500" />}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
