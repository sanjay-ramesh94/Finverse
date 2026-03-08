import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useToast } from "../context/ToastContext";
import { useCurrency } from "../context/CurrencyContext";
import { motion } from "framer-motion";
import { Target, PlusCircle, Trash2, AlertCircle } from "lucide-react";

const EXPENSE_CATS = [
    "Food", "Transport", "Shopping", "Entertainment",
    "Health", "Utilities", "Rent", "Education", "Gold", "Other"
];

const STORAGE_KEY_PREFIX = "fv_budgets_";

export default function BudgetPage() {
    const { user } = useContext(UserContext);
    const toast = useToast();
    const { fmt } = useCurrency();
    const storageKey = STORAGE_KEY_PREFIX + (user?._id || "guest");

    const [budgets, setBudgets] = useState(() => {
        try { return JSON.parse(localStorage.getItem(storageKey)) || {}; }
        catch { return {}; }
    });
    const [transactions, setTransactions] = useState([]);
    const [adding, setAdding] = useState(false);
    const [newCat, setNewCat] = useState("Food");
    const [newLimit, setNewLimit] = useState("");

    useEffect(() => {
        if (!user?._id) return;
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        import("axios").then(({ default: axios }) =>
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/user/${user._id}`)
                .then(r => setTransactions((r.data || []).filter(t => t.date?.startsWith(month) && t.type === "expense")))
        );
    }, [user]);

    const saveBudgets = (next) => {
        setBudgets(next);
        localStorage.setItem(storageKey, JSON.stringify(next));
    };

    const addBudget = () => {
        if (!newLimit || Number(newLimit) <= 0) return toast({ type: "warning", message: "Enter a valid limit." });
        saveBudgets({ ...budgets, [newCat.toLowerCase()]: Number(newLimit) });
        setNewLimit(""); setAdding(false);
        toast({ type: "success", message: `Budget set for ${newCat}.` });
    };

    const removeBudget = (cat) => {
        const next = { ...budgets };
        delete next[cat];
        saveBudgets(next);
        toast({ type: "info", message: `Budget for ${cat} removed.` });
    };

    const getSpent = (cat) =>
        transactions.filter(t => t.category?.toLowerCase() === cat.toLowerCase()).reduce((s, t) => s + t.amount, 0);

    const entries = Object.entries(budgets);

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="page-title">Budget Limits</h1>
                    <p className="text-sm text-slate-500 mt-1">Set monthly spending limits per category</p>
                </div>
                <button onClick={() => setAdding(true)} className="btn-primary gap-2">
                    <PlusCircle size={16} /> Add Budget
                </button>
            </div>

            {/* Add form */}
            {adding && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="card p-5 space-y-4">
                    <p className="text-sm font-semibold text-slate-200">New Budget Limit</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <select value={newCat} onChange={e => setNewCat(e.target.value)} className="input sm:col-span-1">
                            {EXPENSE_CATS.filter(c => !budgets[c.toLowerCase()]).map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <div className="relative sm:col-span-1">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
                            <input type="number" placeholder="Monthly limit" value={newLimit} onChange={e => setNewLimit(e.target.value)}
                                className="input pl-8" min="1" />
                        </div>
                        <div className="flex gap-2 sm:col-span-1">
                            <button onClick={addBudget} className="btn-primary flex-1">Save</button>
                            <button onClick={() => setAdding(false)} className="btn-ghost flex-1">Cancel</button>
                        </div>
                    </div>
                </motion.div>
            )}

            {entries.length === 0 && !adding ? (
                <div className="card p-12 flex flex-col items-center text-center">
                    <Target size={40} className="text-slate-700 mb-3" />
                    <p className="text-slate-400 font-medium">No budgets set yet</p>
                    <p className="text-sm text-slate-600 mt-1">Add a limit to track your spending per category</p>
                    <button onClick={() => setAdding(true)} className="btn-primary mt-5">Set First Budget</button>
                </div>
            ) : (
                <div className="space-y-4">
                    {entries.map(([cat, limit], i) => {
                        const spent = getSpent(cat);
                        const pct = Math.min(100, (spent / limit) * 100);
                        const over = spent > limit;
                        const near = !over && pct >= 80;
                        return (
                            <motion.div key={cat} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                                className="card p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-200 capitalize">{cat}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {fmt(spent)} spent of {fmt(limit)} limit
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {over && <span className="badge badge-expense gap-1"><AlertCircle size={11} /> Over budget</span>}
                                        {near && !over && <span className="badge text-amber-400 bg-amber-500/10">Near limit</span>}
                                        <button onClick={() => removeBudget(cat)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${pct}%` }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className={`h-full rounded-full ${over ? "bg-rose-500" : near ? "bg-amber-500" : "bg-indigo-500"}`}
                                    />
                                </div>
                                <p className={`text-xs mt-2 text-right font-medium ${over ? "text-rose-400" : near ? "text-amber-400" : "text-slate-500"}`}>
                                    {pct.toFixed(0)}%
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
