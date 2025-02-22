const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

const connectDB = async () => {
  try {
    console.log('\n=== MongoDB Connection ===');
    console.log('Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Connected:', conn.connection.host);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    logger.error('Failed to connect to MongoDB:', error);
    throw error; // Let the main error handler deal with it
  }
};

module.exports = { connectDB }; 