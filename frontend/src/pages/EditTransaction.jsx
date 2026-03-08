import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useToast } from "../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ArrowLeft } from "lucide-react";

const CATEGORIES = {
  expense: [
    { label: "Food", icon: "🍔" }, { label: "Transport", icon: "🚗" },
    { label: "Shopping", icon: "🛍️" }, { label: "Entertainment", icon: "🎮" },
    { label: "Health", icon: "💊" }, { label: "Utilities", icon: "⚡" },
    { label: "Rent", icon: "🏠" }, { label: "Education", icon: "📚" },
    { label: "Gold", icon: "🥇" }, { label: "Other", icon: "💳" },
  ],
  income: [
    { label: "Salary", icon: "💼" }, { label: "Freelance", icon: "💻" },
    { label: "Investment", icon: "📈" }, { label: "Bonus", icon: "🎁" },
    { label: "Gift", icon: "🎀" }, { label: "Other", icon: "💰" },
  ],
  transfer: [
    { label: "Bank Transfer", icon: "🏦" }, { label: "UPI", icon: "📱" },
    { label: "Cash", icon: "💵" }, { label: "Card", icon: "💳" },
  ],
};

const TYPE_CONFIG = {
  expense: { label: "Expense", color: "border-rose-500 bg-rose-500/10 text-rose-400", dot: "bg-rose-500" },
  income: { label: "Income", color: "border-emerald-500 bg-emerald-500/10 text-emerald-400", dot: "bg-emerald-500" },
  transfer: { label: "Transfer", color: "border-indigo-500 bg-indigo-500/10 text-indigo-400", dot: "bg-indigo-500" },
};

const ACCOUNTS = ["Bank", "UPI", "Cash", "Credit Card", "Wallet"];
const QUICK_AMOUNTS = [100, 500, 1000, 2000, 5000, 10000];

export default function EditTransaction() {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [type, setType] = useState("expense");
  const [existingImage, setExistingImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({ date: "", amount: "", category: "", account: "", note: "", description: "" });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/${id}`)
      .then(res => {
        const tx = res.data;
        setForm({ date: tx.date || "", amount: tx.amount || "", category: tx.category || "", account: tx.account || "", note: tx.note || "", description: tx.description || "" });
        setType(tx.type || "expense");
        setExistingImage(tx.image || "");
      })
      .catch(() => toast({ type: "error", message: "Failed to load transaction." }))
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const addAmount = (val) => setForm(f => ({ ...f, amount: String((Number(f.amount) || 0) + val) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("type", type);
      fd.append("userId", user._id);
      if (newImage) fd.append("image", newImage);
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast({ type: "success", title: "Updated!", message: "Transaction has been updated." });
      navigate("/history");
    } catch {
      toast({ type: "error", message: "Update failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
    </div>
  );

  const cats = CATEGORIES[type] || CATEGORIES.expense;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn-ghost w-9 h-9 p-0 flex items-center justify-center">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="page-title">Edit Transaction</h1>
          <p className="text-sm text-slate-500 mt-0.5">Update your transaction details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type */}
        <div className="card p-5">
          <p className="label mb-3">Transaction Type</p>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
              <button key={key} type="button" onClick={() => { setType(key); setForm(f => ({ ...f, category: "" })); }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all font-medium text-sm ${type === key ? cfg.color : "border-transparent text-slate-500 hover:border-white/10"}`}
                style={{ background: type === key ? undefined : "var(--surface-2)" }}>
                <span className={`w-2.5 h-2.5 rounded-full ${type === key ? cfg.dot : "bg-slate-600"}`} />
                {cfg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div className="card p-5 space-y-4">
          <p className="label mb-0">Amount</p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-lg">₹</span>
            <input type="number" name="amount" placeholder="0" value={form.amount} onChange={handleChange}
              required min="1" className="input pl-9 text-xl font-bold h-14" />
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map(v => (
              <button key={v} type="button" onClick={() => addAmount(v)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                style={{ background: "var(--surface-2)" }}>+{v.toLocaleString("en-IN")}</button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="card p-5">
          <p className="label mb-3">Category</p>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {cats.map(c => (
              <button key={c.label} type="button" onClick={() => setForm(f => ({ ...f, category: c.label }))}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all text-xs font-medium ${form.category === c.label ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-white/5"}`}
                style={{ background: form.category === c.label ? undefined : "var(--surface-2)" }}>
                <span className="text-xl">{c.icon}</span>
                <span className="truncate w-full text-center">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Account */}
        <div className="card p-5">
          <p className="label mb-3">Payment Method</p>
          <div className="flex flex-wrap gap-2">
            {ACCOUNTS.map(acc => (
              <button key={acc} type="button" onClick={() => setForm(f => ({ ...f, account: acc }))}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${form.account === acc ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
                style={{ background: form.account === acc ? undefined : "var(--surface-2)" }}>{acc}</button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="card p-5 space-y-4">
          <p className="label mb-0">Details</p>
          <div className="form-group">
            <label className="label">Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} className="input" />
          </div>
          <div className="form-group">
            <label className="label">Note</label>
            <input type="text" name="note" placeholder="e.g. Lunch with team" value={form.note} onChange={handleChange} className="input" />
          </div>
          <div className="form-group">
            <label className="label">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="input resize-none py-3 h-auto" />
          </div>
          <div>
            <label className="label">Receipt / Image</label>
            <label htmlFor="image-edit" className="block cursor-pointer">
              {newImage ? (
                <div className="relative">
                  <img src={URL.createObjectURL(newImage)} alt="New" className="w-full max-h-48 object-cover rounded-xl border" style={{ borderColor: "var(--border)" }} />
                  <button type="button" onClick={e => { e.preventDefault(); setNewImage(null); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-600 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ) : existingImage ? (
                <div className="relative">
                  <img src={`${import.meta.env.VITE_BACKEND_URL}${existingImage}`} alt="Existing" className="w-full max-h-48 object-cover rounded-xl border" style={{ borderColor: "var(--border)" }} />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                    <p className="text-sm text-white font-medium">Click to replace</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed text-slate-600 hover:text-slate-400 hover:border-indigo-500/50 transition-all"
                  style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
                  <Upload size={22} /><p className="text-sm">Click to upload receipt</p>
                </div>
              )}
              <input type="file" id="image-edit" accept="image/*" onChange={e => setNewImage(e.target.files[0])} className="hidden" />
            </label>
          </div>
        </div>

        <div className="flex gap-3 pb-4">
          <button type="button" onClick={() => navigate(-1)} className="btn-ghost flex-1 h-12">Cancel</button>
          <button type="submit" disabled={loading || !form.amount || !form.category}
            className="btn-primary flex-1 h-12 disabled:opacity-50">
            {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Saving…</span> : "Update Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
}
