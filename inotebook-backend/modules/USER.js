const mongoose = require('mongoose');
const { Schema } = mongoose;

const USERschema = new Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', USERschema);
module.exports = User;
