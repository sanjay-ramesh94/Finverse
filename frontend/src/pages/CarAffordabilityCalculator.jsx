
import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CarAffordabilityCalculator() {
  const [income, setIncome] = useState(0);
  const [budgetPercent, setBudgetPercent] = useState(0);
  const [carCost, setCarCost] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [loanTenure, setLoanTenure] = useState(5);
  const [interestRate, setInterestRate] = useState(8);

  const [fuel, setFuel] = useState(0);
  const [maintenance, setMaintenance] = useState(0);
  const [insurance, setInsurance] = useState(0);
  const [lifespan, setLifespan] = useState(10);

  const [emi, setEmi] = useState(0);
  const [totalLoan, setTotalLoan] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [budgetLimit, setBudgetLimit] = useState(0);
  const [canAfford, setCanAfford] = useState(false);
  const [budgetGap, setBudgetGap] = useState(0);

  useEffect(() => {
    const principal = carCost - downPayment;
    const r = interestRate / 12 / 100;
    const n = loanTenure * 12;

    const emiCalc =
      principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);

    const loanTotal = emiCalc * n;

    const fuelCost = fuel * 12 * lifespan;
    const maintenanceCost = maintenance * lifespan;
    const insuranceCost = insurance * lifespan;

    const operationalCost = fuelCost + maintenanceCost + insuranceCost;
    const operationalCostPerMonth = operationalCost / (lifespan * 12);

    const overallCost = downPayment + loanTotal + operationalCost;

    const budget = income * (budgetPercent / 100);
    const totalMonthly = emiCalc + operationalCostPerMonth;

    setEmi(emiCalc);
    setTotalLoan(loanTotal);
    setTotalCost(overallCost);
    setBudgetLimit(budget);
    setCanAfford(totalMonthly <= budget);
    setBudgetGap(totalMonthly - budget);
  }, [
    income,
    budgetPercent,
    carCost,
    downPayment,
    loanTenure,
    interestRate,
    fuel,
    maintenance,
    insurance,
    lifespan,
  ]);

  const chartData = {
    labels: ["Loan Payment", "Fuel", "Maintenance", "Insurance"],
    datasets: [
      {
        data: [
          totalLoan,
          fuel * 12 * lifespan,
          maintenance * lifespan,
          insurance * lifespan,
        ],
        backgroundColor: ["#6366f1", "#3b82f6", "#22c55e", "#f59e0b"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white p-6">
      <div className="max-w-6xl mx-auto bg-zinc-800 p-6 rounded-xl shadow-2xl grid md:grid-cols-2 gap-8">
        {/* LEFT SIDE - Inputs */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-yellow-400">
            Car Affordability Calculator
          </h2>

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
            <label>Budget for car (% of income)</label>
            <input
              type="number"
              value={budgetPercent}
              onChange={(e) => setBudgetPercent(Number(e.target.value))}
              className="w-full mt-1 px-4 py-2 rounded bg-zinc-700 text-white"
            />
          </div>

          <div>
            <label>Cost of your Car (₹)</label>
            <input
              type="number"
              value={carCost}
              onChange={(e) => setCarCost(Number(e.target.value))}
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
              <label>Loan Tenure (Years)</label>
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

          <h3 className="text-lg font-semibold mt-6">Operational Costs</h3>

          <div>
            <label>Lifespan of Car (Years)</label>
            <input
              type="number"
              value={lifespan}
              onChange={(e) => setLifespan(Number(e.target.value))}
              className="w-full mt-1 px-4 py-2 rounded bg-zinc-700 text-white"
              max={20}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Monthly Fuel Expense (₹)</label>
              <input
                type="number"
                value={fuel}
                onChange={(e) => setFuel(Number(e.target.value))}
                className="w-full mt-1 px-4 py-2 rounded bg-zinc-700 text-white"
              />
            </div>

            <div>
              <label>Maintenance Cost (per year)</label>
              <input
                type="number"
                value={maintenance}
                onChange={(e) => setMaintenance(Number(e.target.value))}
                className="w-full mt-1 px-4 py-2 rounded bg-zinc-700 text-white"
              />
            </div>
          </div>

          <div>
            <label>Insurance Cost (per year)</label>
            <input
              type="number"
              value={insurance}
              onChange={(e) => setInsurance(Number(e.target.value))}
              className="w-full mt-1 px-4 py-2 rounded bg-zinc-700 text-white"
            />
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
              EMI: ₹{emi.toFixed(0)} / month
            </p>
            <p className={budgetGap > 0 ? "text-red-400 mt-2" : "text-green-400 mt-2"}>
              {budgetGap > 0
                ? `Exceeding your budget by ₹${budgetGap.toFixed(2)}`
                : `Within budget by ₹${Math.abs(budgetGap).toFixed(2)}`}
            </p>
          </div>

          <div className="w-64">
            <Doughnut data={chartData} />
          </div>

          <div className="text-center space-y-1 text-sm text-gray-300">
            <p>Total Loan Cost: ₹{Math.round(totalLoan).toLocaleString()}</p>
            <p>Total Lifetime Cost: ₹{Math.round(totalCost).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
