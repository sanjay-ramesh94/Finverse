import React, { useEffect, useState, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import WealthNavbar from "../components/WealthNavbar";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#FFD700", "#C0C0C0", "#00C49F", "#8884d8"];

const WealthDashboard = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const isMainPortfolio =
    location.pathname === "/wealth" || location.pathname === "/wealth/portfolio";

  const [investments, setInvestments] = useState({
    gold: 0,
    silver: 0,
    stocks: 0,
    "mutual funds": 0,
  });

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/transactions/investments/${user?._id}`
        );
        const data = res.data || [];

        const grouped = {
          gold: 0,
          silver: 0,
          stocks: 0,
          "mutual fund": 0,
        };

        data.forEach((tx) => {
          const category = tx.category?.toLowerCase().trim();
          if (grouped[category] !== undefined) {
            grouped[category] += tx.amount;
          }
        });

        setInvestments(grouped);
      } catch (err) {
        console.error("❌ Error fetching investments:", err.message);
      }
    };

    if (user?._id) {
      fetchInvestments();
    }
  }, [user]);

  const chartData = Object.entries(investments)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: key,
      value,
    }));

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);
  const topCategory = chartData.reduce(
    (max, item) => (item.value > max.value ? item : max),
    { name: "", value: 0 }
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <WealthNavbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isMainPortfolio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-2xl font-semibold mb-6">📈 Investment Overview</h2>

            {/* 📊 Pie Chart */}
            <div className="bg-white shadow-sm border border-slate-200 p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-bold mb-4 text-center">Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  >
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* 📌 Insights */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="bg-white shadow-sm border border-slate-200 p-6 rounded-lg shadow-md mb-8"
            >
              <h3 className="text-xl font-bold mb-4">📌 Insights</h3>
              <ul className="space-y-3">
                <li>
                  💰 <strong>Total Investment:</strong> ₹{total.toLocaleString()}
                </li>
                <li>
                  🥇 <strong>Top Category:</strong> {topCategory.name} (
                  ₹{topCategory.value.toLocaleString()})
                </li>
                <li>
                  📈 <strong>{((topCategory.value / total) * 100).toFixed(2)}%</strong> of
                  portfolio in {topCategory.name}
                </li>
              </ul>
            </motion.div>

            {/* 💼 Cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
            >
              {Object.entries(investments).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-white shadow-sm border border-slate-200 p-4 rounded-lg shadow-md text-center"
                >
                  <p className="text-lg capitalize font-medium">{key}</p>
                  <p className="text-2xl font-bold text-green-400">
                    ₹{value.toLocaleString()}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* 🔄 Subroutes like /wealth/portfolio/gold etc. */}
        <div className="mt-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default WealthDashboard;
