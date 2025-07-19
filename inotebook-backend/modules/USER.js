const mongoose = require('mongoose');
const { Schema } = mongoose;

const USERschema = new Schema({
    Name: { type: String, required: true },
    EmailID: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    date: { type: Date, default: Date.now }
});
const User= mongoose.model ('User', USERschema)
module.exports = User 