// src/components/WealthNavbar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function WealthNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Portfolio", path: "/wealth/portfolio" },
    { label: "Gold", path: "/wealth/portfolio/gold" },
    { label: "Silver", path: "/wealth/portfolio/silver" },
    { label: "Crypto", path: "/wealth/portfolio/crypto" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-zinc-900 text-white px-6 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo + Nav Links */}
        <div className="flex items-center space-x-4">
          <div
            className="text-lg font-semibold tracking-wide text-yellow-400 cursor-pointer"
            
          >
            Finverse Wealth
          </div>

          <ul className="hidden md:flex space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.path}>
                <span
                  onClick={() => navigate(link.path)}
                  className={`cursor-pointer pb-1 transition-all ${
                    isActive(link.path)
                      ? "border-b-2 border-yellow-400 text-yellow-300"
                      : "hover:text-yellow-400"
                  }`}
                >
                  {link.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Back to Main App Button */}
        <button
          onClick={() => navigate("/dashboard")} // or "/" or "/home" depending on your route
          className="hidden md:inline-block bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 text-sm font-semibold"
        >
          ← Back to Finverse
        </button>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden mt-4 space-y-3 text-sm font-medium bg-zinc-800 px-4 py-4 rounded-lg shadow">
          {navLinks.map((link) => (
            <li key={link.path}>
              <span
                onClick={() => {
                  navigate(link.path);
                  setMenuOpen(false);
                }}
                className={`block pb-1 cursor-pointer ${
                  isActive(link.path)
                    ? "text-yellow-300 border-b border-yellow-400"
                    : "hover:text-yellow-400"
                }`}
              >
                {link.label}
              </span>
            </li>
          ))}
          <li>
            <span
              onClick={() => {
                navigate("/dashboard"); // adjust as needed
                setMenuOpen(false);
              }}
              className="block text-yellow-400 hover:text-yellow-300 border-t border-zinc-600 pt-3"
            >
              ← Back to Finverse
            </span>
          </li>
        </ul>
      )}
    </nav>
  );
}
