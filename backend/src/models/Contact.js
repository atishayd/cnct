const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  alternateEmails: [{ type: String }],
  company: { type: String, required: true },
  role: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationMethod: {
    type: String,
    enum: ['gmail', 'smtp', 'hunter', 'manual'],
    required: true
  },
  lastVerified: {
    type: Date,
    default: Date.now
  },
  notes: { type: String }
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = { Contact }; 