import React, { useEffect, useState } from "react";
import axios from "axios";

const Silver = () => {
  const [silverPrice, setSilverPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSilverPrice = async () => {
      try {
        const response = await axios.get("https://www.goldapi.io/api/XAG/INR", {
          headers: {
            "x-access-token": "goldapi-18tkeusmdsgr9es-io", // ✅ your actual API key
            "Content-Type": "application/json",
          },
        });

        const pricePerOunce = response.data.price;
        const pricePerGram = (pricePerOunce / 31.1035).toFixed(2); // 1 troy ounce = 31.1035 grams
        const pricePerKg = (pricePerGram * 1000).toFixed(0);

        setSilverPrice(pricePerKg);
        setLoading(false);
      } catch (error) {
        console.error("❌ Failed to fetch silver price:", error);
        setLoading(false);
      }
    };

    fetchSilverPrice();
  }, []);

  return (
    <div className="text-white px-4 py-6 min-h-screen bg-gradient-to-b from-black to-gray-900">
      <h1 className="text-3xl font-bold mb-4">📊 Silver Portfolio</h1>

      {loading ? (
        <p className="text-gray-300">Fetching live silver price...</p>
      ) : (
        <div className="bg-gray-800 p-5 rounded-xl mb-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Live Silver Price (INR)</h2>
          <p className="text-blue-400 text-3xl font-bold">₹{silverPrice} / kg</p>
          <p className="text-sm text-gray-400 mt-1">Updated from GoldAPI (XAG → INR)</p>
        </div>
      )}

      <p className="text-gray-300">
        This is your silver investment dashboard. You’ll soon be able to add and track silver bars, coins, or ETFs here.
      </p>
    </div>
  );
};

export default Silver;
