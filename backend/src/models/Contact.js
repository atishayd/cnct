const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, required: true },
  position: { type: String, required: true },
  status: {
    type: String,
    enum: ['uncontacted', 'contacted', 'responded', 'no_response'],
    default: 'uncontacted'
  },
  lastContactDate: Date,
  nextFollowUpDate: Date,
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  emailHistory: [{
    subject: String,
    content: String,
    sentDate: Date,
    status: {
      type: String,
      enum: ['sent', 'delivered', 'opened', 'replied', 'bounced'],
      default: 'sent'
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema); 