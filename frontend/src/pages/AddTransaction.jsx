import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Upload, X } from "lucide-react";
import { useToast } from "../context/ToastContext";

// ─── Category config ────────────────────────────────────────────────
const CATEGORIES = {
  expense: [
    { label: "Food", icon: "🍔" },
    { label: "Transport", icon: "🚗" },
    { label: "Shopping", icon: "🛍️" },
    { label: "Entertainment", icon: "🎮" },
    { label: "Health", icon: "💊" },
    { label: "Utilities", icon: "⚡" },
    { label: "Rent", icon: "🏠" },
    { label: "Education", icon: "📚" },
    { label: "Gold", icon: "🥇" },
    { label: "Other", icon: "💳" },
  ],
  income: [
    { label: "Salary", icon: "💼" },
    { label: "Freelance", icon: "💻" },
    { label: "Investment", icon: "📈" },
    { label: "Bonus", icon: "🎁" },
    { label: "Gift", icon: "🎀" },
    { label: "Other", icon: "💰" },
  ],
  transfer: [
    { label: "Bank Transfer", icon: "🏦" },
    { label: "UPI", icon: "📱" },
    { label: "Cash", icon: "💵" },
    { label: "Card", icon: "💳" },
  ],
};

const QUICK_AMOUNTS = [100, 500, 1000, 2000, 5000, 10000];

const ACCOUNTS = ["Bank", "UPI", "Cash", "Credit Card", "Wallet"];

// ─── Type Selector Card ──────────────────────────────────────────────
const TYPE_CONFIG = {
  expense: { label: "Expense", color: "border-rose-500 bg-rose-500/10 text-rose-400", dot: "bg-rose-500" },
  income: { label: "Income", color: "border-emerald-500 bg-emerald-500/10 text-emerald-400", dot: "bg-emerald-500" },
  transfer: { label: "Transfer", color: "border-indigo-500 bg-indigo-500/10 text-indigo-400", dot: "bg-indigo-500" },
};

// ─── Success overlay ─────────────────────────────────────────────────
function SuccessOverlay({ onDone }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl z-10"
      style={{ background: "var(--surface)" }}
    >
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}>
        <CheckCircle2 size={64} className="text-emerald-400 mb-4" />
      </motion.div>
      <h3 className="text-xl font-semibold text-slate-100 mb-1">Transaction Saved!</h3>
      <p className="text-sm text-slate-500 mb-8">Your record has been added.</p>
      <div className="flex gap-3">
        <button onClick={onDone} className="btn-primary px-6">Add Another</button>
        <button onClick={() => window.history.back()} className="btn-ghost px-6">Go Back</button>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────
