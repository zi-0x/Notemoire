const mongoose = require('mongoose');
const mongURI = "mongodb://localhost:27017/iNotebook";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongURI);
        console.log("Mongoose connected successfully");
    } catch (error) {
        console.error("Mongoose connection failed:", error);
    }
};

module.exports = connectToMongo;