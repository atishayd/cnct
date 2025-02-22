const express = require('express');
const router = express.Router();
const EmailTemplate = require('../models/EmailTemplate');
const { logger } = require('../utils/logger');

// Get all templates
router.get('/', async (req, res) => {
  try {
    const templates = await EmailTemplate.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    logger.error('Error fetching email templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Get single template
router.get('/:id', async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    logger.error('Error fetching email template:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// Create template
router.post('/', async (req, res) => {
  try {
    const template = new EmailTemplate(req.body);
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    logger.error('Error creating email template:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
});

// Update template
router.put('/:id', async (req, res) => {
  try {
    const template = await EmailTemplate.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    logger.error('Error updating email template:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
});

// Delete template
router.delete('/:id', async (req, res) => {
  try {
    const template = await EmailTemplate.findByIdAndDelete(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    logger.error('Error deleting email template:', error);
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

module.exports = router; 