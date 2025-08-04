import React, { useEffect, useState } from "react";
import axios from "axios";

const Gold = () => {
  const [goldPrice, setGoldPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        const response = await axios.get("https://www.goldapi.io/api/XAU/INR", {
          headers: {
            "x-access-token": "goldapi-18tkeusmdsgr9es-io", // ✅ your actual API key
            "Content-Type": "application/json",
          },
        });

        const pricePerOunce = response.data.price;
        const pricePerGram = (pricePerOunce / 31.1035).toFixed(2); // 1 troy ounce = 31.1035 grams
        const pricePer10g = (pricePerGram * 10).toFixed(0);

        setGoldPrice(pricePer10g);
        setLoading(false);
      } catch (error) {
        console.error("❌ Failed to fetch gold price:", error);
        setLoading(false);
      }
    };

    fetchGoldPrice();
  }, []);

  return (
    <div className="text-white px-4 py-6 min-h-screen bg-gradient-to-b from-black to-gray-900">
      <h1 className="text-3xl font-bold mb-4">📈 Gold Portfolio</h1>

      {loading ? (
        <p className="text-gray-300">Fetching live gold price...</p>
      ) : (
        <div className="bg-gray-800 p-5 rounded-xl mb-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Live Gold Price (INR)</h2>
          <p className="text-yellow-400 text-3xl font-bold">₹{goldPrice} / 10g</p>
         
        </div>
      )}

      <p className="text-gray-300">
        This is your gold investment dashboard. You’ll soon be able to add and track physical & digital gold assets here.
      </p>
    </div>
  );
};

export default Gold;
