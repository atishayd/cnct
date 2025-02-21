import express from 'express';
import { jobController } from '../controllers/jobController';

const router = express.Router();

router.post('/', jobController.createJob);
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJob);

export default router; 