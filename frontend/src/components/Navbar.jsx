/*import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-zinc-900 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <div className="text-xl font-bold tracking-wide text-yellow-400">
        Finverse
      </div>
      {user && (
        <ul className="flex space-x-6 text-sm font-medium items-center">
          <li>
            <Link
              to="/home"
              className={`pb-1 transition-all ${
                isActive("/home")
                  ? "border-b-2 border-yellow-400 text-yellow-300"
                  : "hover:text-yellow-400"
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/add"
              className={`pb-1 transition-all ${
                isActive("/add")
                  ? "border-b-2 border-yellow-400 text-yellow-300"
                  : "hover:text-yellow-400"
              }`}
            >
              Add
            </Link>
          </li>
          <li>
            <Link
              to="/history"
              className={`pb-1 transition-all ${
                isActive("/history")
                  ? "border-b-2 border-yellow-400 text-yellow-300"
                  : "hover:text-yellow-400"
              }`}
            >
              History
            </Link>
          </li>
          <li>
            <Link
              to="/goals"
              className={`pb-1 transition-all ${
                isActive("/goals")
                  ? "border-b-2 border-yellow-400 text-yellow-300"
                  : "hover:text-yellow-400"
              }`}
            >
              Goals
            </Link>
          </li>
          <li>
            <Link
              to="/investment"
              className={`pb-1 transition-all ${
                isActive("/investment")
                  ? "border-b-2 border-yellow-400 text-yellow-300"
                  : "hover:text-yellow-400"
              }`}
            >
              Investment
            </Link>
          </li>
          <li>
            <Link
              to="/calculators"
              className={`pb-1 transition-all ${
                isActive("/calculators")
                  ? "border-b-2 border-yellow-400 text-yellow-300"
                  : "hover:text-yellow-400"
              }`}
            >
              Calculator
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700"
            >
              Logout
            </button>
          </li>
        </ul>*//*import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-zinc-900 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <div className="text-xl font-bold tracking-wide text-yellow-400">
        Finverse
      </div>
      {user && (
        <ul className="flex space-x-6 text-sm font-medium items-center">
          <li>
            <Link
              to="/home"
              className={`pb-1 transition-all ${
                isActive("/home")
                  ? "border-b-2 border-yellow-400 text-yellow-300"
                  : "hover:text-yellow-400"
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/add"
              className={`pb-1 transition-all ${
                isActive("/add")
                  ? "border-b-2 border-yellow-400 text-yellow-300"
                  : "hover:text-yellow-400"
              }`}
            >
              Add
            </Link>
          </li>
          <li>
            <Link
              to="/history"
              className={`pb-1 transition-all ${
                isActive("/history")
                  ? "border-b-2 border-yellow-400 text-yellow-300"
                  : "hover:text-yellow-400"
              }`}
            >
              History
            </Link>
          </li>
          <li>
            <Link
              to="/goals"
              className={`pb-1 transition-all ${
                isActive("/goals")
                  ? "border-b-2 border-yellow-400 text-yellow-300"
                  : "hover:text-yellow-400"
              }`}
            >
              Goals
            </Link>
          </li>
          <li>
            <Link
              to="/investment"
              className={`pb-1 transition-all ${
                isActive("/investment")
                  ? "border-b-2 border-yellow-400 text-yellow-300"
                  : "hover:text-yellow-400"
              }`}
            >
              Investment
            </Link>
          </li>
          <li>
            <Link
              to="/calculators"
              className={`pb-1 transition-all ${
                isActive("/calculators")
                  ? "border-b-2 border-yellow-400 text-yellow-300"
                  : "hover:text-yellow-400"
              }`}
            >
              Calculator
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700"
            >
              Logout
            </button>
          </li>
        </ul>*/
import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: "Dashboard", path: "/home" },
    { label: "Add", path: "/add" },
    { label: "History", path: "/history" },
    { label: "Goals", path: "/goals" },
    { label: "Investment", path: "/investment" },
    { label: "Settings", path: "/settings" },
    { label: "Scan Receipt", path: "/scan-receipt" }, // ✅ Added this
  ];

  return (
    <nav className="bg-zinc-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold tracking-wide text-yellow-400">
          Finverse
        </div>

        {/* Hamburger Menu for Mobile */}
        {user && (
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        )}

        {/* Desktop Menu */}
        {user && (
          <ul className="hidden md:flex space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`pb-1 transition-all ${
                    isActive(link.path)
                      ? "border-b-2 border-yellow-400 text-yellow-300"
                      : "hover:text-yellow-400"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && user && (
        <ul className="md:hidden mt-4 space-y-3 text-sm font-medium bg-zinc-800 px-4 py-4 rounded-lg shadow">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block pb-1 ${
                  isActive(link.path)
                    ? "text-yellow-300 border-b border-yellow-400"
                    : "hover:text-yellow-400"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full bg-red-600 px-3 py-2 rounded text-white hover:bg-red-700"
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
}


