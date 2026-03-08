const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const jwt = require('jsonwebtoken');

// Auth middleware for internal use
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

router.post('/signup', authController.signup);
router.post('/login-no-otp', authController.loginNoOtp);
router.post('/google-login', authController.googleLogin);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
