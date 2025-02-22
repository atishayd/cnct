const OpenAI = require('openai');
const { logger } = require('../utils/logger');
const { Contact } = require('../models/Contact');
const gmailService = require('./gmail');
const emailVerificationService = require('./emailVerificationService');

class ContactService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateEmailPatterns(firstName, lastName, company) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert at corporate email patterns. Return only a JSON array of the most likely email addresses, ordered by probability."
          },
          {
            role: "user",
            content: `Research and generate the most likely email patterns for ${company}.
              Person: ${firstName} ${lastName}
              Company: ${company}
              
              Consider:
              1. Common patterns for this specific company
              2. Standard corporate email formats
              3. Domain variations (e.g., google.com, alphabet.com for Google)
              
              Return format: ["most.likely@domain.com", "second.likely@domain.com", ...]
              Return only the JSON array, no other text.`
          }
        ],
        temperature: 0.7
      });

      const suggestedPatterns = JSON.parse(response.choices[0].message.content);
      logger.info(`Generated ${suggestedPatterns.length} email patterns for ${firstName} ${lastName} at ${company}`);
      
      return suggestedPatterns;
    } catch (error) {
      logger.error('Error generating email patterns:', error);
      throw error;
    }
  }

  async verifyEmail(email) {
    try {
      logger.info(`Attempting to verify email: ${email}`);

      // Use the new email verification service
      const verification = await emailVerificationService.verifyEmail(email);
      
      // Log the result
      logger.info(`Email verification result for ${email}:`, {
        exists: verification.exists,
        method: verification.method,
        confidence: verification.confidence
      });

      return verification;
    } catch (error) {
      logger.error(`Error in email verification for ${email}:`, error);
      // Fallback to basic format check
      return {
        exists: true,
        method: 'format',
        confidence: 'low',
        note: 'Verification service error, using format validation only'
      };
    }
  }

  async createContact(contactData) {
    try {
      const { firstName, lastName, company, role } = contactData;
      logger.info(`Creating contact for ${firstName} ${lastName} at ${company}`);

      // Generate potential email patterns
      const emailPatterns = await this.generateEmailPatterns(firstName, lastName, company);
      
      // Verify each email pattern
      const verificationResults = await Promise.all(
        emailPatterns.map(async (email) => {
          const verification = await this.verifyEmail(email);
          return {
            email,
            ...verification
          };
        })
      );

      // Sort by confidence and filter verified
      const verifiedEmails = verificationResults
        .filter(result => result.exists)
        .sort((a, b) => {
          const confidenceScore = { high: 3, medium: 2, low: 1 };
          return confidenceScore[b.confidence] - confidenceScore[a.confidence];
        })
        .map(result => result.email);

      if (verifiedEmails.length === 0) {
        throw new Error('No valid email patterns found');
      }

      // Create contact with best guess email
      const contact = await Contact.create({
        firstName,
        lastName,
        email: verifiedEmails[0],
        company,
        role,
        isVerified: verificationResults[0].confidence === 'high',
        verificationMethod: verificationResults[0].method,
        alternateEmails: verifiedEmails.slice(1),
        notes: `Verified with ${verificationResults[0].confidence} confidence: ${verificationResults[0].note || ''}`
      });

      logger.info(`Successfully created contact: ${contact.firstName} ${contact.lastName} (${contact.email})`);
      return contact;
    } catch (error) {
      logger.error('Error creating contact:', error);
      throw error;
    }
  }

  async getAllContacts() {
    return Contact.find();
  }

  async getContactById(id) {
    return Contact.findById(id);
  }

  async updateContact(id, updateData) {
    return Contact.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteContact(id) {
    return Contact.findByIdAndDelete(id);
  }
}

module.exports = new ContactService(); 