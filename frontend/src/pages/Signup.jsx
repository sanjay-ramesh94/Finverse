import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, User, Mail, Phone, Lock, ShieldCheck, ArrowLeft } from "lucide-react";

const Field = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
    <input className="input pl-10" {...props} />
  </div>
);

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ username: "", email: "", mobile: "", password: "", confirmPassword: "" });
  const [otp, setOtp] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/send-otp`, {
        username: form.username, email: form.email, mobile: form.mobile, password: form.password,
      });
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.msg || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-otp-signup`, { ...form, otp });
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.msg || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mb-4">
            <Wallet size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            {step === 1 ? "Create account" : "Verify email"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {step === 1 ? "Start tracking your finances" : `Enter the code sent to ${form.email}`}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= step ? "bg-indigo-500" : "bg-white/10"}`} />
          ))}
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm text-rose-400" style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)" }}>
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form key="step1" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.25 }} onSubmit={handleSendOtp} className="space-y-4">
              <div className="form-group">
                <label className="label">Full Name</label>
                <Field icon={User} name="username" placeholder="Sanjay Ramesh" value={form.username} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="label">Email</label>
                <Field icon={Mail} type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="label">Mobile</label>
                <Field icon={Phone} name="mobile" placeholder="+91 98765 43210" value={form.mobile} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="label">Password</label>
                <Field icon={Lock} type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="label">Confirm Password</label>
                <Field icon={ShieldCheck} type="password" name="confirmPassword" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full h-11 mt-2 disabled:opacity-60">
                {loading ? "Sending OTP…" : "Continue"}
              </button>
            </motion.form>
          ) : (
            <motion.form key="step2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }} onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="form-group">
                <label className="label">6-Digit Code</label>
                <input
                  className="input text-center text-2xl tracking-[0.4em] font-semibold h-14"
                  placeholder="000000"
                  value={otp}
                  maxLength={6}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full h-11 disabled:opacity-60">
                {loading ? "Verifying…" : "Verify & Create Account"}
              </button>
              <button type="button" onClick={() => setStep(1)}
                className="btn-ghost w-full h-10 flex items-center justify-center gap-2 text-slate-400">
                <ArrowLeft size={16} /> Back
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-center text-sm text-slate-500 mt-8">
          Already have an account?{" "}
          <Link to="/" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
