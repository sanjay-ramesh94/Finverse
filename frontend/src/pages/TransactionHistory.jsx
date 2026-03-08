import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, Search, SlidersHorizontal, Plus } from "lucide-react";

const CATEGORY_ICONS = {
  food: "🍔", transport: "🚗", shopping: "🛍️", entertainment: "🎮",
  health: "💊", utilities: "⚡", rent: "🏠", salary: "💼",
  freelance: "💻", investment: "📈", gold: "🥇", mutual: "📊",
  default: "💳"
};
const getIcon = (cat) => {
  if (!cat) return CATEGORY_ICONS.default;
  const key = Object.keys(CATEGORY_ICONS).find(k => cat.toLowerCase().includes(k));
  return key ? CATEGORY_ICONS[key] : CATEGORY_ICONS.default;
};

export default function TransactionHistory() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (!user?._id) return;
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/user/${user._id}`)
      .then(res => setTransactions(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/${deleteId}`);
      setTransactions(prev => prev.filter(t => t._id !== deleteId));
      setDeleteId(null);
    } catch {
      alert("Failed to delete transaction.");
    }
  };

  const filtered = transactions
    .filter(t => filter === "all" || t.type === filter)
    .filter(t => !search || (t.note || t.category || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="text-sm text-slate-500 mt-1">{transactions.length} total records</p>
        </div>
        <button onClick={() => navigate("/add")} className="btn-primary">
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="input pl-10"
            placeholder="Search transactions…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "income", "expense", "transfer"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`btn text-xs capitalize px-3 h-11 ${filter === f ? "btn-primary" : "btn-ghost"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-slate-600">
            <p className="text-sm">No transactions found</p>
          </div>
        ) : (
          <div>
            {/* Table Head */}
            <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-3 text-xs text-slate-500 font-semibold uppercase tracking-wider border-b"
              style={{ borderColor: "var(--border)" }}>
              <div>Category</div>
              <div>Description</div>
              <div>Date</div>
              <div>Amount</div>
              <div>Actions</div>
            </div>

            <AnimatePresence>
              {filtered.map((tx, i) => (
                <motion.div
                  key={tx._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: i < 20 ? i * 0.03 : 0 }}
                  className="grid sm:grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-6 py-4 border-b hover:bg-white/[0.02] transition-colors"
                  style={{ borderColor: "var(--border)" }}
                >
                  {/* Icon + Category */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                      style={{ background: "var(--surface-2)" }}>
                      {getIcon(tx.category)}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{tx.note || "No description"}</p>
                    <p className="text-xs text-slate-500 capitalize">{tx.category} · {tx.account}</p>
                  </div>

                  {/* Date */}
                  <p className="text-sm text-slate-500 hidden sm:block whitespace-nowrap">{tx.date}</p>

                  {/* Amount */}
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-semibold ${tx.type === "income" ? "badge-income" : tx.type === "expense" ? "badge-expense" : "badge-transfer"
                      }`}>
                      {tx.type === "income" ? "+" : tx.type === "expense" ? "−" : ""}
                      ₹{tx.amount?.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button onClick={() => navigate(`/edit/${tx._id}`)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleteId(tx._id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="card max-w-sm w-full p-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Delete transaction?</h3>
              <p className="text-sm text-slate-500 mb-6">This action can't be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn-ghost flex-1">Cancel</button>
                <button onClick={handleDelete} className="btn-danger flex-1">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
