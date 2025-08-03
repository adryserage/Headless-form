# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Development
npm run dev                    # Start development server
npm run docker-dev            # Start with Docker (runs migrations first)

# Building and Testing
npm run build                 # Build for production
npm run lint                  # Run ESLint
npm test:unit                 # Run Vitest unit tests
npm test:unit -- --run       # Run tests once (no watch mode)

# Database Operations
npm run db:generate           # Generate Drizzle migrations
npm run db:migrate           # Run database migrations
tsx lib/db/migrate.ts        # Direct migration execution
```

## Architecture Overview

This is a **Next.js 14 form backend service** (Router.so) that provides headless form handling with the following core architecture:

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js with SMTP email provider
- **UI**: React + Tailwind CSS + Radix UI components
- **Testing**: Vitest with React Testing Library
- **Payments**: Stripe integration
- **Analytics**: PostHog integration

### Core Data Models

- **Users**: Authentication, subscription plans (free/lite/pro/business/enterprise)
- **Endpoints**: Form endpoints with custom validation schemas
- **Leads**: Form submission data linked to endpoints
- **Logs**: Activity logging (success/error) for webhooks, emails, forms

### Application Structure

```
app/                          # Next.js App Router pages
├── (auth)/                   # Auth group (login, check-email)
├── api/                      # API routes
│   ├── auth/[...nextauth]/   # NextAuth.js handler
│   ├── cron/                 # Cron job endpoints
│   ├── endpoints/[id]/       # Form endpoint handler
│   └── webhooks/stripe/      # Stripe webhook handler
├── endpoints/                # Endpoint management UI
├── leads/                    # Lead management UI
├── logs/                     # Activity logs UI
└── support/                  # Support pages

components/
├── groups/                   # Feature-specific components
│   ├── endpoints/            # Endpoint CRUD components
│   ├── leads/                # Lead management components
│   └── logs/                 # Log viewing components
├── parts/                    # Shared layout components
└── ui/                       # Radix UI component library

lib/
├── auth/                     # NextAuth.js configuration
├── data/                     # Data access layer
├── db/                       # Database schema and migrations
├── helpers/                  # Utility functions
└── validation/               # Form validation logic
```

### Key Features

- **Dynamic Form Validation**: Custom validation schemas per endpoint
- **Webhook Integration**: Optional webhook notifications for form submissions
- **Email Notifications**: SMTP integration for email alerts
- **Multi-format Export**: CSV export functionality
- **Usage Analytics**: Dashboard with charts and metrics
- **Subscription Management**: Stripe-based billing system

### Database Schema Key Points

- Uses Drizzle ORM with PostgreSQL
- CUID2 for short, readable IDs (8 characters)
- JSON schemas stored for flexible form validation
- Comprehensive logging system for debugging
- Soft foreign key relationships with cascade deletes

### Authentication Flow

- Email-based authentication via SMTP
- Optional GitHub OAuth provider
- JWT session strategy
- Middleware protection for authenticated routes

### Form Processing Pipeline

1. Form submission → `/api/endpoints/[id]`
2. Schema validation against endpoint configuration
3. Lead storage in database
4. Optional webhook notification
5. Optional email notification
6. Activity logging

### Testing

- Unit tests in `__tests__/` directory
- Vitest configuration with jsdom environment
- Focus on validation logic and form processing

### Environment Variables Required

- `DATABASE_URL`: Database connection
- `SMTP_HOST`: SMTP server hostname
- `SMTP_PORT`: SMTP server port
- `SMTP_USER`: SMTP authentication username
- `SMTP_PASS`: SMTP authentication password
- `SMTP_FROM`: Default sender email address
- `NEXTAUTH_SECRET`: Authentication secret
- `STRIPE_*`: Payment processing (optional)
- `GITHUB_*`: OAuth provider (optional)
