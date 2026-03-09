const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const nodemailer = require('nodemailer');

const otpStore = {};
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.json({
            token: generateToken(user._id),
            user: { _id: user._id, username, email }
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ msg: "Server error" });
    }
};

exports.loginNoOtp = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Incorrect email address" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect password" });
        }

        // IP & City Logic
        const rawIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        const ip = rawIp?.split(",")[0].trim() || "127.0.0.1";

        let city = "Unknown";
        try {
            const locRes = await axios.get(`https://ipapi.co/${ip}/json/`);
            city = locRes.data.city || "Unknown";
        } catch (err) {
            console.warn("🌐 City fetch failed:", err.message);
        }

        user.logins.push({
            ip,
            device: req.headers["user-agent"],
            city,
            timestamp: new Date()
        });

        if (user.logins.length > 20) user.logins = user.logins.slice(-20);
        await user.save();

        res.json({
            token: generateToken(user._id),
            user: { _id: user._id, username: user.username, email: user.email }
        });
    } catch (err) {
        console.error("Login-no-otp error:", err);
        res.status(500).json({ msg: "Server error" });
    }
};

exports.googleLogin = async (req, res) => {
    const { email, username, googleId } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, username, password: googleId });
        }

        const rawIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        const ip = rawIp?.split(",")[0].trim() || "127.0.0.1";

        let city = "Unknown";
        try {
            const locRes = await axios.get(`https://ipapi.co/${ip}/json/`);
            city = locRes.data.city || "Unknown";
        } catch (err) {
            console.warn("🌐 Google login IP fetch failed:", err.message);
        }

        user.logins = user.logins || [];
        user.logins.push({
            ip,
            device: req.headers["user-agent"],
            city,
            timestamp: new Date()
        });

        if (user.logins.length > 20) user.logins = user.logins.slice(-20);
        await user.save();

        res.json({
            token: generateToken(user._id),
            user: { _id: user._id, username: user.username, email: user.email }
        });
    } catch (err) {
        console.error("Google login error:", err);
        res.status(500).json({ msg: "Server error" });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};
