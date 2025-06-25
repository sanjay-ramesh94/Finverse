import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";


export default function Login() {
  const [step, setStep] = useState(1); // 1 = login, 2 = OTP input
  const [form, setForm] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL); // Debug URL

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("handleLogin called with form:", form);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        form,
        
      );
      console.log("Login response:", res.data);
      if (res.data?.msg === "OTP sent") {
        console.log("Switching to OTP step");
        alert("OTP sent to your email");
        setStep(2);
      } else {
        console.error("Unexpected response:", res.data); // This is line ~34
        alert("Unexpected response from server: " + JSON.stringify(res.data));
      }
    } catch (err) {
      console.error("Login error:", err.message, err.response?.data);
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    console.log("handleVerifyOtp called with OTP:", otp);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-otp`,
        { email: form.email, otp },
        { timeout: 5000 }
      );
      console.log("OTP verification response:", res.data);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      setUser(user);
      navigate("/home");
    } catch (err) {
      console.error("OTP error:", err.message, err.response?.data);
      alert(err.response?.data?.msg || "Invalid OTP");
    }
  };

  console.log("Current step:", step); // Debug step state

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-zinc-800 rounded-lg shadow-2xl"
      >
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl font-extrabold mb-6 text-center text-yellow-400 tracking-wide"
        >
          Finverse Login
        </motion.h2>

        {step === 1 ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-zinc-700 text-white placeholder-gray-400 rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
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
              type="text"
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
              Verify OTP & Login
            </button>
          </form>
        )}
        <p className="text-center text-sm mt-2 text-yellow-400 hover:underline cursor-pointer" onClick={() => navigate("/forgot-password")}>
  Forgot Password?
</p>


        <p className="text-center text-sm mt-4 text-gray-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-yellow-400 hover:underline">
  Sign up
</Link>
        </p>
      </motion.div>
    </div>
  );
}
