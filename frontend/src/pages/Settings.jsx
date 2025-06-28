import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { motion } from "framer-motion";

export default function Settings() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className="p-6 max-w-lg mx-auto text-white bg-zinc-800 rounded-lg shadow-lg mt-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h2
        className="text-2xl font-bold mb-6 text-yellow-400"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        ⚙️ Settings
      </motion.h2>

      <div className="divide-y divide-zinc-700">
        {/* Username Section */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="py-4 flex justify-between items-center cursor-pointer hover:bg-zinc-700 px-3 rounded transition-all"
          onClick={() => navigate("/edit-username")}
        >
          <span className="text-lg">✏️ Edit Username</span>
          <span className="text-gray-400 text-sm">{user?.username}</span>
        </motion.div>

        {/* Security Section */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="py-4 px-2"
        >
          <h3 className="text-xs text-gray-400 mb-2 uppercase tracking-widest">Security</h3>

          <div
            className="flex justify-between items-center cursor-pointer hover:bg-zinc-700 p-3 rounded transition-all"
            onClick={() => navigate("/change-password")}
          >
            <span className="text-sm">🔑 Change Password</span>
            <span className="text-gray-400 text-sm">&gt;</span>
          </div>

          <div
            className="flex justify-between items-center cursor-pointer hover:bg-zinc-700 p-3 rounded transition-all"
            onClick={() => navigate("/devices")}
          >
            <span className="text-sm">💻 Devices & Login History</span>
            <span className="text-gray-400 text-sm">&gt;</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
