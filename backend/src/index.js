const path = require('path');

// Add error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Load env with verbose logging
const envPath = path.resolve(__dirname, '../../.env');
console.log('\n=== Environment Setup ===');
console.log('Looking for .env at:', envPath);

try {
  const result = require('dotenv').config({ path: envPath });
  
  if (result.error) {
    throw new Error(`Failed to load .env file: ${result.error.message}`);
  }
  
  console.log('✅ Environment file loaded successfully');
} catch (error) {
  console.error('❌ Error loading environment:', error);
  process.exit(1);
}

// Add immediate environment check
const envCheck = {
  port: process.env.PORT,
  mongoUri: process.env.MONGODB_URI ? 'Present' : 'Missing',
  gmailClientId: process.env.GMAIL_CLIENT_ID ? 'Present' : 'Missing',
  gmailClientSecret: process.env.GMAIL_CLIENT_SECRET ? 'Present' : 'Missing',
  gmailRedirectUri: process.env.GMAIL_REDIRECT_URI ? 'Present' : 'Missing',
  gmailRefreshToken: process.env.GMAIL_REFRESH_TOKEN ? 'Present' : 'Missing'
};

console.log('\n=== Environment Variables ===');
console.log(JSON.stringify(envCheck, null, 2));

// Rest of your imports
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route to test server
app.get('/', (req, res) => {
  res.json({ 
    message: 'CNCT API is running',
    environment: envCheck,
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/auth', authRoutes);
app.use('/test', testRoutes);
app.use('/api/contacts', contactRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server with better error handling
const startServer = async () => {
  try {
    console.log('\n=== Server Startup ===');
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer().catch((error) => {
  console.error('❌ Startup error:', error);
  process.exit(1);
}); 