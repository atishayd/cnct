const axios = require('axios');
const { logger } = require('../utils/logger');

class EmailVerificationService {
  async verifyEmail(email) {
    try {
      // Using a service like ZeroBounce or Hunter.io
      const response = await axios.get(`https://api.zerobounce.net/v2/validate`, {
        params: {
          api_key: process.env.ZEROBOUNCE_API_KEY,
          email: email
        }
      });

      return {
        isValid: response.data.status === 'valid',
        status: response.data.status,
        subStatus: response.data.sub_status
      };
    } catch (error) {
      logger.error('Error verifying email:', error);
      throw error;
    }
  }

  generateEmailVariations(firstName, lastName, domain) {
    const variations = [
      `${firstName}.${lastName}@${domain}`,
      `${firstName}${lastName}@${domain}`,
      `${firstName[0]}${lastName}@${domain}`,
      `${firstName}@${domain}`,
      `${firstName[0]}.${lastName}@${domain}`,
      // Add more variations as needed
    ];

    return variations.map(email => email.toLowerCase());
  }
}

module.exports = new EmailVerificationService(); 