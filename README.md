# Islands of Language

A modern language learning SaaS application that uses AI-powered spaced repetition flashcards to help users master new languages. Cards are organized into thematic "islands" within language-specific "decks" for a structured learning experience.

## Features

- **AI-Powered Flashcard Generation**: Create contextual flashcards using OpenAI for real-world language scenarios
- **Spaced Repetition System**: Smart review scheduling based on your performance
- **Token-Based Pricing**: Flexible payment tiers (Starter, Pro, Premium) for generating content
- **Multi-Language Support**: Learn multiple languages with dedicated decks
- **Thematic Organization**: Group cards into islands (e.g., "Restaurant Conversations", "Travel Phrases")
- **Secure Authentication**: Powered by Clerk for seamless user management
- **Stripe Integration**: Secure token purchases with webhook support

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk
- **Payments**: Stripe
- **AI**: OpenAI API
- **UI**: Shadcn/ui components with Tailwind CSS
- **Validation**: Zod schemas
- **Testing**: Playwright (E2E)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Clerk account (for authentication)
- Stripe account (for payments)
- OpenAI API key

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd islands-of-language
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in required values (database, Clerk, Stripe, OpenAI)

4. Set up the database:

```bash
npm run db:generate  # Generate migrations
npm run db:migrate   # Apply migrations
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Commands

### Core Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run test` / `npm run test:e2e` - Run Playwright E2E tests

### Database Commands

- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Apply migrations to local database
- `npm run db:migrate:prod` - Apply migrations to production
- `npm run db:push` - Push schema changes directly (development only)
- `npm run db:studio` - Open Drizzle Studio for local DB
- `npm run db:studio:prod` - Open Drizzle Studio for production DB

### Stripe Development

- `npm run stripe:webhook` - Listen for Stripe webhooks locally

## Project Structure

```
src/
├── app/              # Next.js App Router pages and API routes
├── components/       # Reusable UI components (Shadcn/ui)
├── drizzle/         # Database schema and table definitions
├── server/          # Server-side actions, database queries, API clients
├── zod/             # Type-safe schemas
│   ├── client/      # Client-specific schemas
│   ├── contracts/   # API request/response schemas
│   └── models/      # Database model schemas (1:1 with DB)
├── data/            # Static configuration (languages, payment tiers)
└── lib/             # Utility functions (spaced repetition, formatters)
```

## Database Schema

- **Users**: Clerk integration with token balance and Stripe customer ID
- **Decks**: Language-specific collections owned by users
- **Islands**: Thematic groups within decks (e.g., "Restaurant Conversations")
- **Cards**: Individual flashcards with spaced repetition metadata
- **Purchases**: Token purchase transaction history

## Testing Stripe Webhooks Locally

1. Start the webhook listener:

```bash
npm run stripe:webhook
```

2. Copy the webhook signing secret to your `.env.local` file

3. Restart the development server

4. Make a test purchase using Stripe test card: `4242 4242 4242 4242`

## Migration Guide

1. Generate migration: `npm run db:generate`
2. Review the generated SQL in `drizzle/` directory
3. Apply migration: `npm run db:migrate` (local) or `npm run db:migrate:prod` (production)
4. If enum values changed, manually update existing data as needed

## Environment Variables

This project uses `@t3-oss/env-nextjs` for type-safe environment configuration. Required variables include:

- Database: `DATABASE_URL`
- Clerk: `NEXT_PUBLIC_CLERK_*` keys
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- OpenAI: `OPENAI_API_KEY`
- reCAPTCHA: `RECAPTCHA_SECRET_KEY`

See `.env.example` for the complete list.

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables
4. Run production migrations: `npm run db:migrate:prod`
5. Deploy!

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Links

- [Shadcn/ui Documentation](https://shadcdn.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Clerk Documentation](https://clerk.com/docs)

The setup for google oauth is at the google api developer console
