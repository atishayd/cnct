const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const Contact = require('../models/Contact');
const { logger } = require('../utils/logger');

// Get overall analytics stats
router.get('/stats', async (req, res) => {
  try {
    const [campaigns, contacts] = await Promise.all([
      Campaign.find(),
      Contact.find()
    ]);

    const totalEmailsSent = contacts.reduce((total, contact) => 
      total + (contact.emailHistory?.length || 0), 0);

    const totalResponses = contacts.reduce((total, contact) => 
      total + contact.emailHistory?.filter(email => email.status === 'replied').length || 0, 0);

    const emailStatusDistribution = [
      { name: 'Sent', value: totalEmailsSent },
      { name: 'Opened', value: contacts.reduce((total, contact) => 
        total + contact.emailHistory?.filter(email => email.status === 'opened').length || 0, 0) },
      { name: 'Replied', value: totalResponses },
      { name: 'Bounced', value: contacts.reduce((total, contact) => 
        total + contact.emailHistory?.filter(email => email.status === 'bounced').length || 0, 0) }
    ];

    const stats = {
      totalEmailsSent,
      responseRate: totalEmailsSent ? Math.round((totalResponses / totalEmailsSent) * 100) : 0,
      activeCampaigns: campaigns.filter(c => c.status === 'active').length,
      averageOpenRate: totalEmailsSent ? Math.round((emailStatusDistribution[1].value / totalEmailsSent) * 100) : 0,
      emailStatusDistribution,
      campaignPerformance: campaigns.map(campaign => ({
        id: campaign._id,
        name: campaign.name,
        sent: campaign.sentCount,
        opened: campaign.contacts.length,
        replied: campaign.responseCount,
        successRate: campaign.sentCount ? Math.round((campaign.responseCount / campaign.sentCount) * 100) : 0
      }))
    };

    res.json(stats);
  } catch (error) {
    logger.error('Error fetching analytics stats:', error);
    res.status(500).json({ error: 'Failed to fetch analytics stats' });
  }
});

// Get daily email metrics
router.get('/email-metrics', async (req, res) => {
  try {
    const contacts = await Contact.find();
    const today = new Date();
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyMetrics = last7Days.map(date => {
      const dayStats = contacts.reduce((stats, contact) => {
        const dayEmails = contact.emailHistory?.filter(email => 
          email.sentDate.toISOString().split('T')[0] === date
        ) || [];
        
        return {
          sent: stats.sent + dayEmails.length,
          opened: stats.opened + dayEmails.filter(email => email.status === 'opened').length,
          replied: stats.replied + dayEmails.filter(email => email.status === 'replied').length
        };
      }, { sent: 0, opened: 0, replied: 0 });

      return {
        date,
        ...dayStats
      };
    });

    res.json({ dailyMetrics });
  } catch (error) {
    logger.error('Error fetching email metrics:', error);
    res.status(500).json({ error: 'Failed to fetch email metrics' });
  }
});

module.exports = router; 