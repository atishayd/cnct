import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/database';
import { Job } from './models/Job';
import { extractJobDetails } from './services/openai';
import { EmailService } from './services/email';

// Load .env from root directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function testSetup() {
  try {
    // Verify environment variables are loaded
    console.log('Checking environment variables...');
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set');
    }
    console.log('✅ Environment variables loaded');

    // Test database connection
    await connectDB();
    console.log('✅ Database connection successful');

    // Test OpenAI integration
    const jobDetails = await extractJobDetails(`
      Software Engineer at Google
      We're looking for a Software Engineer to join our team...
    `);
    console.log('✅ OpenAI integration successful:', jobDetails);

    // Test database operations
    const job = await Job.create({
      companyName: 'Test Company',
      jobRole: 'Test Role',
      jobLink: 'https://example.com',
    });
    console.log('✅ Database operations successful:', job);

    // Test email service
    const emailService = new EmailService();
    await emailService.verifyEmailAddress('test@example.com');
    console.log('✅ Email service initialized successfully');

    process.exit(0);
  } catch (error) {
    console.error('❌ Setup test failed:', error);
    process.exit(1);
  }
}

testSetup(); 