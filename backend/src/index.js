const path = require('path');

// Add error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Load env with verbose logging
const envPath = path.resolve(__dirname, '../.env');
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
const emailTemplateRoutes = require('./routes/emailTemplateRoutes');
const senderRoutes = require('./routes/senderRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/email-templates', emailTemplateRoutes);
app.use('/api/senders', senderRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 