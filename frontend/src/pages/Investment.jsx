import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function Investment() {
  const { user } = useContext(UserContext);
  const [investments, setInvestments] = useState([]);
  const [totalInvested, setTotalInvested] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("theme") === "light" ? "light" : "dark"
  );

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/transactions/investments/${user?._id}`
        );
        const data = res.data || [];
        setInvestments(data);

        const total = data.reduce((sum, tx) => sum + tx.amount, 0);
        setTotalInvested(total);

        const categoryMap = {};
        data.forEach((tx) => {
          categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
        });

        const chart = Object.entries(categoryMap).map(([name, value]) => ({
          name,
          value,
        }));

        setChartData(chart);
      } catch (err) {
        console.error("❌ Failed to fetch investments:", err.message);
      }
    };

    if (user?._id) {
      fetchInvestments();
    }
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className={`min-h-screen px-4 py-10 transition duration-300 ${
        theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`max-w-5xl mx-auto p-6 rounded-xl shadow-2xl transition duration-300 backdrop-blur-md bg-opacity-20 ${
          theme === "dark"
            ? "bg-zinc-900/60 border border-zinc-700"
            : "bg-white/80 border border-gray-300"
        }`}
      >
        {/* 🌗 Theme Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-teal-400 text-center w-full">
            Investment Portfolio
          </h2>
          <button
            onClick={toggleTheme}
            className={`absolute top-6 right-6 px-4 py-1 text-sm font-medium rounded shadow-md ${
              theme === "dark"
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
          </button>
        </div>

        {chartData.length > 0 ? (
          <>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div
              className={`text-xl text-center mt-4 font-semibold ${
                theme === "dark" ? "text-green-400" : "text-green-600"
              }`}
            >
              Total Invested: ₹{totalInvested.toLocaleString("en-IN")}
            </div>
          </>
        ) : (
          <p
            className={`text-center mt-10 text-lg font-medium ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            No investments found.
          </p>
        )}

        {/* 🧾 Investment Cards */}
        {investments.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {investments.map((tx) => (
              <motion.div
                key={tx._id}
                whileHover={{ scale: 1.03 }}
                className={`p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-zinc-800 border border-zinc-700"
                    : "bg-white border border-gray-300"
                }`}
              >
                <p className="font-bold text-xl mb-1">{tx.category}</p>
                <p
                  className={`text-sm mb-2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {tx.date}
                </p>
                <p
                  className={`text-lg font-semibold ${
                    theme === "dark" ? "text-green-400" : "text-green-600"
                  }`}
                >
                  ₹ {tx.amount}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
