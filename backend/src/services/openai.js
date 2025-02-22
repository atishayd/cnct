const OpenAI = require('openai');
const { logger } = require('../utils/logger');

const extractJobDetails = async (jobDescription) => {
  try {
    console.log('OpenAI Key exists:', !!process.env.OPENAI_API_KEY);
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
      Extract the company name and job role from the following job description:
      ${jobDescription}
      
      Return the information in JSON format:
      {
        "companyName": "...",
        "jobRole": "..."
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0].message?.content || '';
    return JSON.parse(content);
  } catch (error) {
    logger.error('Error extracting job details:', error);
    throw new Error('Failed to extract job details');
  }
};

module.exports = { extractJobDetails }; 