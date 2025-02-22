const dns = require('dns');
const net = require('net');
const { promisify } = require('util');
const emailValidator = require('email-validator');
const { logger } = require('../utils/logger');

const resolveMx = promisify(dns.resolveMx);

class EmailVerificationService {
  async verifyEmail(email) {
    try {
      // Step 1: Basic format validation
      if (!emailValidator.validate(email)) {
        return {
          exists: false,
          method: 'format',
          confidence: 'high',
          note: 'Invalid email format'
        };
      }

      // Step 2: Extract domain and check MX records
      const [, domain] = email.split('@');
      let mxRecords;
      try {
        mxRecords = await resolveMx(domain);
        if (!mxRecords || mxRecords.length === 0) {
          return {
            exists: false,
            method: 'dns',
            confidence: 'high',
            note: 'No MX records found for domain'
          };
        }
      } catch (error) {
        return {
          exists: false,
          method: 'dns',
          confidence: 'high',
          note: 'Invalid domain or DNS error'
        };
      }

      // Step 3: Basic SMTP check (connection only)
      const mxHost = mxRecords[0].exchange;
      try {
        const isSmtpValid = await this.checkSmtpConnection(mxHost);
        if (!isSmtpValid) {
          return {
            exists: false,
            method: 'smtp',
            confidence: 'medium',
            note: 'SMTP connection failed'
          };
        }
      } catch (error) {
        logger.warn(`SMTP check failed for ${email}:`, error);
        // Fall back to DNS-only verification
        return {
          exists: true,
          method: 'dns',
          confidence: 'medium',
          note: 'Valid MX records found, SMTP check failed'
        };
      }

      return {
        exists: true,
        method: 'smtp',
        confidence: 'high',
        note: 'Valid MX records and SMTP connection'
      };
    } catch (error) {
      logger.error(`Error verifying email ${email}:`, error);
      throw error;
    }
  }

  checkSmtpConnection(host) {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      const timeout = 5000; // 5 second timeout

      socket.setTimeout(timeout);

      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });

      socket.on('error', () => {
        socket.destroy();
        resolve(false);
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });

      socket.connect(25, host);
    });
  }
}

module.exports = new EmailVerificationService(); 