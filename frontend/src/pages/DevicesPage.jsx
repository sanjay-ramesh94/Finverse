import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function DevicesPage() {
  const { user } = useContext(UserContext);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!user?._id) return;

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/${user._id}/logins`)
      .then(res => setHistory(res.data))
      .catch(err => console.error("Login history error:", err));
  }, [user]);

  return (
    <div className="p-6 max-w-3xl mx-auto text-white bg-zinc-800 rounded mt-10">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">Device Login History</h2>
      <ul className="space-y-3">
        {history.slice().reverse().map((entry, idx) => (
          <li key={idx} className="bg-zinc-700 p-3 rounded">
            <div className="text-sm font-semibold">
              {entry.device.includes("iPhone")
                ? "iPhone"
                : entry.device.includes("Windows")
                ? "Windows"
                : "Other"}
            </div>
            <div className="text-xs text-gray-400">
              {entry.city || "Unknown"} • {entry.ip}
            </div>
            <div className="text-xs text-gray-300 mt-1">
              {new Date(entry.timestamp).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
