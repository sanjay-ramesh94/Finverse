import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useToast } from "../context/ToastContext";
import { motion } from "framer-motion";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Download, TrendingUp, TrendingDown, Wallet, Target, ArrowUpRight, ArrowDownRight, BarChart3 } from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, LineChart, Line, Legend
} from "recharts";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="card px-4 py-3 text-sm shadow-xl">
            {label && <p className="text-slate-400 mb-2 font-medium">{label}</p>}
            {payload.map(p => (
                <div key={p.name} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-slate-300 capitalize">{p.name}:</span>
                    <span className="font-semibold text-slate-100">₹{Number(p.value).toLocaleString("en-IN")}</span>
                </div>
            ))}
        </div>
    );
};

export default function MonthlyReport() {
    const { user } = useContext(UserContext);
    const toast = useToast();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const n = new Date();
        return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
    });

    useEffect(() => {
        if (!user?._id) return;
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/user/${user._id}`)
            .then(r => setTransactions(r.data || []))
            .catch(() => toast({ type: "error", message: "Failed to load transactions." }))
            .finally(() => setLoading(false));
    }, [user]);

    // Available months
    const months = [...new Set(transactions.map(t => t.date?.slice(0, 7)))].sort().reverse();

    // Filter to selected month
    const monthTxns = transactions.filter(t => t.date?.startsWith(selectedMonth));
    const prevMonth = (() => {
        const [y, m] = selectedMonth.split("-").map(Number);
        const d = new Date(y, m - 2, 1);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    })();
    const prevTxns = transactions.filter(t => t.date?.startsWith(prevMonth));

    const income = monthTxns.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = monthTxns.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const savings = income - expense;
    const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : 0;

    const prevExpense = prevTxns.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const expenseChange = prevExpense > 0 ? (((expense - prevExpense) / prevExpense) * 100).toFixed(1) : 0;

    // Category breakdown
    const catMap = {};
    monthTxns.filter(t => t.type === "expense").forEach(t => {
        const k = t.category?.trim().toLowerCase() || "other";
        catMap[k] = (catMap[k] || 0) + t.amount;
    });
    const catData = Object.entries(catMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

    // Daily trend
    const dayMap = {};
    monthTxns.forEach(t => {
        const d = t.date?.slice(8, 10);
        if (!d) return;
        if (!dayMap[d]) dayMap[d] = { day: d, income: 0, expense: 0 };
        if (t.type === "income") dayMap[d].income += t.amount;
        if (t.type === "expense") dayMap[d].expense += t.amount;
    });
    const dailyData = Object.values(dayMap).sort((a, b) => Number(a.day) - Number(b.day));

    // CSV export
    const exportCSV = () => {
        const header = "Date,Type,Category,Account,Amount,Note";
        const rows = monthTxns.map(t => `${t.date},${t.type},${t.category},${t.account},${t.amount},"${t.note || ""}"`);
        const csv = [header, ...rows].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `finverse-${selectedMonth}.csv`; a.click();
        URL.revokeObjectURL(url);
        toast({ type: "success", message: `Exported ${monthTxns.length} transactions as CSV.` });
    };

    const fmt = n => "₹" + n.toLocaleString("en-IN");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="page-title">Monthly Report</h1>
                    <p className="text-sm text-slate-500 mt-1">Detailed breakdown of your finances</p>
                </div>
                <div className="flex items-center gap-3">
                    <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
                        className="input w-auto text-sm px-3 h-10">
                        {months.length === 0
                            ? <option value={selectedMonth}>{selectedMonth}</option>
                            : months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <button onClick={exportCSV} className="btn-ghost gap-2 h-10">
                        <Download size={15} /> Export CSV
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="h-48 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                </div>
            ) : (
                <>
                    {/* KPI cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: "Income", value: fmt(income), icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                            {
                                label: "Expenses", value: fmt(expense), icon: TrendingDown, color: "text-rose-400", bg: "bg-rose-500/10",
                                sub: prevExpense > 0 ? `${expenseChange > 0 ? "+" : ""}${expenseChange}% vs last month` : null,
                                subColor: expenseChange > 0 ? "text-rose-400" : "text-emerald-400"
                            },
                            { label: "Net Savings", value: fmt(savings), icon: Wallet, color: savings >= 0 ? "text-indigo-400" : "text-rose-400", bg: "bg-indigo-500/10" },
                            { label: "Savings Rate", value: `${savingsRate}%`, icon: Target, color: "text-amber-400", bg: "bg-amber-500/10" },
                        ].map((c, i) => (
                            <motion.div key={c.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                                className="card p-5">
                                <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
                                    <c.icon size={17} className={c.color} />
                                </div>
                                <p className="text-xs text-slate-500 font-medium">{c.label}</p>
                                <p className={`text-xl font-bold tracking-tight mt-0.5 ${c.color}`}>{c.value}</p>
                                {c.sub && <p className={`text-xs mt-1 ${c.subColor}`}>{c.sub}</p>}
                            </motion.div>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Daily trend */}
                        <div className="card p-6">
                            <p className="section-title">Daily Cash Flow</p>
                            {dailyData.length === 0 ? (
                                <div className="h-48 flex items-center justify-center text-slate-600 text-sm">No data for this month</div>
                            ) : (
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={dailyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                        <XAxis dataKey="day" tick={{ fill: "#64748B", fontSize: 11 }} tickLine={false} axisLine={false} />
                                        <YAxis tick={{ fill: "#64748B", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line type="monotone" dataKey="income" name="Income" stroke="#10B981" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="expense" name="Expenses" stroke="#F43F5E" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Category bar */}
                        <div className="card p-6">
                            <p className="section-title">Spending by Category</p>
                            {catData.length === 0 ? (
                                <div className="h-48 flex items-center justify-center text-slate-600 text-sm">No expense data</div>
                            ) : (
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={catData} layout="vertical" margin={{ left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                                        <XAxis type="number" tick={{ fill: "#64748B", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                                        <YAxis type="category" dataKey="name" tick={{ fill: "#94A3B8", fontSize: 11 }} tickLine={false} axisLine={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="value" name="Amount" fill="#6366F1" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Top transactions table */}
                    <div className="card overflow-hidden">
                        <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                            <p className="section-title mb-0">Transactions — {selectedMonth}</p>
                        </div>
                        {monthTxns.length === 0 ? (
                            <div className="h-32 flex items-center justify-center text-slate-600 text-sm">No transactions this month</div>
                        ) : (
                            monthTxns.sort((a, b) => new Date(b.date) - new Date(a.date)).map((tx, i) => (
                                <div key={tx._id} className="flex items-center gap-4 px-6 py-3.5 border-b hover:bg-white/[0.02] transition-colors"
                                    style={{ borderColor: "var(--border)" }}>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-200 truncate">{tx.note || "No note"}</p>
                                        <p className="text-xs text-slate-500 capitalize">{tx.date} · {tx.category}</p>
                                    </div>
                                    <span className={`text-sm font-semibold ${tx.type === "income" ? "text-emerald-400" : "text-rose-400"}`}>
                                        {tx.type === "income" ? "+" : "−"}₹{tx.amount?.toLocaleString("en-IN")}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
