const express = require('express');
const { connectDB } = require('../config/database');
const { Job } = require('../models/Job');
const { extractJobDetails } = require('../services/openai');
const gmailService = require('../services/gmail.js');
const { logger } = require('../utils/logger');

const router = express.Router();

router.get('/system-check', async (req, res) => {
  try {
    // Check env variables first
    const envCheck = {
      mongodb: !!process.env.MONGODB_URI,
      openai: !!process.env.OPENAI_API_KEY,
      gmail: {
        clientId: !!process.env.GMAIL_CLIENT_ID,
        clientSecret: !!process.env.GMAIL_CLIENT_SECRET,
        redirectUri: !!process.env.GMAIL_REDIRECT_URI,
        refreshToken: !!process.env.GMAIL_REFRESH_TOKEN
      }
    };
    console.log('Environment Variables Check:', envCheck);

    // Test MongoDB Connection
    await connectDB();
    logger.info('✅ MongoDB connection successful');

    // Test OpenAI Integration
    const jobDetails = await extractJobDetails(`
      Software Engineer at Google
      We're looking for a Software Engineer to join our team...
    `);
    logger.info('✅ OpenAI integration successful:', jobDetails);

    // Test Database Operations
    const job = await Job.create({
      companyName: 'Test Company',
      jobRole: 'Test Role',
      jobLink: 'https://example.com'
    });
    logger.info('✅ Database operations successful');

    // Test Gmail API
    try {
      const labels = await gmailService.getLabels();
      console.log('Gmail labels fetched:', labels);
      res.json({
        status: 'success',
        message: 'All systems operational',
        details: {
          mongodb: true,
          openai: jobDetails,
          database: job,
          gmail: 'Connected'
        }
      });
    } catch (error) {
      if (error.message.includes('Gmail authentication expired')) {
        res.json({
          status: 'error',
          error: error.message,
          action: 'Please visit http://localhost:4001/auth/google to re-authenticate'
        });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('❌ System check failed:', error);
    res.json({
      status: 'error',
      error: error.message || error
    });
  }
});

module.exports = router; 