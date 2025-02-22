const express = require('express');
const cors = require('cors');
const app = express();
const emailTemplatesRoutes = require('./routes/emailTemplatesRoutes');

// Add this CORS configuration
app.use(cors({
  origin: 'http://localhost:3001', // Frontend origin
  credentials: true
}));

// Also ensure JSON parsing is enabled
app.use(express.json());

// ... other middleware
app.use('/api/email-templates', emailTemplatesRoutes); 