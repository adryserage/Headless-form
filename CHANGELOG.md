# Changelog

All notable changes to the Headless Form project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2025-08-03

### ✨ Added

- **Enhanced HTML Form Generation** - Comprehensive field type support (849db31)
  - Created `generateHtmlForm` function handling all 16 field types
  - Proper HTML5 input types (email, tel, url, date, color, range)
  - Full support for multiselect, radio buttons, and checkboxes
  - Field attributes including required, placeholder, min/max, accept, multiple
  - Improved documentation accuracy for form implementation

### 🐛 Fixed

- **Authentication System** - Resolved OAuthAccountNotLinked error and enhanced security (e7113b7)
  - Fixed GitHub OAuth account linking by switching to database sessions
  - Enabled `allowDangerousEmailAccountLinking` for proper account integration
  - Updated middleware to use `auth()` instead of JWT tokens for session validation
  - Enhanced security by protecting ALL pages (removed home page bypass)
  - Added proper redirect callback for post-login navigation

- **Form Validation Logic** - Corrected optional field handling (1b57a3c)
  - Fixed validation schemas that incorrectly made all fields required
  - Updated `generateDynamicSchema` to respect required field setting
  - Optional fields now properly work as optional during form submission
  - Removed hardcoded `.min(1)` validations for conditional application

- **TypeScript Compatibility** - Resolved compilation errors (34b147d)
  - Fixed form generation function type definitions
  - Corrected middleware JWT token validation types
  - Added proper TypeScript casting for Zod validation schemas
  - Ensured NextAuth.js integration works with latest type definitions

- **Edge Runtime Compatibility** - Complete resolution of Node.js module errors (f85fbb9, 60b91a4, 8cc8d9b, 6d0cc49)
  - Replaced Node.js crypto with Web Crypto API for universal compatibility
  - Added Node.js runtime configuration to all API routes
  - Fixed middleware authentication by removing NextAuth import dependencies
  - Implemented JWT token validation for Edge Runtime compatibility
  - Comprehensive webpack configuration for module fallbacks

- **Authentication System** - Multiple stability improvements (4fc7113)
  - Resolved 307 redirect issues in authentication flow
  - Fixed JWT token handling and session management
  - Improved middleware authentication checks

### 🔧 Changed

- **ESLint Configuration** - Migrated to modern flat config system (177411a, b5a0fa9)
  - Updated from deprecated `.eslintrc.json` to `eslint.config.js`
  - Added `@eslint/eslintrc` package for compatibility
  - Compatible with ESLint v9.32.0 and NextAuth.js v5.0.0-beta.20
  - Resolved merge conflicts and maintained documentation

### 🔒 Security

- **Complete Authentication Protection** - Enhanced application security (e7113b7)
  - All application routes now require authentication (no unauthenticated access)
  - Implemented proper GitHub OAuth integration with account linking
  - Switched to database sessions for improved security and functionality
  - Enhanced middleware protection covering all pages except auth endpoints

### 🏠 Internal

- **Build System** - Webpack and Stripe configuration improvements (17da6ca)
  - Fixed build errors and configuration issues
  - Enhanced Next.js configuration for server actions
  - Added server component external packages configuration

## [1.0.0] - 2025-08-02

### ✨ Added

- **Extended Form Schema Types** - Implemented 8 new advanced field types:
  - `select` - Dropdown selections with custom options
  - `multiselect` - Multiple selection dropdowns
  - `radio` - Radio button groups with custom options
  - `checkbox` - Multiple checkbox selections
  - `textarea` - Large text input areas
  - `file` - File upload with type restrictions and multiple file support
  - `range` - Slider inputs with min/max/step configuration
  - `color` - Color picker inputs
- **Dynamic Field Configuration** - Enhanced field options including:
  - Custom placeholder text
  - Option arrays for choice fields
  - Min/max/step values for numeric inputs
  - File type restrictions and multiple file support
- **SMTP Email System** - Complete email infrastructure overhaul:
  - Configurable SMTP server support
  - Custom authentication settings
  - Debug logging for development
  - Migration from Resend to flexible SMTP providers

### 🔧 Changed

