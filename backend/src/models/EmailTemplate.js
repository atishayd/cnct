const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['initial', 'followUp', 'custom'],
    default: 'custom'
  },
  variables: [String], // e.g., {{firstName}}, {{companyName}}, etc.
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema); 