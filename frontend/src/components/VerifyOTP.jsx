import { useState } from "react";
import axios from "axios";

export default function VerifyOTP({ email, onVerified }) {
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");

  const handleVerify = async () => {
    try {
      const res = await axios.post("/api/auth/verify-otp", { email, otp });
      setStatus("✅ OTP verified!");
      onVerified(); // You can proceed with login or navigation
    } catch (err) {
      setStatus("❌ Invalid or expired OTP.");
    }
  };

  return (
    <div className="bg-white shadow-sm border border-slate-200 p-6 rounded-lg text-slate-900 w-full max-w-md mx-auto">
      <h2 className="text-xl mb-4 font-bold">Enter OTP sent to {email}</h2>
      <input
        type="text"
        placeholder="Enter 6-digit OTP"
        className="w-full p-2 rounded bg-slate-50 border border-slate-200 mb-4"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button
        className="bg-blue-500 px-4 py-2 rounded"
        onClick={handleVerify}
      >
        Verify OTP
      </button>
      <p className="mt-2">{status}</p>
    </div>
  );
}
