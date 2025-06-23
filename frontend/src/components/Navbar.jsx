import { Link, useNavigate, useLocation } from "react-router-dom";
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
              to="/calculator"
              className={`pb-1 transition-all ${
                isActive("/calculator")
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
        </ul>
      )}
    </nav>
  );
}
