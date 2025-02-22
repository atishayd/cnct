const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const emailService = require('../services/email');
const emailVerificationService = require('../services/emailVerification');
const { logger } = require('../utils/logger');

// Get all contacts with job details
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().populate('jobId');
    res.json(contacts);
  } catch (error) {
    logger.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Create contact with email verification
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, company, position, jobId } = req.body;
    
    // Generate and verify email variations
    const domain = company.toLowerCase().replace(/\s+/g, '') + '.com';
    const emailVariations = emailVerificationService.generateEmailVariations(firstName, lastName, domain);
    
    let verifiedEmail = null;
    for (const email of emailVariations) {
      const verification = await emailVerificationService.verifyEmail(email);
      if (verification.isValid) {
        verifiedEmail = email;
        break;
      }
    }

    if (!verifiedEmail) {
      return res.status(400).json({ error: 'No valid email found' });
    }

    const contact = new Contact({
      firstName,
      lastName,
      email: verifiedEmail,
      company,
      position,
      jobId
    });

    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    logger.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// Send email to contact
router.post('/:id/send-email', async (req, res) => {
  try {
    const { templateId, senderAccountId } = req.body;
    const result = await emailService.sendEmail(req.params.id, templateId, senderAccountId);
    res.json(result);
  } catch (error) {
    logger.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Update contact status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    logger.error('Error updating contact status:', error);
    res.status(500).json({ error: 'Failed to update contact status' });
  }
});

module.exports = router; 