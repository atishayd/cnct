import { Request, Response } from 'express';
import { Job } from '../models/Job';
import { extractJobDetails } from '../services/openai';
import { logger } from '../utils/logger';

export const jobController = {
  async createJob(req: Request, res: Response) {
    try {
      const { jobLink } = req.body;
      
      // Extract job details using OpenAI
      const jobDetails = await extractJobDetails(jobLink);
      
      const job = await Job.create({
        ...jobDetails,
        jobLink,
      });

      res.status(201).json(job);
    } catch (error) {
      logger.error('Error creating job:', error);
      res.status(500).json({ error: 'Failed to create job' });
    }
  },

  async getJobs(req: Request, res: Response) {
    try {
      const jobs = await Job.find().sort({ createdAt: -1 });
      res.json(jobs);
    } catch (error) {
      logger.error('Error fetching jobs:', error);
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  },

  async getJob(req: Request, res: Response) {
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