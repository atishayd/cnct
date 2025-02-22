const mongoose = require('mongoose');

const senderAccountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  provider: {
    type: String,
    enum: ['gmail', 'outlook', 'smtp'],
    required: true
  },
  credentials: {
    clientId: String,
    clientSecret: String,
    refreshToken: String,
    accessToken: String,
    smtpHost: String,
    smtpPort: Number,
    smtpUsername: String,
    smtpPassword: String
  },
  isActive: { type: Boolean, default: true },
  dailySendLimit: { type: Number, default: 50 },
  sendCount: { type: Number, default: 0 },
  lastResetDate: Date
}, { timestamps: true });

module.exports = mongoose.model('SenderAccount', senderAccountSchema); 