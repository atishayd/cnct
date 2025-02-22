const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const { logger } = require('../utils/logger');

// Get all campaigns with populated references
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate('templateId')
      .populate('senderId')
      .populate('contacts');
    res.json(campaigns);
  } catch (error) {
    logger.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// Create new campaign
router.post('/', async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    logger.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// Update campaign status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    logger.error('Error updating campaign status:', error);
    res.status(500).json({ error: 'Failed to update campaign status' });
  }
});

// Delete campaign
router.delete('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    logger.error('Error deleting campaign:', error);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

// Schedule campaign
router.post('/schedule', async (req, res) => {
  try {
    const { templateId, senderId, contacts, startDate, sendTime, followUpDelay, maxFollowUps } = req.body;
    
    const campaign = new Campaign({
      name: `Campaign ${new Date().toLocaleDateString()}`,
      templateId,
      senderId,
      contacts,
      startDate,
      sendTime,
      followUpDelay,
      maxFollowUps,
      nextSendDate: new Date(startDate)
    });

    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    logger.error('Error scheduling campaign:', error);
    res.status(500).json({ error: 'Failed to schedule campaign' });
  }
});

module.exports = router; 