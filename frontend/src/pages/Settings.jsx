import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function Settings() {
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState(user?.username || "");

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user/${user._id}`, { username });
      setUser(res.data);
      alert("Username updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update username.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto text-white bg-zinc-800 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">Settings</h2>
      <div className="space-y-4">
        <label className="block text-sm">Username</label>
        <input
          type="text"
          className="w-full px-4 py-2 bg-zinc-700 text-white rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500"
          onClick={handleUpdate}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
