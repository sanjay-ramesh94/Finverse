import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const COLORS = ["#6366F1", "#10B981", "#F43F5E", "#F59E0B", "#8B5CF6", "#06B6D4", "#EC4899"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-4 py-3 text-sm shadow-xl">
      {label && <p className="text-slate-500 mb-2 font-medium">{label}</p>}
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-600 capitalize">{p.name}:</span>
          <span className="font-semibold text-slate-900">₹{Number(p.value).toLocaleString("en-IN")}</span>
        </div>
      ))}
    </div>
  );
};

export default function Charts({ pieData }) {
  return (
    <div className="card p-6 flex flex-col h-full">
        <div className="mb-5">
          <p className="section-title">Spending</p>
          <p className="text-xs text-slate-500">Expense breakdown by category</p>
        </div>
        {pieData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                  paddingAngle={3} dataKey="value">
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {pieData.slice(0, 4).map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: COLORS[idx % COLORS.length] }} />
                    <span className="text-slate-500 capitalize">{item.name}</span>
                  </div>
                  <span className="text-slate-700 font-medium">₹{item.value.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-48 flex items-center justify-center text-slate-600 text-sm">No expense data yet</div>
        )}
    </div>
  );
}
