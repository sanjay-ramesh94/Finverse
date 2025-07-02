import { useLocation, useNavigate } from "react-router-dom";
import { Home, PlusCircle, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BottomNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShow(currentScrollY < lastScrollY || currentScrollY < 10); // show on scroll up or near top
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const isActive = (path) => location.pathname === path;

  const iconClass = (active) =>
    `flex flex-col items-center text-xs ${
      active ? "text-blue-500" : "text-gray-400"
    }`;

  return (
    <motion.nav
      className={`fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-800 md:hidden transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex justify-between items-center px-8 h-16">
        {/* Home */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/home")}
          className={iconClass(isActive("/home"))}
        >
          <motion.div
            animate={{ scale: isActive("/home") ? 1.2 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Home size={24} />
          </motion.div>
          <span>Home</span>
        </motion.button>

        {/* Add */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/add")}
          className="bg-blue-600 p-4 rounded-full text-white shadow-md -mt-4 flex items-center justify-center"
          style={{ transform: "translateY(-6px)" }}
        >
          <PlusCircle size={28} />
        </motion.button>

        {/* Settings */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/settings")}
          className={iconClass(isActive("/settings"))}
        >
          <motion.div
            animate={{ scale: isActive("/settings") ? 1.2 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Settings size={24} />
          </motion.div>
          <span>Settings</span>
        </motion.button>
      </div>
    </motion.nav>
  );
}
