import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function ChangePassword() {
  const { user } = useContext(UserContext);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return alert("Please fill all fields.");
    }

    if (newPassword !== confirmPassword) {
      return alert("New passwords do not match.");
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/change-password`, {
        userId: user._id,
        currentPassword,
        newPassword,
      });

      alert(res.data.msg);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Password change error:", err);
      alert(err.response?.data?.msg || "Failed to change password");
    }
  };

  return (
    <div className="bg-zinc-800 text-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-yellow-400">🔑 Change Password</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Current Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 bg-zinc-700 text-white border border-zinc-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">New Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 bg-zinc-700 text-white border border-zinc-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Confirm New Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 bg-zinc-700 text-white border border-zinc-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
          />
        </div>

        <button
          onClick={handleChangePassword}
          className="w-full bg-yellow-400 text-black font-semibold py-2 rounded hover:bg-yellow-500 transition"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}
