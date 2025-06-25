import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`, { email });
      if (res.data?.msg === "OTP sent") {
        alert("OTP sent to your email");
        setStep(2);
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to send OTP");
    }
  };

  const verifyAndReset = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`, {
        email,
        otp,
        newPassword
      });
      alert("Password reset successfully");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white px-4">
      <div className="bg-zinc-800 p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-yellow-400">Forgot Password</h2>

        {step === 1 ? (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-3 px-4 py-2 rounded bg-zinc-700 text-white"
            />
            <button onClick={sendOtp} className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500">
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mb-3 px-4 py-2 rounded bg-zinc-700 text-white"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-3 px-4 py-2 rounded bg-zinc-700 text-white"
            />
            <button onClick={verifyAndReset} className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500">
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}
