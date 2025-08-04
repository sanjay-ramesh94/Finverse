import React, { useEffect, useState } from "react";
import axios from "axios";

const coins = [
  { symbol: "BTC", pair: "BTCUSDT" },
  { symbol: "ETH", pair: "ETHUSDT" },
  { symbol: "SOL", pair: "SOLUSDT" },
];

const convertToINR = 83.0; // USD to INR (approx); update dynamically if needed

const Crypto = () => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const promises = coins.map((coin) =>
          axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${coin.pair}`)
        );

        const results = await Promise.all(promises);
        const updatedPrices = {};

        results.forEach((res, index) => {
          const priceUSD = parseFloat(res.data.price);
          updatedPrices[coins[index].symbol] = (priceUSD * convertToINR).toFixed(0); // Convert to INR
        });

        setPrices(updatedPrices);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching crypto prices:", err);
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  return (
    <div className="text-white px-4 py-6 min-h-screen bg-gradient-to-b from-black to-gray-900">
      <h1 className="text-3xl font-bold mb-6">💰 Crypto Portfolio</h1>

      {loading ? (
        <p className="text-gray-400">Fetching live prices from Binance...</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {coins.map((coin) => (
            <div key={coin.symbol} className="bg-gray-800 p-5 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-2">{coin.symbol}/INR</h2>
              <p className="text-green-400 text-3xl font-bold">₹{prices[coin.symbol]}</p>
              <p className="text-sm text-gray-400 mt-1">Live from Binance</p>
            </div>
          ))}
        </div>
      )}

      <p className="text-gray-300 mt-6">
        This dashboard displays real-time prices of top cryptocurrencies. Manual portfolio tracking and API sync coming soon!
      </p>
    </div>
  );
};

export default Crypto;
