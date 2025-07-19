const mongoose = require('mongoose');
const { Schema } = mongoose;

const NOTESschema = new Schema({
  // The 'user' field links each note to a specific user.
  //ObjectID are ids given to documents by MONGODB. the field user has these ids so we give that as ref 
  // This helps in fetching notes created by a specific logged-in user.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Refers to the User model (should match the model name exactly)
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tag: { type: String, default: "General" },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notes', NOTESschema);
