const { google } = require('googleapis');
const { logger } = require('../utils/logger');

class GmailService {
  constructor() {
    this.initializeOAuth();
  }

  initializeOAuth() {
    try {
      this.oauth2Client = new google.auth.OAuth2(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        process.env.GMAIL_REDIRECT_URI
      );

      if (!process.env.GMAIL_REFRESH_TOKEN) {
        logger.warn('No refresh token found in environment variables');
        return;
      }

      // Set credentials with refresh token
      this.oauth2Client.setCredentials({
        refresh_token: process.env.GMAIL_REFRESH_TOKEN
      });

      // Handle token refresh
      this.oauth2Client.on('tokens', (tokens) => {
        logger.info('Token refresh event triggered');
        if (tokens.refresh_token) {
          logger.info('New refresh token received');
          // Store new refresh token if received
          process.env.GMAIL_REFRESH_TOKEN = tokens.refresh_token;
        }
      });

      this.gmail = google.gmail({
        version: 'v1',
        auth: this.oauth2Client
      });

      logger.info('Gmail service initialized successfully');
    } catch (error) {
      logger.error('Error initializing Gmail service:', error);
      throw error;
    }
  }

  encodeMessage(message) {
    return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  async sendEmail({ to, subject, text, html }) {
    try {
      const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
      const messageParts = [
        `To: ${to}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        html || text
      ];
      const message = messageParts.join('\n');

      const encodedMessage = this.encodeMessage(message);

      const res = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });

      logger.info('Email sent successfully:', res.data);
      return res.data;
    } catch (error) {
      logger.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async getDrafts() {
    try {
      const res = await this.gmail.users.drafts.list({ userId: 'me' });
      return res.data;
    } catch (error) {
      logger.error('Error getting drafts:', error);
      throw error;
    }
  }

  async getLabels() {
    try {
      logger.info('Attempting to get Gmail labels...');
      
      // Get fresh access token
      await this.oauth2Client.getAccessToken();
      
      const response = await this.gmail.users.labels.list({
        userId: 'me'
      });
      
      logger.info('Successfully retrieved labels');
      return response.data.labels;
    } catch (error) {
      if (error.message.includes('invalid_grant')) {
        logger.error('Invalid grant error - refresh token may be expired');
        throw new Error('Gmail authentication expired. Please re-authenticate at /auth/google');
      }
      logger.error('Error getting labels:', error);
      throw error;
    }
  }

  async verifyEmail(email) {
    try {
      // For now, we'll just do basic format validation
      // and assume the email might be valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidFormat = emailRegex.test(email);
      
      if (!isValidFormat) {
        return { 
          exists: false, 
          method: 'format',
          confidence: 'high',
          note: 'Invalid email format'
        };
      }

      // For now, return a low confidence "might exist"
      // TODO: Implement proper SMTP verification
      return {
        exists: true,
        method: 'format',
        confidence: 'low',
        note: 'Basic format validation only'
      };
    } catch (error) {
      logger.error(`Error verifying email ${email}:`, error);
      throw error;
    }
  }
}

const gmailService = new GmailService();
module.exports = gmailService; 