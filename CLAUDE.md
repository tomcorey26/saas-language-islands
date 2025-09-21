# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a language learning SaaS application built with Next.js 15, featuring spaced repetition flashcards organized into "islands" and "decks". Users can purchase tokens to generate AI-powered flashcards for various language learning scenarios.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk
- **Payments**: Stripe
- **AI**: OpenAI API
- **UI**: Shadcn/ui components with Tailwind CSS
- **Type Safety**: TypeScript with Zod schemas
- **Testing**: Playwright for E2E tests

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run test` / `npm run test:e2e` - Run Playwright E2E tests

### Database Commands

- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Apply migrations to local database
- `npm run db:migrate:prod` - Apply migrations to production
- `npm run db:push` - Push schema changes directly (dev)
- `npm run db:studio` - Open Drizzle Studio for local DB
- `npm run db:studio:prod` - Open Drizzle Studio for production DB

### Stripe Development

- `npm run stripe:webhook` - Listen for Stripe webhooks locally

## Architecture Overview

### Database Schema (Drizzle)
- **Users**: Clerk integration with token balance and Stripe customer ID
- **Decks**: Language-specific collections owned by users
- **Islands**: Thematic groups within decks (e.g., "Restaurant Conversations")
- **Cards**: Individual flashcards with spaced repetition metadata
- **Purchases**: Token purchase transactions via Stripe

### Directory Structure

- `/src/app/` - Next.js App Router pages and API routes
- `/src/components/` - Reusable UI components (Shadcn/ui)
- `/src/drizzle/` - Database schema and table definitions
- `/src/server/` - Server-side actions, database queries, and API client
- `/src/zod/` - Type-safe schemas organized as:
  - `contracts/` - API request/response schemas
  - `models/` - Database model schemas
- `/src/data/` - Static configuration (languages, payment tiers, env validation)
- `/src/lib/` - Utility functions (spaced repetition, formatters, etc.)

### Key Patterns

- **Authentication**: Clerk middleware protects non-public routes
- **Type Safety**: Zod schemas for all API contracts and database models
- **Database**: Drizzle ORM with PostgreSQL, strict migrations
- **Payments**: Stripe integration with webhook handling for token purchases
- **AI Integration**: OpenAI API for generating contextual flashcards
- **State Management**: Server actions with form validation

### Environment Configuration

Uses `@t3-oss/env-nextjs` for type-safe environment variables. Server-side env vars include database, OpenAI, Clerk, reCAPTCHA, and Stripe configurations.

### Testing Strategy

Stripe webhook testing requires running `npm run stripe:webhook` and using test card `4242424242424242` for purchases.

## Zod Schema Organization

- `/contracts` - Server API schemas for request/response validation
- `/models` - Database table schemas that mirror Drizzle definitions

## Payment System

Three-tier token-based system: Starter, Pro, and Premium plans with different token allocations for AI-generated content.
- to test app, do not run npm run build just run linter and typescript check
- only run type checking and linting after a really big change