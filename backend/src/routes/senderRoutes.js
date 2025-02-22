const express = require('express');
const router = express.Router();
const SenderAccount = require('../models/SenderAccount');
const { logger } = require('../utils/logger');

// Get all sender accounts
router.get('/', async (req, res) => {
  try {
    const senders = await SenderAccount.find().select('-credentials.clientSecret -credentials.refreshToken');
    res.json(senders);
  } catch (error) {
    logger.error('Error fetching sender accounts:', error);
    res.status(500).json({ error: 'Failed to fetch sender accounts' });
  }
});

// Create sender account
router.post('/', async (req, res) => {
  try {
    const sender = new SenderAccount(req.body);
    await sender.save();
    res.status(201).json(sender);
  } catch (error) {
    logger.error('Error creating sender account:', error);
    res.status(500).json({ error: 'Failed to create sender account' });
  }
});

// Update sender account
router.put('/:id', async (req, res) => {
  try {
    const sender = await SenderAccount.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!sender) {
      return res.status(404).json({ error: 'Sender account not found' });
    }
    res.json(sender);
  } catch (error) {
    logger.error('Error updating sender account:', error);
    res.status(500).json({ error: 'Failed to update sender account' });
  }
});

// Delete sender account
router.delete('/:id', async (req, res) => {
  try {
    const sender = await SenderAccount.findByIdAndDelete(req.params.id);
    if (!sender) {
      return res.status(404).json({ error: 'Sender account not found' });
    }
    res.json({ message: 'Sender account deleted successfully' });
  } catch (error) {
    logger.error('Error deleting sender account:', error);
    res.status(500).json({ error: 'Failed to delete sender account' });
  }
});

module.exports = router; 