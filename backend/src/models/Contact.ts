import mongoose from 'mongoose';

export interface IContact extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

export const Contact = mongoose.model<IContact>('Contact', contactSchema); 