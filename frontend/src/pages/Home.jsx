import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { motion } from "framer-motion";
import {
  HomeIcon,
  ChartBarIcon,
  CashIcon,
  TrendingUpIcon,
  LogoutIcon,
  PlusIcon,
  CalculatorIcon
} from "@heroicons/react/outline";
import SummaryCards from "../components/SummaryCards";
import Charts from "../components/Charts";
import RecentTransactions from "../components/RecentTransactions";
import GoalsProgress from "../components/GoalsProgress";
import Insights from "../components/Insights";

const containerVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.2 } }
};
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Home() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    if (!user) return navigate("/", { replace: true });
    fetchData();
  }, [user]);

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
    }
  };

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          console.log("🔔 Notifications allowed");
        } else {
          console.warn("🚫 Notifications denied");
        }
      });
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    const target = new Date();
    target.setHours(21, 0, 0, 0);

    let delay = target.getTime() - now.getTime();
    if (delay < 0) delay += 24 * 60 * 60 * 1000;

    const timeout = setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification("💰 Don’t forget!", {
          body: "Log your expenses today before midnight!",
          icon: "/icon.png"
        });
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, []);

  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const savings = income - expense;

  const categoryTotals = {};
  transactions.forEach(tx => {
    if (tx.type === "expense") {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
    }
  });
  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#8b5cf6"]
      }
    ]
  };

  const monthlyInc = {}, monthlyExp = {};
  transactions.forEach(tx => {
    const m = tx.date.slice(0, 7);
    if (tx.type === "income") monthlyInc[m] = (monthlyInc[m] || 0) + tx.amount;
    else if (tx.type === "expense") monthlyExp[m] = (monthlyExp[m] || 0) + tx.amount;
  });
  const months = Object.keys({ ...monthlyInc, ...monthlyExp }).sort();
  const barData = {
    labels: months,
    datasets: [
      { label: "Income", data: months.map(m => monthlyInc[m] || 0), backgroundColor: "#22c55e" },
      { label: "Expense", data: months.map(m => monthlyExp[m] || 0), backgroundColor: "#ef4444" }
    ]
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white">
      <nav className="fixed top-0 left-0 h-full w-60 bg-zinc-900 p-6 hidden md:flex flex-col space-y-6">
        <h1 className="text-2xl font-bold text-teal-400 flex items-center space-x-2">
          <ChartBarIcon className="h-6 w-6" /> Finverse
        </h1>
        <Link to="/" className="flex items-center space-x-2 hover:scale-105 transition">
          <HomeIcon className="h-5 w-5" /> <span>Dashboard</span>
        </Link>
        <Link to="/add" className="flex items-center space-x-2 hover:scale-105 transition">
          <PlusIcon className="h-5 w-5" /> <span>Add Transaction</span>
        </Link>
        <Link to="/history" className="flex items-center space-x-2 hover:scale-105 transition">
          <TrendingUpIcon className="h-5 w-5" /> <span>History</span>
        </Link>
        <Link to="/calculators" className="flex items-center space-x-2 hover:scale-105 transition">
          <CalculatorIcon className="h-5 w-5" /> <span>Calculator</span>
        </Link>
        <Link to="/goals" className="flex items-center space-x-2 hover:scale-105 transition">
          <CashIcon className="h-5 w-5" /> <span>Goals</span>
        </Link>
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center space-x-2 text-red-500 hover:text-red-400"
        >
          <LogoutIcon className="h-5 w-5" /> <span>Logout</span>
        </button>
      </nav>

      <main className="flex-1 p-6 md:ml-60 overflow-auto">
        <motion.div
          className="space-y-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={cardVariants} className="flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-3xl font-bold text-teal-400">
              📊 {getGreeting()}, {user.username}!
            </h2>
            <button
              onClick={handleLogout}
              className="md:hidden bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </motion.div>

          <motion.div variants={cardVariants}><Insights /></motion.div>
          <motion.div variants={cardVariants}><SummaryCards income={income} expense={expense} savings={savings} /></motion.div>
          <motion.div variants={cardVariants}><Charts barData={barData} pieData={pieData} /></motion.div>
          <motion.div variants={cardVariants}><RecentTransactions transactions={transactions} /></motion.div>
          <motion.div variants={cardVariants}><GoalsProgress goals={goals} /></motion.div>

          <motion.div variants={cardVariants} className="text-center">
            <Link
              to="/add"
              className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition"
            >
              ➕ Add New Transaction
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
