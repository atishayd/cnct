# Contact Management System

A system for managing contacts with automated email pattern generation and verification.

## Features
- Contact management with CRUD operations
- Email pattern generation using OpenAI
- Email verification using DNS and SMTP checks
- Gmail integration

## Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and update variables
4. Run development server: `npm run dev`

## Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `OPENAI_API_KEY`: OpenAI API key
- `GMAIL_CLIENT_ID`: Google OAuth client ID
- `GMAIL_CLIENT_SECRET`: Google OAuth client secret
- `GMAIL_REDIRECT_URI`: OAuth redirect URI
- `GMAIL_REFRESH_TOKEN`: Gmail refresh token

## API Routes
- `POST /api/contacts`: Create new contact
- `GET /api/contacts`: List all contacts
- `GET /api/contacts/:id`: Get contact by ID
- `PUT /api/contacts/:id`: Update contact
- `DELETE /api/contacts/:id`: Delete contact

## Development
- Backend: Node.js + Express
- Database: MongoDB
- Email: Gmail API
- AI: OpenAI API

## License

Private repository - All rights reserved
```
