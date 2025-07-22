const mongoose = require('mongoose');

// Updated MongoDB Atlas connection string
const mongURI = "mongodb+srv://theamazingpiyush:dOfme60NaaDqWWbD@notemoire.rmroyb4.mongodb.net/iNotebook?retryWrites=true&w=majority";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Mongoose connected successfully to Atlas");
    } catch (error) {
        console.error("Mongoose connection failed:", error);
    }
};

module.exports = connectToMongo;
