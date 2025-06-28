import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function LoginHistory() {
  const { user } = useContext(UserContext);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!user?._id) return;

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/${user._id}/logins`)
      .then(res => setHistory(res.data))
      .catch(err => console.error("Fetch login history error:", err));
  }, [user]);

  return (
    <div className="bg-zinc-800 text-white rounded-lg p-4 mt-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-yellow-400">📜 Login History</h2>
      {history.length === 0 ? (
        <p className="text-gray-400 text-sm">No login history available.</p>
      ) : (
        <ul className="space-y-3">
          {history.slice().reverse().map((entry, idx) => (
            <li key={idx} className="bg-zinc-700 p-3 rounded flex flex-col sm:flex-row justify-between">
              <div>
                <div className="text-sm font-semibold">
                  {entry.device.includes("iPhone")
                    ? "📱 iPhone"
                    : entry.device.includes("Android")
                    ? "📱 Android"
                    : entry.device.includes("Windows")
                    ? "🖥️ Windows PC"
                    : entry.device.includes("Mac")
                    ? "💻 Mac"
                    : "📟 Other Device"}
                </div>
                <div className="text-xs text-gray-400">
                  {entry.city || "Unknown City"} • {entry.ip || "Unknown IP"}
                </div>
              </div>
              <div className="text-xs text-gray-300 mt-1 sm:mt-0">
                {new Date(entry.timestamp).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
