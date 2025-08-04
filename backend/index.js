

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();


const app = express();
app.use(express.json());

// ✅ CORS: Allow both localhost (dev) and Vercel (prod)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000", // added for pwa
  "https://finverse-ft6q.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed from this origin: " + origin));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔧 Mongo Models
const userSchema = new mongoose.Schema({
  username: String,
  mobile: String,
  email: { type: String, unique: true },
  password: String,

  // 👇 Login history tracking
 logins: [{
  ip: String,
  device: String,
  city: String,
  timestamp: { type: Date, default: Date.now }
}]

});

const User = mongoose.model("User", userSchema);

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  type: { type: String, enum: ["investment", "short-term", "long-term"] },
  target: Number,
  current: { type: Number, default: 0 },
}, { timestamps: true });
const Goal = mongoose.model("Goal", goalSchema);

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isInvestment: { type: Boolean, default: false },
  type: { type: String, enum: ["income", "expense", "transfer"] },
  date: String,
  amount: Number,
  category: String,
  account: String,
  note: String,
  description: String,
  image: String,
}, { timestamps: true });
const Transaction = mongoose.model("Transaction", transactionSchema);

const useragent = require("express-useragent");
app.use(useragent.express());

const axios = require("axios");

app.post("/api/auth/login-no-otp", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // ✅ Get first public IP
    const rawIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const ip = rawIp?.split(",").find(ip =>
      !ip.includes("127.") &&
      !ip.includes("::") &&
      !ip.startsWith("10.") &&
      !ip.startsWith("192.168.")
    )?.trim() || "103.196.28.182"; // fallback test IP

    // ✅ Fetch City from IP
    let city = "Unknown";
    try {
      const locRes = await axios.get(`https://ipapi.co/${ip}/json/`);
      city = locRes.data.city || "Unknown";
    } catch (err) {
      console.warn("🌐 City fetch failed:", err.message);
    }

    // ✅ Get device info from User-Agent
    const device = req.headers["user-agent"];

    // ✅ Push login entry (and limit to last 20)
    user.logins.push({
      ip,
      device,
      timestamp: new Date(),
      city
    });

    // Keep only latest 20 logins
    if (user.logins.length > 20) {
      user.logins = user.logins.slice(-20);
    }

    await user.save();

    // ✅ Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Login-no-otp error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


//login history 
app.get("/api/user/:id/logins", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user.logins || []);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});
app.get("/api/user/:id/logins", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user.logins || []);
  } catch (err) {
    console.error("Login history fetch error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Add this after your login routes
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// otp for sign up//
// Step 1: Send OTP for signup
app.post("/api/auth/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

  await transporter.sendMail({
    from: '"Finverse" <no-reply@finverse.com>',
    to: email,
    subject: "Verify your email - OTP",
    text: `Your OTP for Finverse signup is ${otp}`,
  });

  res.json({ msg: "OTP sent" });
});


// Step 2: Verify OTP and complete registration
app.post("/api/auth/verify-otp-signup", async (req, res) => {
  const { email, password, otp } = req.body;
  const stored = otpStore[email];
  if (!stored || stored.otp != otp || Date.now() > stored.expires)
    return res.status(400).json({ msg: "Invalid or expired OTP" });

  delete otpStore[email];

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username: stored.username,
    mobile: stored.mobile,
    email,
    password: hashedPassword,
  });
  await user.save();

  res.json({ msg: "Signup complete" });
});


// 🛠 Multer (uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// 🔐 Email Auth (OTP)
const otpStore = {};
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) {
    console.error("❌ Mailer error:", err.message);
  } else {
    console.log("✅ Mailer ready");
  }
});

// =======================
//      AUTH ROUTES
// =======================

