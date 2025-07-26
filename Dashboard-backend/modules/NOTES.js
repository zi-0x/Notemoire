const mongoose = require('mongoose');
const { Schema } = mongoose;

const NOTESschema = new Schema({
  // The 'user' field links each note to a specific user (if using auth).
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Refers to the User model
  },

  // New: For Web3 users — store wallet address instead of/in addition to user ID
  walletAddress: {
    type: String,
    lowercase: true,
    default: null,
  },

  title: { type: String, required: true },
  description: { type: String, required: true },
  tag: { type: String, default: "General" },
  summary: { type: String, default: "" },
  flashcards: { type: String, default: "" },
  quiz: { type: String, default: "" },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notes', NOTESschema);
