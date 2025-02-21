# cnct
A platform to automate job applications using AI for job detail extraction and email automation.


## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB (v6 or higher)
- Docker and Docker Compose (optional)

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS
- Vite
- React Router v6
- Axios

### Backend
- Node.js & Express
- TypeScript
- MongoDB with Mongoose
- OpenAI API
- Nodemailer
- Winston Logger

## Installation

1. Clone the repository
```bash
git clone https://github.com/atishaydikshit/cnct.git
cd cnct
```

2. Install dependencies (from root directory)
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development servers
```bash
# Start both frontend and backend
npm run dev

# Start individually
npm run dev:frontend
npm run dev:backend
```

## Development Workflow

1. Create a new branch for your feature
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit
```bash
git add .
git commit -m "feat: description of changes"
```

3. Push to your branch
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request on GitHub

## API Documentation

### Jobs
- POST /api/jobs - Create new job
- GET /api/jobs - List all jobs
- GET /api/jobs/:id - Get specific job

### Contacts
- POST /api/contacts - Create new contact
- GET /api/contacts - List all contacts
- GET /api/contacts/:id - Get specific contact

## Environment Variables

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Backend server port | 4000 |
| MONGODB_URI | MongoDB connection string | mongodb+srv://... |
| OPENAI_API_KEY | OpenAI API key | sk-... |
| SMTP_HOST | Email server host | smtp.gmail.com |
| SMTP_PORT | Email server port | 587 |
| SMTP_USER | Email username | user@gmail.com |
| SMTP_PASS | Email password/token | abcd efgh ijkl mnop |

## Testing

```bash
# Run all tests
npm test

# Test setup
npm run test:setup
```

## Deployment

The application can be deployed using Docker:

```bash
docker-compose up -d
```

## Contributing

1. Follow the branch naming convention:
   - Features: feature/feature-name
   - Fixes: fix/bug-name
   - Hotfixes: hotfix/issue-name

2. Commit message format:
   - feat: new feature
   - fix: bug fix
   - docs: documentation changes
   - style: formatting, missing semicolons, etc
   - refactor: code restructuring
   - test: adding tests
   - chore: maintenance

## License

Private repository - All rights reserved
```
