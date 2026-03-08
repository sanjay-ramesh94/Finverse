import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserContext } from "../context/UserContext";
import { useCurrency } from "../context/CurrencyContext";
import { ChevronRight, Pencil, KeyRound, Monitor, Trash2, DollarSign, Info } from "lucide-react";

function SettingRow({ icon: Icon, label, sub, onClick, danger }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all ${danger ? "hover:bg-rose-500/10 hover:text-rose-400" : "hover:bg-white/5"
      }`} style={{ background: "var(--surface-2)" }}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${danger ? "bg-rose-500/10" : "bg-indigo-500/10"}`}>
        <Icon size={17} className={danger ? "text-rose-400" : "text-indigo-400"} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${danger ? "text-rose-400" : "text-slate-200"}`}>{label}</p>
        {sub && <p className="text-xs text-slate-500 truncate mt-0.5">{sub}</p>}
      </div>
      <ChevronRight size={16} className="text-slate-600 shrink-0" />
    </button>
  );
}

export default function Settings() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { currency, setCurrency, currencies } = useCurrency();

  const sections = [
    {
      title: "Profile",
      items: [
        { icon: Pencil, label: "Edit Username", sub: user?.username, onClick: () => navigate("/edit-username") },
      ],
    },
    {
      title: "Security",
      items: [
        { icon: KeyRound, label: "Change Password", onClick: () => navigate("/change-password") },
        { icon: Monitor, label: "Devices & Login History", onClick: () => navigate("/login-history") },
      ],
    },
  ];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account and preferences</p>
      </div>

      {sections.map((section, si) => (
        <motion.div key={section.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.07 }}
          className="space-y-2">
          <p className="text-xs text-slate-600 font-semibold uppercase tracking-widest px-1">{section.title}</p>
          <div className="card overflow-hidden divide-y" style={{ "--tw-divide-opacity": 1 }}>
            {section.items.map(item => (
              <SettingRow key={item.label} {...item} />
            ))}
          </div>
        </motion.div>
      ))}

      {/* Currency */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-2">
        <p className="text-xs text-slate-600 font-semibold uppercase tracking-widest px-1">Preferences</p>
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
              <DollarSign size={17} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">Currency</p>
              <p className="text-xs text-slate-500">Displayed across the app</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {currencies.map(c => (
              <button key={c.code} onClick={() => setCurrency(c)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${currency.code === c.code ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                style={{ background: currency.code === c.code ? undefined : "var(--surface-2)" }}>
                <span className="font-bold mr-1.5">{c.symbol}</span>
                <span className="text-xs">{c.code}</span>
                <p className="text-xs opacity-60 truncate mt-0.5">{c.label}</p>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-2">
        <p className="text-xs text-slate-600 font-semibold uppercase tracking-widest px-1">Danger Zone</p>
        <div className="card overflow-hidden">
          <SettingRow icon={Trash2} label="Delete Account" sub="Permanently delete your data" onClick={() => navigate("/delete-account")} danger />
        </div>
      </motion.div>

      {/* About */}
      <div className="card p-4 flex items-center gap-3">
        <Info size={16} className="text-slate-600" />
        <div>
          <p className="text-xs text-slate-500">Finverse v1.0.0 · Built with ❤️</p>
          <p className="text-xs text-slate-600">i.sanjayramesh94@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
