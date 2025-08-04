// src/pages/WealthDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import WealthNavbar from "../components/WealthNavbar";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const WealthDashboard = () => {
  const { user } = useContext(UserContext);
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
          "mutual funds": 0,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <WealthNavbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">📈 Investment Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Object.entries(investments).map(([key, value]) => (
            <div
              key={key}
              className="bg-zinc-800 p-4 rounded-lg shadow-md text-center"
            >
              <p className="text-lg capitalize font-medium">{key}</p>
              <p className="text-2xl font-bold text-green-400">
                ₹{value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Subroutes like /wealth/portfolio/gold etc. will be shown here */}
        <div className="mt-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default WealthDashboard;
