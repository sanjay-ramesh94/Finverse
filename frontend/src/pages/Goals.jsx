import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { motion } from "framer-motion";

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

  const renderGoal = (goal, color, index) => {
    const current = goal.current ?? 0;
    const percentage = Math.min(100, (current / goal.target) * 100).toFixed(1);

    return (
      <motion.div
        key={goal._id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="mb-6 p-4 bg-zinc-800 rounded-lg shadow-lg"
      >
        <div className="flex justify-between text-sm mb-1">
          <span>{goal.name}</span>
          <span>
            ₹{current.toLocaleString()} / ₹{goal.target.toLocaleString()} ({percentage}%)
          </span>
        </div>
        <div className="w-full h-3 bg-zinc-900 rounded overflow-hidden mb-2">
          <motion.div
            className={`${color} h-full`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Add ₹"
            value={amountInputs[goal._id] || ""}
            onChange={(e) => setAmountInputs((prev) => ({ ...prev, [goal._id]: e.target.value }))}
            className="bg-zinc-900 text-white px-2 py-1 rounded border border-zinc-700 w-24"
          />
          <button
            onClick={() => handleAddAmountToGoal(goal._id)}
            className="bg-teal-600 px-2 py-1 text-sm rounded text-white hover:bg-teal-700"
          >
            ➕ Add
          </button>
          <button
            onClick={() => handleDeleteGoal(goal._id)}
            className="text-red-400 text-xs hover:underline ml-auto"
          >
            ❌ Delete
          </button>
        </div>
      </motion.div>
    );
  };

  const shortTermGoals = goals.filter((g) => g.type === "short-term");
  const longTermGoals = goals.filter((g) => g.type === "long-term");

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-4xl mx-auto bg-zinc-900 p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-teal-400 mb-6 text-center">🎯 Goals Dashboard</h2>

        <form onSubmit={handleAddGoal} className="mb-10 space-y-4">
          <h3 className="text-xl font-semibold">➕ Add New Goal</h3>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              name="name"
              placeholder="Goal Name"
              value={goalForm.name}
              onChange={handleGoalInput}
              className="px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-600"
              required
            />
            <input
              type="number"
              name="target"
              placeholder="Target Amount"
              value={goalForm.target}
              onChange={handleGoalInput}
              className="px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-600"
              required
            />
            <select
              name="type"
              value={goalForm.type}
              onChange={handleGoalInput}
              className="px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-600"
            >
              <option value="short-term">Short-Term</option>
              <option value="long-term">Long-Term</option>
            </select>
            <button
              type="submit"
              className="bg-teal-500 px-4 py-2 rounded text-white hover:bg-teal-600"
            >
              ➕ Add Goal
            </button>
          </div>
        </form>

        {shortTermGoals.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-2">🗓️ Short-Term Goals</h3>
            {shortTermGoals.map((goal, i) => renderGoal(goal, "bg-blue-500", i))}
          </div>
        )}

        {longTermGoals.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-2">🚀 Long-Term Goals</h3>
            {longTermGoals.map((goal, i) => renderGoal(goal, "bg-purple-500", i))}
          </div>
        )}
      </div>
    </div>
  );
}
