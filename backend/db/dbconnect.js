const mongoose = require('mongoose');
const config = require('../config/dbconfig');

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoURI, config.options);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;