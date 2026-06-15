import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EditUsernamePage() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
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
    <div className="space-y-6 max-w-md mx-auto mt-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn-ghost w-9 h-9 p-0 flex items-center justify-center">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="page-title">Edit Username</h1>
          <p className="text-sm text-slate-500 mt-0.5">Update your profile display name</p>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--surface-2)" }}>
            <User size={18} className="text-indigo-500" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Username Details</h2>
        </div>
        
        <div className="space-y-4">
          <div className="form-group">
            <label className="label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input h-11"
              placeholder="Enter new username"
            />
          </div>

          <button
            onClick={handleUpdate}
            className="btn-primary w-full h-11"
            disabled={loading || !username}
          >
            {loading ? <span className="flex items-center gap-2 justify-center"><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Saving…</span> : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
