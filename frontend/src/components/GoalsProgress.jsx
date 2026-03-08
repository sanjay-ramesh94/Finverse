import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const TYPE_COLORS = {
  investment: { bar: "bg-indigo-500", text: "text-indigo-400" },
  "short-term": { bar: "bg-emerald-500", text: "text-emerald-400" },
  "long-term": { bar: "bg-amber-500", text: "text-amber-400" },
};

export default function GoalsProgress({ goals }) {
  const navigate = useNavigate();

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <p className="section-title mb-0">Goals</p>
        <button onClick={() => navigate("/goals")}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
          Manage <ChevronRight size={13} />
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="h-40 flex flex-col items-center justify-center text-slate-600">
          <p className="text-sm">No goals set yet</p>
          <button onClick={() => navigate("/goals")} className="mt-3 btn-ghost text-xs px-3 py-1.5">
            Create a goal
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {goals.slice(0, 4).map((goal, i) => {
            const pct = Math.min(100, (goal.current / goal.target) * 100).toFixed(1);
            const colors = TYPE_COLORS[goal.type] || TYPE_COLORS["long-term"];
            return (
              <motion.div key={goal._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{goal.name}</p>
                    <p className="text-xs text-slate-500 capitalize mt-0.5">{goal.type?.replace("-", " ")}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${colors.text}`}>{pct}%</p>
                    <p className="text-xs text-slate-500">₹{goal.current?.toLocaleString("en-IN")} / ₹{goal.target?.toLocaleString("en-IN")}</p>
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
                  <motion.div
                    className={`h-full rounded-full ${colors.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
