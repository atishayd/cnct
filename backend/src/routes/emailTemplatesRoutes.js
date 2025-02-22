const express = require('express');
const router = express.Router();
const EmailTemplate = require('../models/EmailTemplate');
const { logger } = require('../utils/logger');

// Get all templates
router.get('/', async (req, res) => {
  try {
    const templates = await EmailTemplate.find();
    res.json(templates);
  } catch (error) {
    logger.error('Error fetching email templates:', error);
    res.status(500).json({ error: 'Failed to fetch email templates' });
  }
});

// Create new template
router.post('/', async (req, res) => {
  try {
    const template = new EmailTemplate(req.body);
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    logger.error('Error creating email template:', error);
    res.status(500).json({ error: 'Failed to create email template' });
  }
});

module.exports = router; 