import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "./context/UserContext";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import AddTransaction from "./pages/AddTransaction";
import Investment from "./pages/Investment";
import Goals from "./pages/Goals";
import Calculator from "./pages/Calculator";
import SIPCalculator from "./pages/SIPCalculator";
import CarAffordabilityCalculator from "./pages/CarAffordabilityCalculator";
import IPhoneAffordability from "./pages/IPhoneAffordability";
import SWPCalculator from "./pages/SWPCalculator";
import EditTransaction from "./pages/EditTransaction";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import ReceiptScanner from "./components/ReceiptScanner";
import LoginHistory from "./pages/LoginHistory";
import ChangePassword from "./pages/ChangePassword";
import EditUsernamePage from "./pages/EditUsernamePage";
import DeleteAccountPage from "./pages/DeleteAccountPage";
import WealthDashboard from "./pages/WealthDashboard";
import WealthTransition from "./pages/WealthTransition";

// Wealth Subpages
import Stocks from "./pages/StocksPage";
import Crypto from "./pages/CryptoPage";
import Gold from "./pages/GoldPage";
import Silver from "./pages/SilverPage";

// Components
import Navbar from "./components/Navbar";
import BottomNavbar from "./components/BottomNavbar";

// 🔒 Private Route Wrapper
function PrivateRoute({ children }) {
  const { user, loadingUser } = useContext(UserContext);
  if (loadingUser) return null;
  return user ? children : <Navigate to="/" replace />;
}

// 🚀 Wrapper for Routing & Navbar Handling
function AppWrapper() {
  const { user, loadingUser } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Ensure scroll resets on navigation
  }, [location.pathname]);

  if (loadingUser) return null;

  const hideNavOnRoutes = [
    "/",
    "/signup",
    "/forgot-password",
    "/wealth-transition",
    "/wealth-dashboard",
    "/wealth/portfolio",
    "/wealth/portfolio/stocks",
    "/wealth/portfolio/crypto",
    "/wealth/portfolio/gold",
    "/wealth/portfolio/silver"
  ];

  const hideNav = hideNavOnRoutes.includes(location.pathname);

  return (
    <>
      {user && !hideNav && <Navbar />}
      {user && !hideNav && <BottomNavbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/home" /> : <Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/add" element={<PrivateRoute><AddTransaction /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><TransactionHistory /></PrivateRoute>} />
        <Route path="/investment" element={<PrivateRoute><Investment /></PrivateRoute>} />
        <Route path="/goals" element={<PrivateRoute><Goals /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/scan-receipt" element={<PrivateRoute><ReceiptScanner /></PrivateRoute>} />
        <Route path="/edit/:id" element={<PrivateRoute><EditTransaction /></PrivateRoute>} />
        <Route path="/login-history" element={<PrivateRoute><LoginHistory /></PrivateRoute>} />
        <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
        <Route path="/devices" element={<PrivateRoute><LoginHistory /></PrivateRoute>} />
        <Route path="/edit-username" element={<PrivateRoute><EditUsernamePage /></PrivateRoute>} />
        <Route path="/delete-account" element={<PrivateRoute><DeleteAccountPage /></PrivateRoute>} />

        {/* Wealth Routes */}
        <Route path="/wealth-transition" element={<PrivateRoute><WealthTransition /></PrivateRoute>} />
        <Route path="/wealth-dashboard" element={<PrivateRoute><WealthDashboard /></PrivateRoute>} />
        <Route path="/wealth/portfolio" element={<PrivateRoute><WealthDashboard /></PrivateRoute>}>
          <Route path="stocks" element={<Stocks />} />
          <Route path="crypto" element={<Crypto />} />
          <Route path="gold" element={<Gold />} />
          <Route path="silver" element={<Silver />} />
        </Route>

        {/* Calculators */}
        <Route path="/calculators" element={<PrivateRoute><Calculator /></PrivateRoute>} />
        <Route path="/calculators/sip" element={<PrivateRoute><SIPCalculator /></PrivateRoute>} />
        <Route path="/calculators/swp" element={<PrivateRoute><SWPCalculator /></PrivateRoute>} />
        <Route path="/calculators/car" element={<PrivateRoute><CarAffordabilityCalculator /></PrivateRoute>} />
        <Route path="/calculators/iphone" element={<PrivateRoute><IPhoneAffordability /></PrivateRoute>} />

        {/* Catch-All */}
        <Route path="*" element={<Navigate to={user ? "/home" : "/"} replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
