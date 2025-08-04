import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide navbar on specific routes
  const hideNavbarRoutes = ["/wealth-transition"];
  if (hideNavbarRoutes.includes(location.pathname)) return null;

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
    { label: "Calculator", path: "/calculators" },
    { label: "Wealth Dashboard", path: "/wealth", isWealth: true },
    { label: "Settings", path: "/settings" },
    { label: "Scan Receipt", path: "/scan-receipt" },
  ];

  return (
    <nav className="bg-zinc-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold tracking-wide text-yellow-400">
          Finverse
        </div>

        {user && (
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        )}

        {user && (
          <ul className="hidden md:flex space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.path}>
                {link.isWealth ? (
                  <span
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/wealth-transition");
                    }}
                    className={`cursor-pointer pb-1 transition-all ${
                      isActive(link.path)
                        ? "border-b-2 border-yellow-400 text-yellow-300"
                        : "hover:text-yellow-400"
                    }`}
                  >
                    {link.label}
                  </span>
                ) : (
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
                )}
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
              {link.isWealth ? (
                <span
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/wealth-transition");
                  }}
                  className={`block pb-1 cursor-pointer ${
                    isActive(link.path)
                      ? "text-yellow-300 border-b border-yellow-400"
                      : "hover:text-yellow-400"
                  }`}
                >
                  {link.label}
                </span>
              ) : (
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
              )}
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
