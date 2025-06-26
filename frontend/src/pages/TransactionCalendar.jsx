import { useState, useEffect, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar-dark.css"; // custom dark styling
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function TransactionCalendar() {
  const { user } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/transactions/user/${user?._id}`
      );
      setTransactions(res.data);
    };
    if (user?._id) fetchTransactions();
  }, [user]);

  const getDateKey = (date) =>
    new Date(date).toISOString().slice(0, 10); // YYYY-MM-DD

  // Group transactions by date
  const grouped = transactions.reduce((acc, tx) => {
    const dateKey = getDateKey(tx.date);
    acc[dateKey] = acc[dateKey] || [];
    acc[dateKey].push(tx);
    return acc;
  }, {});

  // Add content inside date tiles
  const renderTileContent = ({ date, view }) => {
    const dateKey = getDateKey(date);
    if (view === "month" && grouped[dateKey]) {
      const dayTxs = grouped[dateKey];
      const income = dayTxs
        .filter((tx) => tx.type === "income")
        .reduce((acc, tx) => acc + Number(tx.amount), 0);
      const expense = dayTxs
        .filter((tx) => tx.type === "expense")
        .reduce((acc, tx) => acc + Number(tx.amount), 0);

      return (
        <div className="text-[10px] text-white mt-1">
          {income > 0 && <div className="text-green-400">+₹{income}</div>}
          {expense > 0 && <div className="text-red-400">-₹{expense}</div>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6">
          🗓️ Transactions Calendar
        </h2>
        <div className="bg-zinc-900 p-6 rounded-xl shadow-md">
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            tileContent={renderTileContent}
            calendarType="gregory"
            className="dark-calendar w-full"
          />
        </div>
      </div>
    </div>
  );
}
