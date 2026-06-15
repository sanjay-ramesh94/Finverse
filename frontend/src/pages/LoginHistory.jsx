import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { History, ArrowLeft, Smartphone, Monitor, Laptop } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginHistory() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!user?._id) return;

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/${user._id}/logins`)
      .then(res => setHistory(res.data))
      .catch(err => console.error("Fetch login history error:", err));
  }, [user]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto mt-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn-ghost w-9 h-9 p-0 flex items-center justify-center">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="page-title">Login History</h1>
          <p className="text-sm text-slate-500 mt-0.5">Recent account activity and devices</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-5 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--surface-2)" }}>
              <History size={18} className="text-blue-500" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Session Logs</h2>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No login history available.
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {history.slice().reverse().map((entry, idx) => {
              const isMobile = entry.device.includes("iPhone") || entry.device.includes("Android");
              const isMac = entry.device.includes("Mac");
              return (
                <div key={idx} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 border" style={{ borderColor: "var(--border)" }}>
                      {isMobile ? <Smartphone size={16} /> : isMac ? <Laptop size={16} /> : <Monitor size={16} />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        {entry.device.includes("iPhone") ? "iPhone"
                          : entry.device.includes("Android") ? "Android"
                          : entry.device.includes("Windows") ? "Windows PC"
                          : entry.device.includes("Mac") ? "Mac"
                          : "Other Device"}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{entry.city || "Unknown City"}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>{entry.ip || "Unknown IP"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-slate-400 sm:text-right pl-[54px] sm:pl-0">
                    {new Date(entry.timestamp).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
