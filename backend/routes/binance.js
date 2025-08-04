// server/routes/binance.js
import express from "express";
import axios from "axios";
import crypto from "crypto";

const router = express.Router();

const API_KEY = process.env.BINANCE_API_KEY;
const API_SECRET = process.env.BINANCE_SECRET_KEY;

// Helper to sign request
const signQuery = (query) => {
  return crypto.createHmac("sha256", API_SECRET).update(query).digest("hex");
};

router.get("/portfolio", async (req, res) => {
  try {
    const timestamp = Date.now();
    const query = `timestamp=${timestamp}`;
    const signature = signQuery(query);

    const response = await axios.get(`https://api.binance.com/api/v3/account?${query}&signature=${signature}`, {
      headers: {
        "X-MBX-APIKEY": API_KEY,
      },
    });

    const balances = response.data.balances.filter((b) => parseFloat(b.free) > 0 || parseFloat(b.locked) > 0);

    res.json({ balances });
  } catch (err) {
    console.error("Binance API error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
});

export default router;
