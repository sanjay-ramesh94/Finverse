const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const goalsRouter = require("./routes/goals");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.log("❌ MongoDB connection failed:", err));

// Simple route
app.get("/", (req, res) => res.send("API is working"));
app.use("/api/transactions", require("./routes/transactions"));
app.use('/uploads', express.static('uploads'));

app.use("/api/goals", goalsRouter);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

console.log("🌍 MONGO_URI =", process.env.MONGO_URI);
/*
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const goalsRouter = require("./routes/goals");
require("dotenv").config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.get("/", (req, res) => res.send("✅ API is working"));

app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/goals", goalsRouter);
app.use("/api/auth", require("./routes/auth"));
app.use("/uploads", express.static("uploads"));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB connection failed:", err));

// ✅ Port + Server IP Binding
const PORT = process.env.PORT || 5000;

// ⬅️ CHANGE THIS LINE ONLY:
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

console.log("🌍 MONGO_URI =", process.env.MONGO_URI);
*/