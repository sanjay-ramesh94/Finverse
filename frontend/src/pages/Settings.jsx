import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserContext } from "../context/UserContext";

export default function Settings() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <motion.div
      className="p-6 max-w-lg mx-auto text-white bg-zinc-900 rounded-2xl shadow-2xl mt-12"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.h2
        className="text-3xl font-bold mb-8 text-yellow-400 text-center tracking-wide"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        ⚙️ Settings
      </motion.h2>

      <div className="space-y-6">
        {/* Username Section */}
        <motion.div
          custom={1}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-between items-center bg-zinc-800 px-5 py-4 rounded-xl hover:bg-zinc-700 transition cursor-pointer"
          onClick={() => navigate("/edit-username")}
        >
          <div>
            <p className="text-base font-medium">✏️ Edit Username</p>
            <p className="text-sm text-gray-400">{user?.username}</p>
          </div>
          <span className="text-gray-500 text-xl">&gt;</span>
        </motion.div>

        {/* Security Section */}
        <motion.div
          custom={2}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <h3 className="text-xs text-gray-400 uppercase tracking-widest">Security</h3>

          <div
            className="flex justify-between items-center bg-zinc-800 px-5 py-3 rounded-xl hover:bg-zinc-700 transition cursor-pointer"
            onClick={() => navigate("/change-password")}
          >
            <span className="text-sm font-medium">🔑 Change Password</span>
            <span className="text-gray-500 text-lg">&gt;</span>
          </div>

          <div
            className="flex justify-between items-center bg-zinc-800 px-5 py-3 rounded-xl hover:bg-zinc-700 transition cursor-pointer"
            onClick={() => navigate("/devices")}
          >
            <span className="text-sm font-medium">💻 Devices & Login History</span>
            <span className="text-gray-500 text-lg">&gt;</span>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex justify-between items-center bg-red-600 px-5 py-3 rounded-xl cursor-pointer mt-2 hover:bg-red-700 transition"
            onClick={() => navigate("/delete-account")}
          >
            <span className="text-sm font-medium text-white">🗑️ Delete Account</span>
            <span className="text-white text-lg font-bold">&gt;</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
