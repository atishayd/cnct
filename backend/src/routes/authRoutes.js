const express = require('express');
const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');
const gmailService = require('../services/gmail');

const router = express.Router();

// Define constants
const REDIRECT_URI = 'http://localhost:4001/auth/google/callback';
const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;

// Verify required environment variables with detailed logging
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing required environment variables:', {
    GMAIL_CLIENT_ID: process.env.GMAIL_CLIENT_ID ? 'Present' : 'Missing',
    GMAIL_CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET ? 'Present' : 'Missing',
    GMAIL_REDIRECT_URI: process.env.GMAIL_REDIRECT_URI ? 'Present' : 'Missing'
  });
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Helper function to update .env file with new refresh token
async function updateEnvFile(newRefreshToken) {
  const envPath = path.resolve(__dirname, '../../../.env');
  console.log('Updating refresh token in:', envPath);
  const envContent = await fs.readFile(envPath, 'utf8');
  const updatedContent = envContent.replace(
    /GMAIL_REFRESH_TOKEN=.*/,
    `GMAIL_REFRESH_TOKEN=${newRefreshToken}`
  );
  await fs.writeFile(envPath, updatedContent);
}

router.get('/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // Force consent screen to get new refresh token
    scope: [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.labels'
    ]
  });
  res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    
    // Save refresh token to .env
    if (tokens.refresh_token) {
      const envPath = path.join(__dirname, '../../../.env');
      const envContent = await fs.readFile(envPath, 'utf8');
      const updatedContent = envContent.replace(
        /GMAIL_REFRESH_TOKEN=.*/,
        `GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`
      );
      await fs.writeFile(envPath, updatedContent);
      
      // Reinitialize Gmail service with new token
      gmailService.initializeOAuth();
    }

    res.send(`
      <html>
        <body>
          <h1>Authentication successful!</h1>
          <p>You can close this window and restart the server.</p>
          <script>
            setTimeout(() => window.close(), 3000);
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).send('Authentication failed');
  }
});

module.exports = router; 