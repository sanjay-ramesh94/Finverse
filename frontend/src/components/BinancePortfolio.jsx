import React, { useEffect, useState } from "react";
import axios from "axios";

const BinancePortfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get("/api/binance/portfolio");
        setPortfolio(res.data.balances);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  return (
    <div className="text-white px-6 py-8">
      <h2 className="text-3xl font-bold mb-6">🪙 My Binance Portfolio</h2>
      {loading ? (
        <p>Loading portfolio...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portfolio.map((coin) => (
            <div
              key={coin.asset}
              className="bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-700 transition"
            >
              <h3 className="text-xl font-semibold">{coin.asset}</h3>
              <p className="text-green-400">Free: {coin.free}</p>
              <p className="text-yellow-400">Locked: {coin.locked}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BinancePortfolio;
