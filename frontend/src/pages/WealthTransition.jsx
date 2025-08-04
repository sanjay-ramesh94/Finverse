import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function WealthTransition() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/wealth-dashboard"); // Navigate to the actual portfolio after animation
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="bg-black h-screen flex items-center justify-center">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-white text-center"
      >
        <h1 className="text-4xl font-bold text-yellow-300 tracking-wide">
          Finverse Wealth
        </h1>
        <p className="text-gray-400 mt-2">Loading your portfolio dashboard...</p>
      </motion.div>
    </div>
  );
}
