import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/send-otp`,
        {
          username: form.username,
          email: form.email,
          mobile: form.mobile,
          password: form.password,
        }
      );
      if (res.data.msg === "OTP sent") {
        alert("OTP sent to your email");
        setStep(2);
      }
    } catch (err) {
      alert(err?.response?.data?.msg || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-otp-signup`,
        {
          ...form,
          otp,
        }
      );
      alert("Signup successful! Please login.");
      navigate("/");
    } catch (err) {
      alert(err?.response?.data?.msg || "OTP verification failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 bg-zinc-800 rounded-lg shadow-2xl"
      >
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-extrabold mb-6 text-center text-yellow-400"
        >
          Finverse Signup
        </motion.h2>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-zinc-700 text-white placeholder-gray-400 rounded"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-zinc-700 text-white placeholder-gray-400 rounded"
            />
            <input
              name="mobile"
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-zinc-700 text-white placeholder-gray-400 rounded"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-zinc-700 text-white placeholder-gray-400 rounded"
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Re-enter Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-zinc-700 text-white placeholder-gray-400 rounded"
            />
            <button
              type="submit"
              className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded transition"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-2 bg-zinc-700 text-white placeholder-gray-400 rounded"
            />
            <button
              type="submit"
              className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded transition"
            >
              Verify OTP & Sign Up
            </button>
          </form>
        )}

        <p className="text-center text-sm mt-4 text-gray-400">
          Already have an account?{" "}
          <Link to="/" className="text-yellow-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
