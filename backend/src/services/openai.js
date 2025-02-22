const OpenAI = require('openai');
const { logger } = require('../utils/logger');

class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async extractJobDetails(jobDescription) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that extracts job details from job postings. Return only a JSON object with companyName and jobRole."
          },
          {
            role: "user",
            content: `Extract the company name and job role from this job posting: ${jobDescription}`
          }
        ],
        temperature: 0.7
      });

      const result = JSON.parse(response.choices[0].message.content);
      logger.info('Successfully extracted job details:', result);
      return result;
    } catch (error) {
      logger.error('Error extracting job details:', error);
      throw error;
    }
  }

  async generateEmailTemplate(jobDetails, templateType = 'initial') {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert at writing professional cold emails for job applications."
          },
          {
            role: "user",
            content: `Write a ${templateType} email template for a ${jobDetails.jobRole} position at ${jobDetails.companyName}. 
            Use variables like {{firstName}}, {{lastName}}, {{companyName}}, {{jobRole}}.`
          }
        ],
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      logger.error('Error generating email template:', error);
      throw error;
    }
  }
}

module.exports = new OpenAIService(); 