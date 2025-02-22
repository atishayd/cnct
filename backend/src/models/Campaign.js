const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailTemplate', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'SenderAccount', required: true },
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
  status: {
    type: String,
    enum: ['scheduled', 'active', 'paused', 'completed', 'failed'],
    default: 'scheduled'
  },
  startDate: { type: Date, required: true },
  sendTime: { type: String, required: true },
  followUpDelay: { type: Number, default: 3 }, // days
  maxFollowUps: { type: Number, default: 2 },
  sentCount: { type: Number, default: 0 },
  responseCount: { type: Number, default: 0 },
  nextSendDate: Date,
  lastSentDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema); 