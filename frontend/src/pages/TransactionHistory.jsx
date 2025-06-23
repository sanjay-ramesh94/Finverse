import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function TransactionHistory() {
  const { user } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/transactions/user/${user?._id}`
      );
      setTransactions(res.data);
    } catch (err) {
      console.error("❌ Error fetching transactions:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/transactions/${id}`
      );
      setTransactions(transactions.filter((t) => t._id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err.message);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchTransactions();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto bg-zinc-900 p-6 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-teal-400 text-center">
          Transaction History
        </h2>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="text-center text-gray-400">No transactions found.</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx, index) => (
              <motion.div
                key={tx._id}
                className="bg-zinc-800 p-5 rounded-lg flex justify-between items-start border border-zinc-700 hover:border-teal-500 transition"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.08,
                  type: "spring",
                  stiffness: 60,
                  damping: 15,
                }}
              >
                <div className="space-y-1 w-full">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">
                      {tx.note || "No title"}
                    </h3>
                    <span
                      className={`font-semibold text-sm px-3 py-1 rounded-full ${
                        tx.type === "income"
                          ? "bg-green-800 text-green-300"
                          : tx.type === "expense"
                          ? "bg-red-800 text-red-300"
                          : "bg-yellow-800 text-yellow-300"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </div>

                  <p className="text-sm text-gray-400">
                    {tx.date} • {tx.category} • {tx.account}
                  </p>

                  <p className="font-semibold text-xl text-teal-400">
                    ₹ {tx.amount}
                  </p>

                  {tx.image && (
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}${tx.image}`}
                      alt="Transaction"
                      className="mt-2 w-24 h-24 object-cover rounded border border-zinc-600"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-preview.png";
                      }}
                    />
                  )}
                </div>

                <div className="flex flex-col gap-2 pl-4">
                  <button
                    onClick={() => navigate(`/edit/${tx._id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tx._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md text-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