// 🔑 Signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ msg: "User already exists" });

    const user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10),
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { _id: user._id, username, email } });
  } catch (err) {
    console.error("Signup:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// ✅ Google Login
app.post("/api/auth/google-login", async (req, res) => {
  const { email, username, googleId } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        username,
        password: googleId, // using Google ID as placeholder password
      });
    }

    // ✅ Get public IP
    const rawIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const ip = rawIp?.split(",").find(ip =>
      !ip.includes("127.") &&
      !ip.includes("::") &&
      !ip.startsWith("10.") &&
      !ip.startsWith("192.168.")
    )?.trim() || "103.196.28.182"; // fallback IP for dev/testing

    // ✅ Get city from IP
    let city = "Unknown";
    try {
      const locRes = await axios.get(`https://ipapi.co/${ip}/json/`);
      city = locRes.data.city || "Unknown";
    } catch (err) {
      console.warn("🌐 City fetch failed:", err.message);
    }

    // ✅ Get device info
    const device = req.headers["user-agent"];

    // ✅ Add login entry and limit to last 20
    user.logins = user.logins || [];
    user.logins.push({
      ip,
      device,
      city,
      timestamp: new Date()
    });

    if (user.logins.length > 20) {
      user.logins = user.logins.slice(-20);
    }

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Google login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// 🔑 Login → OTP
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ msg: "Invalid email or password" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    await transporter.sendMail({
      from: '"FinApp" <no-reply@finapp.com>',
      to: email,
      subject: "Your OTP Code",
      text: `Your FinApp login OTP is ${otp}`,
    });

    console.log(`OTP ${otp} sent to ${email}`);
    res.json({ msg: "OTP sent", email });
  } catch (err) {
    console.error("Login:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// 🔐 Verify OTP
app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const stored = otpStore[email];
    if (!stored || stored.otp != otp || Date.now() > stored.expires)
      return res.status(400).json({ msg: "Invalid or expired OTP" });

    delete otpStore[email];
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ msg: "OTP verified", token, user: { _id: user._id, username: user.username, email } });
  } catch (err) {
    console.error("Verify OTP:", err);
    res.status(500).json({ msg: "Server error" });
  }
});
// Step 1: Send OTP
app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

  await transporter.sendMail({
    from: '"Finverse" <no-reply@finverse.com>',
    to: email,
    subject: "Reset Your Password - OTP",
    text: `Your OTP to reset password is ${otp}`,
  });

  res.json({ msg: "OTP sent" });
});

// Step 2: Verify OTP & Reset Password
app.post("/api/auth/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const stored = otpStore[email];
  if (!stored || stored.otp != otp || Date.now() > stored.expires)
    return res.status(400).json({ msg: "Invalid or expired OTP" });

  delete otpStore[email];

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ msg: "Password reset successfully" });
});

//Change password in settings //
app.post("/api/auth/change-password", async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// =======================
//        GOALS
// =======================
app.post("/api/goals", async (req, res) => {
  try {
    const goal = new Goal(req.body);
    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

app.get("/api/goals/:userId", async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

app.put("/api/goals/:goalId/add", async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.goalId);
    goal.current += Number(req.body.amount);
    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

app.delete("/api/goals/:id", async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

//binance //
//
//
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Binance API is live!");
});

module.exports = router;
// =======================
//       SETTINGS
// =======================
app.put("/api/user/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, { username: req.body.username }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});app.delete("/api/user/delete", async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Delete user's transactions and goals
    await Transaction.deleteMany({ userId });
    await Goal.deleteMany({ userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({ msg: "Account deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// =======================
//    TRANSACTIONS
// =======================
const investCats = ["mutual fund", "gold", "silver", "stocks"];

app.post("/api/transactions", upload.single("image"), async (req, res) => {
  try {
    const data = req.body;
    data.isInvestment = investCats.includes((data.category || "").toLowerCase());
    if (req.file) data.image = `/uploads/${req.file.filename}`;

    const tx = new Transaction(data);
    await tx.save();

    if (data.type === "transfer") {
      const g = await Goal.findOne({ userId: data.userId, name: data.category });
      if (g) { g.current += Number(data.amount); await g.save(); }
    }

    res.json(tx);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

app.get("/api/transactions/user/:userId", async (req, res) => {
  try {
    const txs = await Transaction.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(txs);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

app.get("/api/transactions/investments/:userId", async (req, res) => {
  try {
    const investments = await Transaction.find({ userId: req.params.userId, isInvestment: true }).sort({ createdAt: -1 });
    res.json(investments);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

app.get("/api/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ msg: "Transaction not found" });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

app.put("/api/transactions/:id", upload.single("image"), async (req, res) => {
  try {
    const data = req.body;
    data.isInvestment = investCats.includes((data.category || "").toLowerCase());
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const updated = await Transaction.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// =======================
//       INSIGHTS
// =======================
app.get("/api/insights/:userId", async (req, res) => {
  try {
    const txs = await Transaction.find({ userId: req.params.userId });
    const monthly = {};
    txs.forEach(tx => {
      const m = tx.date.slice(0, 7);
      monthly[m] = monthly[m] || {};
      monthly[m][tx.category] = (monthly[m][tx.category] || 0) + tx.amount;
    });

    const months = Object.keys(monthly).sort().slice(-2);
    const [p, c] = months;
    const msgs = [];

    if (p && c) {
      const mp = monthly[p], mc = monthly[c];
      for (const cat in mc) {
        const prev = mp[cat] || 0, now = mc[cat];
        const diff = now - prev, pct = prev ? ((diff / prev) * 100).toFixed(1) : null;

        if (!prev && now > 0) msgs.push(`📈 Started spending on "${cat}".`);
        else if (pct && Math.abs(pct) > 10) {
          msgs.push(diff > 0
            ? `🔺 Spending ${pct}% more on ${cat}.`
            : `🟢 Spending dropped by ${Math.abs(pct)}% on ${cat}.`);
        }
      }
    }

    res.json({ insights: msgs });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// =======================
//     MONGODB + SERVER
// =======================
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error("❌ MongoDB connection failed:", err));

