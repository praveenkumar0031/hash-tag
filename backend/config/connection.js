const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        const url = process.env.MONGODB_URL;
        if (!url) throw new Error("MONGO_URL is not defined in .env");
        await mongoose.connect(url);
        console.log("MongoDB Connection established");
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
