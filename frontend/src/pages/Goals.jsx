import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function Goals() {
  const { user } = useContext(UserContext);

  const [goals, setGoals] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [goalForm, setGoalForm] = useState({
    name: "",
    target: "",
    type: "investment",
  });
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

  const getTotalInvested = () => investments.reduce((sum, tx) => sum + tx.amount, 0);

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

      setGoalForm({ name: "", target: "", type: "investment" });
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

  const renderGoal = (goal, color, progress = null) => {
    const current = progress ?? goal.current ?? 0;
    const percentage = Math.min(100, (current / goal.target) * 100).toFixed(1);

    return (
      <div key={goal._id} className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>{goal.name}</span>
          <span>
            ₹{current.toLocaleString()} / ₹{goal.target.toLocaleString()} ({percentage}%)
          </span>
        </div>
        <div className="w-full h-3 bg-zinc-800 rounded overflow-hidden mb-2">
          <div className={`${color} h-full`} style={{ width: `${percentage}%` }}></div>
        </div>

        {/* 💰 Add to Goal */}
        <div className="flex gap-2 items-center mb-2">
          <input
            type="number"
            placeholder="Add ₹"
            value={amountInputs[goal._id] || ""}
            onChange={(e) =>
              setAmountInputs((prev) => ({ ...prev, [goal._id]: e.target.value }))
            }
            className="bg-zinc-800 text-white px-2 py-1 rounded border border-zinc-700 w-24"
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
      </div>
    );
  };

  const investmentGoals = goals.filter((g) => g.type === "investment");
  const shortTermGoals = goals.filter((g) => g.type === "short-term");
  const longTermGoals = goals.filter((g) => g.type === "long-term");

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-4xl mx-auto bg-zinc-900 p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-teal-400 mb-6 text-center">🎯 Goals Dashboard</h2>

        {/* ➕ Add New Goal Form */}
        <form onSubmit={handleAddGoal} className="mb-10 space-y-4">
          <h3 className="text-xl font-semibold text-white">➕ Add New Goal</h3>
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

       

        {/* 🔵 Short-Term Goals */}
        <div className="mt-10 space-y-6">
          <h3 className="text-xl font-semibold text-white mb-2">🗓️ Monthly Short-Term Goals</h3>
          {shortTermGoals.map((goal) => renderGoal(goal, "bg-blue-400", goal.current))}
        </div>

        {/* 🟣 Long-Term Goals */}
        <div className="mt-10 space-y-6">
          <h3 className="text-xl font-semibold text-white mb-2">🚀 Long-Term Goals</h3>
          {longTermGoals.map((goal) => renderGoal(goal, "bg-purple-500"))}
        </div>
      </div>
    </div>
  );
}
