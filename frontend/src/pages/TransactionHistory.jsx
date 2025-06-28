import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function TransactionHistory() {
  const { user } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/transactions/user/${user?._id}`
      );
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/${deleteId}`);
      setTransactions((prev) => prev.filter((t) => t._id !== deleteId));
      setShowModal(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Delete failed:", err.message);
      alert("❌ Failed to delete. Please try again.");
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
          <motion.p
            className="text-center text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            No transactions found.
          </motion.p>
        ) : (
          <motion.div layout className="grid gap-5 sm:grid-cols-1">
            {transactions.map((tx, index) => (
              <motion.div
                layout
                key={tx._id}
                className="bg-zinc-800 p-5 rounded-lg border border-zinc-700 hover:border-teal-500 transition grid sm:grid-cols-[1fr_auto] gap-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07, type: "spring", stiffness: 50 }}
              >
                {/* Left Content */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">{tx.note || "No title"}</h3>
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
                  <p className="font-semibold text-xl text-teal-400">₹ {tx.amount}</p>

                  {tx.image && (
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}${tx.image}`}
                      alt="Transaction"
                      className="mt-2 w-24 h-24 object-cover rounded border border-zinc-600"
                      onError={(e) => (e.target.src = "/default-preview.png")}
                    />
                  )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3 sm:justify-center w-full sm:w-36">
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      navigate(`/edit/${tx._id}`);
    }}
    className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium shadow-md transition text-center"
  >
    Edit
  </button>
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      confirmDelete(tx._id);
    }}
    className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium shadow-md transition text-center"
  >
    Delete
  </button>
</div>

              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white text-black p-6 rounded-xl w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-xl font-semibold mb-4">Delete Transaction?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this transaction? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirmed}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
