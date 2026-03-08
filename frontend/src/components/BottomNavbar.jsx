import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, ArrowLeftRight, Target, PlusCircle, Settings } from "lucide-react";

const tabs = [
  { to: "/home", icon: LayoutDashboard, label: "Home" },
  { to: "/history", icon: ArrowLeftRight, label: "Txns" },
  { to: "/goals", icon: Target, label: "Goals" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function BottomNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
      <div className="flex items-center justify-around h-16 px-2">
        {/* Home */}
        <button onClick={() => navigate("/home")}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${isActive("/home") ? "text-indigo-400" : "text-slate-500"}`}>
          <LayoutDashboard size={22} />
          <span>Home</span>
        </button>

        {/* Transactions */}
        <button onClick={() => navigate("/history")}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${isActive("/history") ? "text-indigo-400" : "text-slate-500"}`}>
          <ArrowLeftRight size={22} />
          <span>Txns</span>
        </button>

        {/* FAB Add */}
        <button onClick={() => navigate("/add")}
          className="flex items-center justify-center w-14 h-14 rounded-2xl text-white shadow-lg -mt-6 transition-all active:scale-95"
          style={{ background: "var(--accent)" }}>
          <PlusCircle size={28} />
        </button>

        {/* Goals */}
        <button onClick={() => navigate("/goals")}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${isActive("/goals") ? "text-indigo-400" : "text-slate-500"}`}>
          <Target size={22} />
          <span>Goals</span>
        </button>

        {/* Settings */}
        <button onClick={() => navigate("/settings")}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${isActive("/settings") ? "text-indigo-400" : "text-slate-500"}`}>
          <Settings size={22} />
          <span>Settings</span>
        </button>
      </div>
    </nav>
  );
}
