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
    <div className="p-6 max-w-4xl mx-auto mt-10 text-white">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400">Login History</h2>
      {history.length === 0 ? (
        <p className="text-gray-400">No login history found.</p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-left border-collapse bg-zinc-800 rounded shadow-md">
            <thead>
              <tr className="bg-zinc-700 text-yellow-300">
                <th className="p-3">IP Address</th>
                <th className="p-3">Device</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {history.map((log, index) => (
                <tr key={index} className="border-t border-zinc-700">
                  <td className="p-3">{log.ip}</td>
                  <td className="p-3">{log.device}</td>
                  <td className="p-3">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
