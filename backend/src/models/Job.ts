import mongoose from 'mongoose';

export interface IJob extends mongoose.Document {
  companyName: string;
  jobRole: string;
  jobLink: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

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

export const Job = mongoose.model<IJob>('Job', jobSchema); 