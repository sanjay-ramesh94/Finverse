import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SWPCalculator() {
  const [withdrawal, setWithdrawal] = useState("10000");
  const [rate, setRate] = useState("12");
  const [duration, setDuration] = useState("10");

  const [futureValue, setFutureValue] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [chartData, setChartData] = useState({
    labels: ["Total Withdrawn", "Future Value"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#facc15", "#6366f1"],
        borderWidth: 0,
      },
    ],
  });

  useEffect(() => {
    const PMT = parseFloat(withdrawal || 0);
    const annualRate = parseFloat(rate || 0);
    const t = parseFloat(duration || 0);

    const n = 12;
    const r = annualRate / 100;
    const monthlyRate = r / n;
    const totalMonths = n * t;

    let fv = 0;
    let total = 0;

    if (monthlyRate > 0 && PMT > 0 && t > 0) {
      const factor = Math.pow(1 + monthlyRate, totalMonths);
      fv = PMT * ((factor - 1) / monthlyRate);
      total = PMT * totalMonths;
    }

    setFutureValue(fv);
    setTotalWithdrawn(total);

    setChartData({
      labels: ["Total Withdrawn", "Future Value of Withdrawals"],
      datasets: [
        {
          data: [total, fv],
          backgroundColor: ["#facc15", "#6366f1"],
          borderWidth: 0,
        },
      ],
    });
  }, [withdrawal, rate, duration]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto bg-zinc-800 p-6 rounded-xl shadow-2xl flex flex-col md:flex-row gap-8">
        {/* LEFT SECTION */}
        <div className="flex-1 space-y-6">
          <h2 className="text-2xl font-bold text-yellow-400">SWP Calculator</h2>

          <div>
            <label className="text-sm text-gray-300">Monthly Withdrawal (₹)</label>
            <div className="flex justify-between items-center gap-4">
              <input
                type="number"
                className="w-24 px-2 py-1 text-right rounded bg-zinc-700 text-white"
                value={withdrawal}
                onChange={(e) => setWithdrawal(e.target.value)}
              />
              <input
                type="range"
                min={1000}
                max={100000}
                step={500}
                value={withdrawal}
                onChange={(e) => setWithdrawal(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

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
            <label className="text-sm text-gray-300">Withdrawal Duration (Years)</label>
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
                max={30}
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
              Future Value: ₹{Math.round(futureValue).toLocaleString()}
            </p>
            <p className="text-yellow-300">
              Total Withdrawn: ₹{Math.round(totalWithdrawn).toLocaleString()}
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
