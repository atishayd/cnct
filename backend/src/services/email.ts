import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

interface EmailConfig {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(config: EmailConfig) {
    try {
      const info = await this.transporter.sendMail(config);
      logger.info('Email sent:', info.messageId);
      return info;
    } catch (error) {
      logger.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async verifyEmailAddress(email: string): Promise<boolean> {
    // Implement email verification logic here
    // This could use services like Hunter.io or ZeroBounce
    return true;
  }
} 