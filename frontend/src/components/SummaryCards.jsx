import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";

const fmt = (n) => "₹" + n.toLocaleString("en-IN");

export default function SummaryCards({ income, expense, balance }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card p-6 sm:p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-slate-900/10"
      style={{
        background: "linear-gradient(135deg, var(--accent) 0%, #0f172a 100%)",
        color: "white",
        border: "none",
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute left-0 bottom-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

      <div className="relative z-10 flex flex-col gap-6">
        {/* Top: Balance */}
        <div>
          <div className="flex items-center justify-between mb-2 opacity-70">
            <div className="flex items-center gap-2">
              <Wallet size={18} />
              <p className="text-sm font-medium uppercase tracking-widest">Total Balance</p>
            </div>
            <CreditCard size={20} className="opacity-50" />
          </div>
          <p className="text-4xl sm:text-5xl font-bold tracking-tight mono">{fmt(balance)}</p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 my-1"></div>

        {/* Bottom: Income & Expense */}
        <div className="grid grid-cols-2 gap-4">
          {/* Income */}
          <div>
            <div className="flex items-center gap-1.5 opacity-80 mb-1">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <ArrowUpRight size={14} className="text-emerald-400" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-300">Income</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold tracking-tight mono text-slate-100">{fmt(income)}</p>
          </div>

          {/* Expense */}
          <div>
            <div className="flex items-center gap-1.5 opacity-80 mb-1">
              <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center">
                <ArrowDownRight size={14} className="text-rose-400" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-300">Expenses</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold tracking-tight mono text-slate-100">{fmt(expense)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
