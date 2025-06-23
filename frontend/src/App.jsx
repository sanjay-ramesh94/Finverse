import { BrowserRouter, Routes, Route } from "react-router-dom";
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

// Components
import Navbar from "./components/Navbar";

function App() {
  const { user } = useContext(UserContext);

  return (
    <BrowserRouter>
      {/* Show navbar only when user is logged in */}
      {user && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/add" element={<AddTransaction />} />
        <Route path="/history" element={<TransactionHistory />} />
        <Route path="/investment" element={<Investment />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/calculators/car" element={<CarAffordabilityCalculator />} />
        <Route path="/calculators/iphone" element={<IPhoneAffordability/>} />


        {/* Calculators main page */}
        <Route path="/calculators" element={<Calculator />} />
<Route path="/calculators/swp" element={<SWPCalculator />} />

        {/* Calculator sub-pages */}
        <Route path="/calculators/sip" element={<SIPCalculator />} />
       
        <Route path="/edit/:id" element={<EditTransaction />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
