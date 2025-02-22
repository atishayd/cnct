const express = require('express');
const contactService = require('../services/contactService');
const { logger } = require('../utils/logger');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const contact = await contactService.createContact(req.body);
    res.status(201).json(contact);
  } catch (error) {
    logger.error('Error creating contact:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const contacts = await contactService.getAllContacts();
    res.json(contacts);
  } catch (error) {
    logger.error('Error getting contacts:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const contact = await contactService.getContactById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    logger.error('Error getting contact:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const contact = await contactService.updateContact(req.params.id, req.body);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    logger.error('Error updating contact:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const contact = await contactService.deleteContact(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    logger.error('Error deleting contact:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 