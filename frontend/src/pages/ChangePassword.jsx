import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { KeyRound, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

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
    <div className="space-y-6 max-w-md mx-auto mt-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn-ghost w-9 h-9 p-0 flex items-center justify-center">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="page-title">Change Password</h1>
          <p className="text-sm text-slate-500 mt-0.5">Secure your account</p>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--surface-2)" }}>
            <KeyRound size={18} className="text-amber-500" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Password Update</h2>
        </div>

        <div className="space-y-4">
          <div className="form-group">
            <label className="label">Current Password</label>
            <input
              type="password"
              className="input h-11"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>

          <div className="form-group">
            <label className="label">New Password</label>
            <input
              type="password"
              className="input h-11"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div className="form-group">
            <label className="label">Confirm New Password</label>
            <input
              type="password"
              className="input h-11"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
            />
          </div>

          <button
            onClick={handleChangePassword}
            className="btn-primary w-full h-11 mt-2"
            disabled={!currentPassword || !newPassword || !confirmPassword}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
