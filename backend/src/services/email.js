const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { SenderAccount } = require('../models/SenderAccount');
const { EmailTemplate } = require('../models/EmailTemplate');
const { logger } = require('../utils/logger');

class EmailService {
  async createTransporter(senderAccount) {
    if (senderAccount.provider === 'gmail') {
      const oauth2Client = new google.auth.OAuth2(
        senderAccount.credentials.clientId,
        senderAccount.credentials.clientSecret,
        process.env.GMAIL_REDIRECT_URI
      );

      oauth2Client.setCredentials({
        refresh_token: senderAccount.credentials.refreshToken
      });

      const accessToken = await oauth2Client.getAccessToken();

      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: senderAccount.email,
          clientId: senderAccount.credentials.clientId,
          clientSecret: senderAccount.credentials.clientSecret,
          refreshToken: senderAccount.credentials.refreshToken,
          accessToken: accessToken.token
        }
      });
    }

    // Add other email provider configurations here
  }

  async sendEmail(contactId, templateId, senderAccountId) {
    try {
      const contact = await Contact.findById(contactId).populate('jobId');
      const template = await EmailTemplate.findById(templateId);
      const senderAccount = await SenderAccount.findById(senderAccountId);

      const transporter = await this.createTransporter(senderAccount);

      // Replace template variables
      let content = template.content;
      const variables = {
        firstName: contact.firstName,
        lastName: contact.lastName,
        companyName: contact.company,
        jobRole: contact.jobId.jobRole,
        // Add more variables as needed
      };

      Object.entries(variables).forEach(([key, value]) => {
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });

      const mailOptions = {
        from: senderAccount.email,
        to: contact.email,
        subject: template.subject,
        html: content
      };

      const result = await transporter.sendMail(mailOptions);

      // Update contact email history
      await Contact.findByIdAndUpdate(contactId, {
        $push: {
          emailHistory: {
            subject: template.subject,
            content: content,
            sentDate: new Date(),
            status: 'sent'
          }
        },
        status: 'contacted',
        lastContactDate: new Date(),
        nextFollowUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days later
      });

      return result;
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService(); 