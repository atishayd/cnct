const { Job } = require('../models/Job');
const { extractJobDetails } = require('../services/openai');
const { logger } = require('../utils/logger');

const jobController = {
  async createJob(req, res) {
    try {
      const { jobLink } = req.body;
      // Rest of the implementation...
    } catch (error) {
      logger.error('Error creating job:', error);
      res.status(500).json({ error: 'Failed to create job' });
    }
  },

  async getJobs(req, res) {
    try {
      const jobs = await Job.find();
      res.json(jobs);
    } catch (error) {
      logger.error('Error fetching jobs:', error);
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  },

  async getJob(req, res) {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
      res.json(job);
    } catch (error) {
      logger.error('Error fetching job:', error);
      res.status(500).json({ error: 'Failed to fetch job' });
    }
  }
};

module.exports = jobController; 