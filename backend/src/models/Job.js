const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  jobRole: { type: String, required: true },
  jobLink: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

module.exports = { Job }; 