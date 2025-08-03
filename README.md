# Headless Form Backend

## Description

This is a simple router for forms. [Watch a Demo](https://x.com/youngbloodcyb/status/1831808232966516972)

## Self-Hosting router

## Prerequisites

Before starting, ensure you have the following:

- An SMTP email service (Gmail, Outlook, Mailgun, etc.)
- An account with [Vercel](https://vercel.com/)
- A PostgreSQL database (we recommend [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres))

## Environment Variables

After creating your accounts, update your `.env.example` to be `.env.local` for running the application locally. Then, update the keys for each value.

## Step-by-Step Instructions

1. **Clone the Repository**

   ```sh
   git clone https://github.com/routerso/router.git
   cd router/main
   ```

### Without Docker

2. **Install Dependencies**

   ```sh
   npm install
   ```

3. **Set Up Environment Variables**

   Ensure your `.env` file is correctly configured as mentioned above.

4. **Generate the Database Migrations**

   ```sh
   npm drizzle-kit generate
   ```

5. **Run the Database Migrations**

   ```sh
   npm tsx lib/db/migrate.ts
   ```

6. **Start the Development Server**

   ```sh
   npm run dev
   ```

### With docker

2. **Set Up Environment Variables**

   Ensure your `.env` file is correctly configured as mentioned above.

3. \*\*Run Docker Command
   ```sh
   docker compose up
   ```

## Deploying to Vercel

- Push your code to a GitHub repository.
- Connect your repository to Vercel.
- Set the environment variables in Vercel's dashboard under "Settings > Environment Variables".

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Nodemailer Documentation](https://nodemailer.com/about/)

## Recent Updates

### ESLint and TypeScript Configuration (January 2025)

- **Updated ESLint Configuration**: Migrated from deprecated `.eslintrc.json` to modern flat config (`eslint.config.js`) compatible with ESLint v9
- **Fixed NextAuth.js v5 Compatibility**: Updated middleware to use the modern `auth()` function instead of deprecated `getToken()` from `next-auth/jwt`
- **Resolved TypeScript Errors**: Fixed missing `salt` property issues in authentication middleware
- **Build Optimization**: All linting and type checking now passes successfully

These updates ensure compatibility with the latest versions of ESLint (v9.32.0) and NextAuth.js (v5.0.0-beta.20).

For any issues or questions, please open an issue on the [GitHub repository](https://github.com/routerso/router).
