import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import {
    LayoutDashboard, ArrowLeftRight, Target, TrendingUp,
    Calculator, BarChart3, Settings, LogOut, Wallet,
    PieChart, FileBarChart2
} from "lucide-react";

const navItems = [
    { to: "/home", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/history", icon: ArrowLeftRight, label: "Transactions" },
    { to: "/report", icon: FileBarChart2, label: "Reports" },
    { to: "/budget", icon: PieChart, label: "Budget" },
    { to: "/goals", icon: Target, label: "Goals" },
    { to: "/investment", icon: TrendingUp, label: "Investments" },
    { to: "/calculators", icon: Calculator, label: "Calculators" },
    { to: "/wealth-dashboard", icon: BarChart3, label: "Wealth" },
    { to: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
    };

    return (
        <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-16 hover:w-60 overflow-hidden group transition-all duration-300 z-40"
            style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}>

            {/* Gradient accent bar at top */}
            <div className="h-0.5 w-full shrink-0" style={{ background: "linear-gradient(90deg, #6366F1, #8B5CF6, #06B6D4)" }} />

            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 shrink-0">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/30">
                    <Wallet size={16} className="text-white" />
                </div>
                <span className="font-bold text-slate-100 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Finverse
                </span>
            </div>

            <div className="divider mx-3 mb-4" />

            {/* Nav Items */}
            <nav className="flex-1 flex flex-col gap-0.5 px-2 overflow-y-auto overflow-x-hidden">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                ? "text-white"
                                : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]"
                            }`
                        }
                        style={({ isActive }) => isActive ? { background: "rgba(99,102,241,0.15)" } : {}}
                    >
                        {({ isActive }) => (
                            <>
                                {/* Pill indicator */}
                                <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-200 ${isActive ? "h-5 bg-indigo-400" : "h-0"}`} />
                                <Icon size={18} className={`shrink-0 ${isActive ? "text-indigo-400" : ""}`} />
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                    {label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User + Logout */}
            <div className="px-2 pb-4 flex flex-col gap-1">
                <div className="divider mx-1 mb-2" />
                <div className="flex items-center gap-3 px-3 py-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 text-xs font-bold text-white uppercase shadow-md shadow-indigo-600/30">
                        {user?.username?.charAt(0) || "U"}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 min-w-0">
                        <p className="text-sm font-semibold text-slate-200 truncate">{user?.username}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
                >
                    <LogOut size={18} className="shrink-0" />
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                        Sign Out
                    </span>
                </button>
            </div>
        </aside>
    );
}