- **Form Generation** - Enhanced automatic form generation with new field types
- **Schema Validation** - Updated Zod schemas to support extended field configurations
- **Database Schema** - Enhanced to store complex field configuration data
- **UI Components** - Improved form creation interface with dynamic field options

### 🐛 Fixed

- **NextAuth Configuration** - Resolved email provider setup issues
- **Edge Runtime Compatibility** - Fixed middleware compatibility with Next.js Edge Runtime
- **JWT Token Handling** - Improved authentication token management
- **Email Delivery** - Resolved SMTP email sending functionality

### 🏠 Internal

- **Type Safety** - Enhanced TypeScript definitions for new schema types
- **Error Handling** - Improved error parsing and user feedback
- **Code Formatting** - Applied consistent formatting across codebase

## [Previous Releases] - 2024-2025

### 🎉 Major Features Implemented

#### User Management & Authentication

- **GitHub OAuth Integration** (07c04b3) - Social login with GitHub
- **Magic Link Authentication** - Email-based passwordless login
- **User Session Management** - Secure JWT-based sessions

#### Subscription & Billing System

- **Stripe Integration** (16f83d5, f23df48) - Complete payment processing
- **User Subscription Plans** (200ebda) - Tiered pricing with usage limits
- **Usage Throttling** (a1b6505) - Plan-based feature restrictions
- **Webhook Processing** - Automated billing event handling
- **Monthly Usage Reset** (4c8e2fe) - Automated CRON job for usage limits

#### Analytics & Monitoring

- **PostHog Integration** (60b6e9c) - User behavior tracking
- **Usage Analytics** - Form submission and endpoint usage tracking
- **Performance Monitoring** - System health and performance metrics

#### Form Management

- **Dynamic Form Generation** - Automatic form creation from schemas
- **Endpoint Management** - RESTful API endpoint creation and management
- **Lead Collection** - Form submission data capture and storage
- **CSV Export** - Data export functionality for collected leads

#### Developer Experience

- **Type Safety** - Full TypeScript implementation
- **Error Handling** - Comprehensive error management
- **Validation** - Robust client and server-side validation
- **Documentation** - Comprehensive API and usage documentation

### 🔧 Maintenance & Updates

#### Package Management

- Regular dependency updates (3ea83c0, 76dea9a, 87581ca, 2ec3d63)
- Security vulnerability patches (315b3a3)
- ESLint configuration improvements (b8ed30f)
- Build system optimizations

#### Bug Fixes

- Stripe pricing configuration fixes (96ed4e6)
- Documentation link corrections (630a93d)
- Logic operator improvements (fef0e69)
- Type declaration enhancements (a192a7b)
- Breadcrumb navigation fixes (26b7adf)

## 📊 Project Statistics

- **Total Commits**: 292+
- **Active Contributors**: 10+
- **Languages**: TypeScript, JavaScript, SQL
- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS with shadcn/ui components

## 🏗️ Architecture

### Core Technologies

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js v5 with SMTP/OAuth
- **Payments**: Stripe with webhooks
- **Email**: Configurable SMTP providers
- **Analytics**: PostHog
- **Styling**: Tailwind CSS + shadcn/ui
- **Validation**: Zod schemas
- **Deployment**: Vercel with CRON jobs

### Key Features

- 🔐 **Secure Authentication** - Multiple auth providers
- 📝 **Dynamic Forms** - 16+ field types with advanced configuration
- 💳 **Subscription Billing** - Automated payment processing
- 📊 **Analytics** - Comprehensive usage tracking
- 🎨 **Modern UI** - Responsive design with dark mode
- 🔌 **API Integration** - RESTful endpoints and webhooks
- 📧 **Email System** - Flexible SMTP configuration
- 🚀 **Performance** - Optimized for speed and scalability

---

## Contributing

This project follows conventional commit standards. When contributing:

1. Use conventional commit format: `type(scope): description`
2. Update this changelog for significant changes
3. Ensure all tests pass and code is properly formatted
4. Follow the established code style and architecture patterns

## Links

- [Repository](https://github.com/routerso/headless-form)
- [Documentation](https://docs.headlessform.com)
- [Issues](https://github.com/routerso/headless-form/issues)
- [Releases](https://github.com/routerso/headless-form/releases)

---

_Last updated: January 3, 2025_
