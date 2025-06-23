import { useState } from "react";
import axios from "axios";

export default function RequestOTP({ onNext }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSendOTP = async () => {
    try {
      await axios.post("/api/auth/send-otp", { email });
      setStatus("OTP sent! Check your email.");
      onNext(email); // Go to OTP screen with the email
    } catch (err) {
      setStatus("Error sending OTP");
    }
  };

  return (
    <div className="bg-zinc-800 p-6 rounded-lg text-white w-full max-w-md mx-auto">
      <h2 className="text-2xl mb-4 font-bold">Two-Factor Authentication</h2>
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full p-2 rounded bg-zinc-700 mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="bg-green-500 px-4 py-2 rounded"
        onClick={handleSendOTP}
      >
        Send OTP
      </button>
      <p className="mt-2">{status}</p>
    </div>
  );
}
