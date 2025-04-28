require('dotenv').config()
const mongoose = require('mongoose');
const connectDB =  () => {



  try {
    // const mongodb = 'mongodb://127.0.0.1:27017/pharmacy'
    const mongodb = process.env.MONGODB_URI
    mongoose.connect(mongodb);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); // Exit the process with failure
  }
};

connectDB()

module.exports = connectDB;
