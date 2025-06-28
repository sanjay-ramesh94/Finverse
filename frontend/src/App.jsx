import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import AddTransaction from "./pages/AddTransaction";
import TransactionHistory from "./pages/TransactionHistory";
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


// Components
import Navbar from "./components/Navbar";

// 🔒 Private route component
function PrivateRoute({ children }) {
  const { user, loadingUser } = useContext(UserContext);

  if (loadingUser) return null; // ⏳ Don't render anything while checking login

  return user ? children : <Navigate to="/" replace />;
}

function App() {
  const { user, loadingUser } = useContext(UserContext);

  if (loadingUser) return null; // Prevents flashing nav/routes before auth check

  return (
    <BrowserRouter>
      {/* ✅ Show navbar only when user is logged in */}
      {user && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
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


        {/* Calculators */}
        <Route path="/calculators" element={<PrivateRoute><Calculator /></PrivateRoute>} />
        <Route path="/calculators/sip" element={<PrivateRoute><SIPCalculator /></PrivateRoute>} />
        <Route path="/calculators/swp" element={<PrivateRoute><SWPCalculator /></PrivateRoute>} />
        <Route path="/calculators/car" element={<PrivateRoute><CarAffordabilityCalculator /></PrivateRoute>} />
        <Route path="/calculators/iphone" element={<PrivateRoute><IPhoneAffordability /></PrivateRoute>} />

        {/* Catch-all unknown routes */}
        <Route path="*" element={<Navigate to={user ? "/home" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
