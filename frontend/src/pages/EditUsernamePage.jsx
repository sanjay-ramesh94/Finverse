import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function EditUsernamePage() {
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState(user?.username || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/${user._id}`,
        { username }
      );
      setUser(res.data);
      alert("Username updated!");
    } catch (err) {
      alert("Failed to update username.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-zinc-800 text-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">Edit Username</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 mb-4 rounded bg-zinc-700 text-white"
      />
      <button
        onClick={handleUpdate}
        className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
