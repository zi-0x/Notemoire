const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  walletAddress: { type: String, required: true, unique: true, lowercase: true },

  // Profile details
  name: { type: String, default: "Anonymous" },
  profilePicture: { type: String, default: "" },
  bannerImage: { type: String, default: "" },
  bio: { type: String, default: "" },
  role: { type: String, enum: ["student", "teacher"], default: "student" },
  location: { type: String, default: "" },
  website: { type: String, default: "" },
  joinedDate: { type: String, default: new Date().toISOString().split('T')[0] },
  verified: { type: Boolean, default: false },

  // Social metadata
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
  isFollowing: { type: Boolean, default: false },

  date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', UserSchema);
