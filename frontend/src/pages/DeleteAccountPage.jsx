import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import API from "../utils/axios"; // ✅ use API, not plain axios

export default function DeleteAccountPage() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const res = await API.delete("/api/user/delete", {
        data: { userId: user._id },
      });

      alert(res.data.msg);
      setUser(null);
      navigate("/goodbye");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to delete account");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-zinc-800 p-6 rounded-lg text-white shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-red-400">⚠️ Confirm Deletion</h2>
      <p className="text-sm mb-6">
        This action is <strong>permanent</strong>. All your goals, transactions, and data will be removed.
      </p>

      <button
        onClick={handleDelete}
        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        🗑️ Delete My Account
      </button>
    </div>
  );
}