export default function AddTransaction() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = location.state || {};
  const toast = useToast();
  const [type, setType] = useState("expense");
  const [image, setImage] = useState(null);
  const [goldPrice, setGoldPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    date: prefill.date || new Date().toISOString().slice(0, 10),
    amount: prefill.amount || "",
    category: prefill.category || "",
    account: "",
    note: prefill.notes || "",
    description: "",
  });

  useEffect(() => {
    if (form.category.toLowerCase() === "gold") {
      axios.get("https://www.goldapi.io/api/XAU/INR", {
        headers: { "x-access-token": "goldapi-erymssmdww9b2c-io", "Content-Type": "application/json" },
      }).then(res => setGoldPrice(res.data.price / 31.1035)).catch(() => { });
    }
  }, [form.category]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const setCategory = (cat) => setForm({ ...form, category: cat });
  const setAccount = (acc) => setForm({ ...form, account: acc });
  const addAmount = (val) => setForm({ ...form, amount: String((Number(form.amount) || 0) + val) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category) return;
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("userId", user?._id);
      fd.append("type", type);
      if (image) fd.append("image", image);
      if (form.category.toLowerCase() === "gold" && type === "expense" && goldPrice) {
        fd.append("liveGoldPricePerGram", goldPrice);
      }
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/transactions`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
    } catch (err) {
      toast({ type: "error", message: "Failed to save transaction. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setForm({ date: new Date().toISOString().slice(0, 10), amount: "", category: "", account: "", note: "", description: "" });
    setImage(null);
    setType("expense");
  };

  const cats = CATEGORIES[type];

  return (
    <div className="max-w-xl mx-auto space-y-6 relative">
      <AnimatePresence>
        {success && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card p-10 flex flex-col items-center text-center max-w-sm w-full"
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}>
                <CheckCircle2 size={56} className="text-emerald-400 mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold text-slate-100 mb-1">Transaction Saved!</h3>
              <p className="text-sm text-slate-500 mb-8">Your record has been added successfully.</p>
              <div className="flex gap-3 w-full">
                <button onClick={resetForm} className="btn-primary flex-1">Add Another</button>
                <button onClick={() => navigate("/home")} className="btn-ghost flex-1">Dashboard</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h1 className="page-title">Add Transaction</h1>
        <p className="text-sm text-slate-500 mt-1">Record a new income, expense, or transfer</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ── Step 1: Type ── */}
        <div className="card p-5">
          <p className="label mb-3">Transaction Type</p>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
              <button key={key} type="button" onClick={() => { setType(key); setForm(f => ({ ...f, category: "" })); }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all font-medium text-sm ${type === key ? cfg.color : "border-transparent hover:border-white/10 text-slate-500"
                  }`}
                style={{ background: type === key ? undefined : "var(--surface-2)" }}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${type === key ? cfg.dot : "bg-slate-600"}`} />
                {cfg.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Step 2: Amount ── */}
        <div className="card p-5 space-y-4">
          <p className="label mb-0">Amount</p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-lg">₹</span>
            <input
              type="number"
              name="amount"
              placeholder="0"
              value={form.amount}
              onChange={handleChange}
              required
              min="1"
              className="input pl-9 text-4xl font-bold h-16 tracking-tight mono"
            />
          </div>
          {/* Quick add chips */}
          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map(v => (
              <button key={v} type="button" onClick={() => addAmount(v)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                style={{ background: "var(--surface-2)" }}>
                +{v.toLocaleString("en-IN")}
              </button>
            ))}
            {form.amount && (
              <button type="button" onClick={() => setForm(f => ({ ...f, amount: "" }))}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-rose-400 transition-colors"
                style={{ background: "var(--surface-2)" }}>
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Step 3: Category ── */}
        <div className="card p-5">
          <p className="label mb-3">Category</p>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {cats.map(c => (
              <button key={c.label} type="button" onClick={() => setCategory(c.label)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all text-xs font-medium ${form.category === c.label
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-white/5"
                  }`}
                style={{ background: form.category === c.label ? undefined : "var(--surface-2)" }}
              >
                <span className="text-xl">{c.icon}</span>
                <span className="truncate w-full text-center">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Step 4: Account ── */}
        <div className="card p-5">
          <p className="label mb-3">Payment Method</p>
          <div className="flex flex-wrap gap-2">
            {ACCOUNTS.map(acc => (
              <button key={acc} type="button" onClick={() => setAccount(acc)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${form.account === acc
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
                  }`}
                style={{ background: form.account === acc ? undefined : "var(--surface-2)" }}
              >
                {acc}
              </button>
            ))}
          </div>
        </div>

        {/* ── Step 5: Details ── */}
        <div className="card p-5 space-y-4">
          <p className="label mb-0">Details</p>
          <div className="form-group">
            <label className="label">Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} className="input" />
          </div>
          <div className="form-group">
            <label className="label">Note <span className="text-slate-600">(optional)</span></label>
            <input type="text" name="note" placeholder="e.g. Lunch with team" value={form.note} onChange={handleChange} className="input" />
          </div>
          <div className="form-group">
            <label className="label">Description <span className="text-slate-600">(optional)</span></label>
            <textarea name="description" placeholder="Add more context…" value={form.description} onChange={handleChange}
              rows={2} className="input resize-none py-3 h-auto" />
          </div>

          {/* ── Image upload ── */}
          <div>
            <label className="label">Receipt / Image <span className="text-slate-600">(optional)</span></label>
            <label htmlFor="image" className="block cursor-pointer">
              {image ? (
                <div className="relative">
                  <img src={URL.createObjectURL(image)} alt="Preview"
                    className="w-full max-h-48 object-cover rounded-xl border" style={{ borderColor: "var(--border)" }} />
                  <button type="button" onClick={(e) => { e.preventDefault(); setImage(null); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-600 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed text-slate-600 hover:text-slate-400 hover:border-indigo-500/50 transition-all"
                  style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
                  <Upload size={22} />
                  <p className="text-sm">Click to upload a receipt</p>
                </div>
              )}
              <input type="file" id="image" accept="image/*" onChange={e => setImage(e.target.files[0])} className="hidden" />
            </label>
          </div>
        </div>

        {/* ── Submit ── */}
        <div className="flex gap-3 pb-4">
          <button type="button" onClick={() => navigate(-1)} className="btn-ghost flex-1 h-12">Cancel</button>
          <button type="submit" disabled={loading || !form.amount || !form.category}
            className="btn-primary flex-1 h-12 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Saving…
              </span>
            ) : "Save Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
}