import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SIPCalculator() {
  const [type, setType] = useState("sip");
  const [amount, setAmount] = useState("10000");
  const [rate, setRate] = useState("12");
  const [duration, setDuration] = useState("10");
  const [stepUp, setStepUp] = useState("0");

  const [result, setResult] = useState(0);
  const [invested, setInvested] = useState(0);
  const [returns, setReturns] = useState(0);

  useEffect(() => {
    const r = parseFloat(rate || 0) / 100 / 12;
    const n = parseInt(duration || 0) * 12;

    if (!amount || !rate || !duration) {
      setResult(0);
      setInvested(0);
      setReturns(0);
      return;
    }

    if (type === "sip") {
      let P = parseFloat(amount);
      let step = parseFloat(stepUp || 0);
      let totalInvested = 0;
      let futureValue = 0;

      for (let year = 1; year <= duration; year++) {
        let yearlyP = P * Math.pow(1 + step / 100, year - 1);
        totalInvested += yearlyP * 12;
        for (let month = 1; month <= 12; month++) {
          const m = (year - 1) * 12 + month;
          futureValue += yearlyP * Math.pow(1 + r, n - m + 1);
        }
      }

      setResult(futureValue);
      setInvested(totalInvested);
      setReturns(futureValue - totalInvested);
    } else {
      const P = parseFloat(amount);
      const t = parseFloat(duration);
      const futureValue = P * Math.pow(1 + parseFloat(rate) / 100, t);
      setResult(futureValue);
      setInvested(P);
      setReturns(futureValue - P);
    }
  }, [amount, rate, duration, stepUp, type]);

  const chartData = {
    labels: ["Invested Amount", "Estimated Returns"],
    datasets: [
      {
        data: [invested, returns],
        backgroundColor: ["#e0e7ff", "#6366f1"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto bg-zinc-800 p-6 rounded-xl shadow-2xl flex flex-col md:flex-row gap-8">
        {/* LEFT SECTION */}
        <div className="flex-1 space-y-6">
          {/* Toggle */}
          <div className="flex gap-4">
            <button
              onClick={() => setType("sip")}
              className={`px-4 py-2 rounded-full font-semibold ${
                type === "sip" ? "bg-green-500 text-black" : "bg-zinc-700"
              }`}
            >
              SIP
            </button>
            <button
              onClick={() => setType("lumpsum")}
              className={`px-4 py-2 rounded-full font-semibold ${
                type === "lumpsum" ? "bg-green-500 text-black" : "bg-zinc-700"
              }`}
            >
              Lumpsum
            </button>
          </div>

          {/* Input + Slider */}
          <div>
            <label className="text-sm text-gray-300">
              {type === "sip" ? "Monthly Investment" : "Investment Amount"}
            </label>
            <div className="flex justify-between items-center gap-4">
              <input
                type="number"
                className="w-24 px-2 py-1 text-right rounded bg-zinc-700 text-white"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <input
                type="range"
                min={1000}
                max={100000}
                step={500}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {type === "sip" && (
            <div>
              <label className="text-sm text-gray-300">Step-up % per year (optional)</label>
              <div className="flex justify-between items-center gap-4">
                <input
                  type="number"
                  className="w-24 px-2 py-1 text-right rounded bg-zinc-700 text-white"
                  value={stepUp}
                  onChange={(e) => setStepUp(e.target.value)}
                />
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={stepUp}
                  onChange={(e) => setStepUp(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm text-gray-300">Expected Return Rate (%)</label>
            <div className="flex justify-between items-center gap-4">
              <input
                type="number"
                className="w-24 px-2 py-1 text-right rounded bg-zinc-700 text-white"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
              <input
                type="range"
                min={1}
                max={20}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-300">Investment Duration (Years)</label>
            <div className="flex justify-between items-center gap-4">
              <input
                type="number"
                className="w-24 px-2 py-1 text-right rounded bg-zinc-700 text-white"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <input
                type="range"
                min={1}
                max={40}
                step={1}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Results */}
          <div className="mt-4 space-y-2">
            <p className="text-green-400 text-lg font-semibold">
              Total Value: ₹{Number(result).toLocaleString()}
            </p>
            <p className="text-blue-400">
              Invested: ₹{Number(invested).toLocaleString()}
            </p>
            <p className="text-purple-400">
              Returns: ₹{Number(returns).toLocaleString()}
            </p>
          </div>
        </div>

        {/* RIGHT SECTION: CHART */}
        <div className="flex-1 flex justify-center items-center">
          <div className="w-64">
            <Doughnut data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
}
