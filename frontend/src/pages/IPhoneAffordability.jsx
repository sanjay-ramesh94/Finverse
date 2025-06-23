// src/pages/IPhoneAffordability.jsx

import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function IPhoneAffordability() {
  const [income, setIncome] = useState(100000);
  const [budgetPercent, setBudgetPercent] = useState(10);
  const [iphoneCost, setIphoneCost] = useState(120000);
  const [downPayment, setDownPayment] = useState(20000);
  const [loanTenure, setLoanTenure] = useState(12); // months
  const [interestRate, setInterestRate] = useState(12);

  const [emi, setEmi] = useState(0);
  const [totalLoan, setTotalLoan] = useState(0);
  const [canAfford, setCanAfford] = useState(false);

  useEffect(() => {
    const principal = iphoneCost - downPayment;
    const r = interestRate / 12 / 100;
    const n = loanTenure;

    const emiCalc =
      principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const loanTotal = emiCalc * n;

    setEmi(emiCalc);
    setTotalLoan(loanTotal);

    const budgetLimit = income * (budgetPercent / 100);
    setCanAfford(emiCalc <= budgetLimit);
  }, [
    income,
    budgetPercent,
    iphoneCost,
    downPayment,
    loanTenure,
    interestRate,
  ]);

  const chartData = {
    labels: ["Down Payment", "Loan Repayment"],
    datasets: [
      {
        data: [downPayment, totalLoan],
        backgroundColor: ["#60a5fa", "#facc15"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white p-6">
      <div className="max-w-4xl mx-auto bg-zinc-800 p-6 rounded-xl shadow-2xl grid md:grid-cols-2 gap-8">
        {/* LEFT SIDE - Inputs */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-yellow-400">iPhone Affordability Calculator</h2>

          <div>
            <label>Monthly Income (₹)</label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full mt-1 px-4 py-2 rounded bg-zinc-700 text-white"
            />
          </div>

          <div>
            <label>Budget for iPhone (% of income)</label>
            <input
              type="number"
              value={budgetPercent}
              onChange={(e) => setBudgetPercent(Number(e.target.value))}
              className="w-full mt-1 px-4 py-2 rounded bg-zinc-700 text-white"
            />
          </div>

          <div>
            <label>iPhone Cost (₹)</label>
            <input
              type="number"
              value={iphoneCost}
              onChange={(e) => setIphoneCost(Number(e.target.value))}
              className="w-full mt-1 px-4 py-2 rounded bg-zinc-700 text-white"
            />
          </div>

          <div>
            <label>Down Payment (₹)</label>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full mt-1 px-4 py-2 rounded bg-zinc-700 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>EMI Tenure (Months)</label>
              <input
                type="number"
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                className="w-full mt-1 px-4 py-2 rounded bg-zinc-700 text-white"
              />
            </div>

            <div>
              <label>Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full mt-1 px-4 py-2 rounded bg-zinc-700 text-white"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Results */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="text-center bg-purple-700 p-6 rounded-xl w-full">
            <p className="text-sm text-gray-300">Can You Afford?</p>
            <p className="text-3xl font-bold mt-1">
              {canAfford ? "✅ Yes" : "❌ No"}
            </p>
            <p className="text-sm mt-2 text-yellow-300">
              EMI: ₹{Math.round(emi).toLocaleString()} / month
            </p>
          </div>

          <div className="w-64">
            <Doughnut data={chartData} />
          </div>

          <div className="text-center text-sm text-gray-300 space-y-1">
            <p>Total Loan Payment: ₹{Math.round(totalLoan).toLocaleString()}</p>
            <p>Total Cost: ₹{Math.round(totalLoan + downPayment).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
