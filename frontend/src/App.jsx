import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import LoadingScreen from "./components/LoadingScreen";
import AppShell from "./components/AppShell";

// Auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

// App pages
import Home from "./pages/Home";
import AddTransaction from "./pages/AddTransaction";
import EditTransaction from "./pages/EditTransaction";
import TransactionHistory from "./pages/TransactionHistory";
import Goals from "./pages/Goals";
import Investment from "./pages/Investment";
import Calculator from "./pages/Calculator";
import SIPCalculator from "./pages/SIPCalculator";
import SWPCalculator from "./pages/SWPCalculator";
import CarAffordabilityCalculator from "./pages/CarAffordabilityCalculator";
import IPhoneAffordability from "./pages/IPhoneAffordability";
import Settings from "./pages/Settings";
import ReceiptScanner from "./components/ReceiptScanner";
import LoginHistory from "./pages/LoginHistory";
import ChangePassword from "./pages/ChangePassword";
import EditUsernamePage from "./pages/EditUsernamePage";
import DeleteAccountPage from "./pages/DeleteAccountPage";
import WealthDashboard from "./pages/WealthDashboard";
import WealthTransition from "./pages/WealthTransition";
import Stocks from "./pages/StocksPage";
import Crypto from "./pages/CryptoPage";
import Gold from "./pages/GoldPage";
import Silver from "./pages/SilverPage";
import BudgetPage from "./pages/BudgetPage";
import MonthlyReport from "./pages/MonthlyReport";

function PrivateRoute({ children }) {
  const { user, loadingUser } = useContext(UserContext);
  if (loadingUser) return <LoadingScreen />;
  if (!user) return <Navigate to="/" replace />;
  return <AppShell>{children}</AppShell>;
}

function AppWrapper() {
  const { user, loadingUser } = useContext(UserContext);
  if (loadingUser) return <LoadingScreen />;

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/home" /> : <Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected */}
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/add" element={<PrivateRoute><AddTransaction /></PrivateRoute>} />
      <Route path="/history" element={<PrivateRoute><TransactionHistory /></PrivateRoute>} />
      <Route path="/edit/:id" element={<PrivateRoute><EditTransaction /></PrivateRoute>} />
      <Route path="/goals" element={<PrivateRoute><Goals /></PrivateRoute>} />
      <Route path="/investment" element={<PrivateRoute><Investment /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/login-history" element={<PrivateRoute><LoginHistory /></PrivateRoute>} />
      <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
      <Route path="/edit-username" element={<PrivateRoute><EditUsernamePage /></PrivateRoute>} />
      <Route path="/delete-account" element={<PrivateRoute><DeleteAccountPage /></PrivateRoute>} />
      <Route path="/scan-receipt" element={<PrivateRoute><ReceiptScanner /></PrivateRoute>} />
      <Route path="/budget" element={<PrivateRoute><BudgetPage /></PrivateRoute>} />
      <Route path="/report" element={<PrivateRoute><MonthlyReport /></PrivateRoute>} />

      {/* Calculators */}
      <Route path="/calculators" element={<PrivateRoute><Calculator /></PrivateRoute>} />
      <Route path="/calculators/sip" element={<PrivateRoute><SIPCalculator /></PrivateRoute>} />
      <Route path="/calculators/swp" element={<PrivateRoute><SWPCalculator /></PrivateRoute>} />
      <Route path="/calculators/car" element={<PrivateRoute><CarAffordabilityCalculator /></PrivateRoute>} />
      <Route path="/calculators/iphone" element={<PrivateRoute><IPhoneAffordability /></PrivateRoute>} />

      {/* Wealth */}
      <Route path="/wealth-transition" element={<PrivateRoute><WealthTransition /></PrivateRoute>} />
      <Route path="/wealth-dashboard" element={<PrivateRoute><WealthDashboard /></PrivateRoute>} />
      <Route path="/wealth/portfolio" element={<PrivateRoute><WealthDashboard /></PrivateRoute>}>
        <Route path="stocks" element={<Stocks />} />
        <Route path="crypto" element={<Crypto />} />
        <Route path="gold" element={<Gold />} />
        <Route path="silver" element={<Silver />} />
      </Route>

      <Route path="*" element={<Navigate to={user ? "/home" : "/"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
