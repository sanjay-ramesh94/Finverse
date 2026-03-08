const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  mobile: String,
  email: { type: String, unique: true },
  password: String,

  // Login history tracking
  logins: [{
    ip: String,
    device: String,
    city: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
