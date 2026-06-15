import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { motion } from "framer-motion";
import { Target, Plus, Trash2, Calendar, Rocket, IndianRupee } from "lucide-react";

export default function Goals() {
  const { user } = useContext(UserContext);
  const [goals, setGoals] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [goalForm, setGoalForm] = useState({ name: "", target: "", type: "short-term" });
  const [amountInputs, setAmountInputs] = useState({});

  const fetchGoalsAndTransactions = async () => {
    try {
      const [resTx, resGoals] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/user/${user?._id}`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/goals/${user?._id}`),
      ]);

      const allTx = resTx.data || [];
      const now = new Date();
      const currentMonth = now.toISOString().slice(0, 7);
      const monthlyTx = allTx.filter((tx) => tx.date?.startsWith(currentMonth));

      const incomeSum = monthlyTx.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
      const expenseSum = monthlyTx.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
      const investTx = allTx.filter((t) => t.isInvestment);

      setMonthlyIncome(incomeSum);
      setMonthlyExpense(expenseSum);
      setInvestments(investTx);
      setGoals(resGoals.data || []);
    } catch (err) {
      console.error("❌ Error loading data:", err.message);
    }
  };

  useEffect(() => {
    if (user?._id) fetchGoalsAndTransactions();
  }, [user]);

  const handleGoalInput = (e) => {
    const { name, value } = e.target;
    setGoalForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    const { name, type, target } = goalForm;
    if (!name || !target || !type) return;

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/goals`, {
        userId: user._id,
        name,
        type,
        target,
      });
      setGoalForm({ name: "", target: "", type: "short-term" });
      fetchGoalsAndTransactions();
    } catch (err) {
      console.error("❌ Failed to add goal:", err.message);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!confirm("Delete this goal?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/goals/${goalId}`);
      fetchGoalsAndTransactions();
    } catch (err) {
      console.error("❌ Failed to delete goal:", err.message);
    }
  };

  const handleAddAmountToGoal = async (goalId) => {
    const amount = parseFloat(amountInputs[goalId]);
    if (!amount || amount <= 0) return;

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/goals/${goalId}/add`, { amount });
      setAmountInputs((prev) => ({ ...prev, [goalId]: "" }));
      fetchGoalsAndTransactions();
    } catch (err) {
      console.error("❌ Failed to update goal:", err.message);
    }
  };

  const renderGoal = (goal, icon, colorClass, index) => {
    const current = goal.current ?? 0;
    const percentage = Math.min(100, (current / goal.target) * 100).toFixed(1);

    return (
      <motion.div
        key={goal._id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="card p-5"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--surface-2)" }}>
                {icon}
             </div>
             <div>
                <h4 className="font-semibold text-slate-900">{goal.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">₹{current.toLocaleString("en-IN")} / ₹{goal.target.toLocaleString("en-IN")}</p>
             </div>
          </div>
          <button
            onClick={() => handleDeleteGoal(goal._id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
            title="Delete Goal"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
          <motion.div
            className={`h-full rounded-full ${colorClass}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-semibold text-slate-700">{percentage}% Achieved</span>
          
          <div className="flex gap-2 items-center">
            <div className="relative">
              <IndianRupee size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="number"
                placeholder="Add amount"
                value={amountInputs[goal._id] || ""}
                onChange={(e) => setAmountInputs((prev) => ({ ...prev, [goal._id]: e.target.value }))}
                className="input py-1.5 pl-7 pr-3 text-xs w-28 h-8"
              />
            </div>
            <button
              onClick={() => handleAddAmountToGoal(goal._id)}
              disabled={!amountInputs[goal._id]}
              className="btn-primary h-8 px-3 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const shortTermGoals = goals.filter((g) => g.type === "short-term");
  const longTermGoals = goals.filter((g) => g.type === "long-term");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Goals</h1>
          <p className="text-sm text-slate-500 mt-1">Track and manage your financial milestones</p>
        </div>
      </div>

      {/* Add Goal Form */}
      <form onSubmit={handleAddGoal} className="card p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Target size={18} className="text-slate-800" />
          <h3 className="font-semibold text-slate-900">Add New Goal</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="text"
            name="name"
            placeholder="Goal Name"
            value={goalForm.name}
            onChange={handleGoalInput}
            className="input"
            required
          />
          <div className="relative">
            <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="number"
              name="target"
              placeholder="Target Amount"
              value={goalForm.target}
              onChange={handleGoalInput}
              className="input pl-8"
              required
            />
          </div>
          <select
            name="type"
            value={goalForm.type}
            onChange={handleGoalInput}
            className="input"
          >
            <option value="short-term">Short-Term</option>
            <option value="long-term">Long-Term</option>
          </select>
          <button type="submit" className="btn-primary h-11 md:h-auto">
            <Plus size={16} className="mr-2" /> Add Goal
          </button>
        </div>
      </form>

      {/* Goal Lists */}
      {shortTermGoals.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-blue-500" />
            <h3 className="text-lg font-semibold text-slate-900">Short-Term Goals</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shortTermGoals.map((goal, i) => renderGoal(goal, <Target size={18} className="text-blue-500" />, "bg-blue-500", i))}
          </div>
        </div>
      )}

      {longTermGoals.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Rocket size={18} className="text-indigo-500" />
            <h3 className="text-lg font-semibold text-slate-900">Long-Term Goals</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {longTermGoals.map((goal, i) => renderGoal(goal, <Target size={18} className="text-indigo-500" />, "bg-indigo-500", i))}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <div className="h-64 flex flex-col items-center justify-center text-slate-500">
          <Target size={48} className="mb-4 text-slate-300" />
          <p>No goals set yet. Add one above to get started!</p>
        </div>
      )}
    </div>
  );
}
