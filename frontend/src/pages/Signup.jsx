import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // ✅ Framer Motion
import { Link } from "react-router-dom";


export default function Signup() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
        form
      );
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/home");
    } catch (err) {
      alert(err?.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white px-4">
      {/* ✨ Animated Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 bg-zinc-800 rounded-lg shadow-2xl"
      >
        {/* 🎉 Animated App Name */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-extrabold mb-6 text-center text-yellow-400"
        >
          Finverse
        </motion.h2>

        {/* 📝 Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            name="password"
            type="password"
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
            Sign Up
          </button>
        </form>

        {/* 🔗 Login Link */}
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
