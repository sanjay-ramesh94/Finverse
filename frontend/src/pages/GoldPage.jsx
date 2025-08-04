import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { UserContext } from "../context/UserContext";

const Gold = () => {
  const { user } = useContext(UserContext);
  const [goldPrice, setGoldPrice] = useState(null);
  const [goldTransactions, setGoldTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        const response = await axios.get("https://www.goldapi.io/api/XAU/INR", {
          headers: {
            "x-access-token": "goldapi-erymssmdww9b2c-io",
            "Content-Type": "application/json",
          },
        });
        const pricePerGram = response.data.price / 31.1035;
        setGoldPrice(pricePerGram);
      } catch (err) {
        console.error("❌ Failed to fetch gold price:", err);
        setError("Failed to load live gold price.");
      } finally {
        setLoading(false);
      }
    };

    fetchGoldPrice();
  }, []);

  useEffect(() => {
    const fetchGoldTransactions = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/transactions/investments/${user._id}`
        );
        const goldTxs = res.data.filter(
          (tx) => tx.category?.toLowerCase() === "gold" && tx.isInvestment
        );
        setGoldTransactions(goldTxs);
      } catch (err) {
        console.error("❌ Error fetching gold investments:", err);
        setError("Failed to load your gold transactions.");
      }
    };

    fetchGoldTransactions();
  }, [user]);

  const totalInvested = goldTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalGrams = goldTransactions.reduce((sum, tx) => sum + (tx.goldGrams || 0), 0);
  const currentValue = (totalGrams * (goldPrice || 0)).toFixed(2);
  const profitOrLoss = (currentValue - totalInvested).toFixed(2);
  const isProfit = parseFloat(profitOrLoss) >= 0;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#ffd700] px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-[#f6c800]">🏆 Gold Portfolio</h1>

      {loading ? (
        <p className="text-gray-400">Fetching live gold price...</p>
      ) : error ? (
        <p className="text-red-400 font-medium">{error}</p>
      ) : (
        <>
          {/* Gold Price Card */}
          <motion.div
            className="bg-[#1a1a1a] rounded-xl p-6 shadow-lg mb-6 border border-yellow-500"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-semibold mb-2">Live Gold Price (24K)</h2>
            <p className="text-3xl font-bold text-[#ffdf00]">₹{goldPrice.toFixed(2)} / gm</p>
          </motion.div>

          {/* Investment Summary */}
          <motion.div
            className="bg-[#1a1a1a] rounded-xl p-6 shadow-md border border-yellow-400 mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-semibold mb-4">Your Holdings</h2>
            <div className="flex flex-col gap-2 text-md text-[#ffd700]">
              <p>💰 <strong>Total Invested:</strong> ₹{totalInvested.toFixed(2)}</p>
              <p>🪙 <strong>Gold Held:</strong> {totalGrams.toFixed(4)} gm</p>
              <p>📈 <strong>Current Value:</strong> ₹{currentValue}</p>
              <p>
                {isProfit ? "✅" : "🔻"} <strong>{isProfit ? "Profit" : "Loss"}:</strong>{" "}
                ₹{Math.abs(profitOrLoss).toFixed(2)}
              </p>
              <p className="text-sm text-gray-400 italic mt-2">
                * Based on real-time 24K gold price. Actual resale value may vary.
              </p>
            </div>
          </motion.div>

          {/* Transaction History */}
          {goldTransactions.length > 0 && (
            <motion.div
              className="bg-[#1a1a1a] rounded-xl p-4 shadow-sm border border-yellow-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-md font-semibold mb-3 text-[#ffcc00]">📜 Recent Gold Transactions</h3>
              <ul className="space-y-2 text-sm text-[#fefefe]">
                {goldTransactions.map((tx, idx) => (
                  <motion.li
                    key={idx}
                    className="border-b border-gray-600 pb-2 cursor-pointer"
                    whileHover={{ scale: 1.01, backgroundColor: "#2c2c2c" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    🪙 {tx.goldGrams?.toFixed(4)} gm - ₹{tx.amount} on {tx.date}
                    {tx.note && <span className="block text-gray-400">📝 {tx.note}</span>}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default Gold;
