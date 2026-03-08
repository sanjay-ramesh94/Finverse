import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import SummaryCards from "../components/SummaryCards";
import Charts from "../components/Charts";
import RecentTransactions from "../components/RecentTransactions";
import GoalsProgress from "../components/GoalsProgress";
import Insights from "../components/Insights";
import { Plus, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" });

  useEffect(() => {
    if (!user) return navigate("/", { replace: true });
    const fetchData = async () => {
      try {
        const [txRes, goalsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/user/${user._id}`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/goals/${user._id}`)
        ]);
        setTransactions(txRes.data || []);
        setGoals(goalsRes.data || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Derived metrics
  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  // Category totals for chart
  const categoryTotals = {};
  transactions.forEach(tx => {
    if (tx.type === "expense") {
      const cat = tx.category?.trim().toLowerCase() || "other";
      categoryTotals[cat] = (categoryTotals[cat] || 0) + tx.amount;
    }
  });

  // Monthly data for area chart
  const monthlyMap = {};
  transactions.forEach(tx => {
    if (!tx.date) return;
    const m = tx.date.slice(0, 7);
    if (!monthlyMap[m]) monthlyMap[m] = { month: m, income: 0, expense: 0 };
    if (tx.type === "income") monthlyMap[m].income += tx.amount;
    else if (tx.type === "expense") monthlyMap[m].expense += tx.amount;
  });
  const chartData = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // ── Empty state ──────────────────────────────────────────────────────────
  if (transactions.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">{today}</p>
            <h1 className="text-2xl font-bold text-slate-100 mt-0.5">
              {greeting}, {user?.username?.split(" ")[0]} 👋
            </h1>
          </div>
          <Link to="/add" className="btn-primary gap-2">
            <Plus size={16} />
            <span className="hidden sm:inline">Add Transaction</span>
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="card p-8 flex flex-col items-center text-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
            <Sparkles size={28} className="text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Welcome to Finverse!</h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed max-w-sm">
            Your dashboard is ready. Follow these 3 steps to get started and take control of your money.
          </p>
          <div className="w-full space-y-3 mb-8">
            {[
              { step: "01", label: "Add your first income", sub: "Record your salary or any income source", path: "/add" },
              { step: "02", label: "Track your expenses", sub: "Log what you spend daily to spot patterns", path: "/add" },
              { step: "03", label: "Set a savings goal", sub: "Create targets to stay on track", path: "/goals" },
            ].map((item, i) => (
              <Link key={i} to={item.path}
                className="flex items-center gap-4 p-4 rounded-xl text-left transition-all hover:-translate-y-0.5 hover:border-white/15 group"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                <span className="text-xs font-bold text-indigo-400 mono w-6 shrink-0">{item.step}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-200">{item.label}</p>
                  <p className="text-xs text-slate-500 truncate">{item.sub}</p>
                </div>
                <ArrowRight size={15} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </Link>
            ))}
          </div>
          <Link to="/add" className="btn-primary px-8 h-11">
            Add First Transaction
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  // ── Full dashboard ───────────────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{today}</p>
          <h1 className="text-2xl font-bold text-slate-100 mt-0.5">
            {greeting}, {user?.username?.split(" ")[0]}
          </h1>
        </div>
        <Link to="/add" className="btn-primary gap-2">
          <Plus size={16} />
          <span className="hidden sm:inline">Add Transaction</span>
        </Link>
      </div>

      <Insights />
      <SummaryCards income={income} expense={expense} balance={balance} />
      <Charts chartData={chartData} pieData={pieData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions transactions={transactions} />
        <GoalsProgress goals={goals} />
      </div>
    </motion.div>
  );
}
