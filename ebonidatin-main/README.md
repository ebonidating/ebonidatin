# Eboni Dating - LGBTQ+ Dating Platform

A modern, inclusive dating platform built for the LGBTQ+ community with Next.js, Supabase, and Stripe.

## Features

- 🔐 **Secure Authentication** - Email/password authentication with Supabase
- 💬 **Real-time Messaging** - Connect with matches instantly
- 🎯 **Smart Matching** - Advanced algorithm for compatible connections
- 👥 **User Profiles** - Rich profiles with photos, bio, and preferences
- 💳 **Subscription Plans** - Multiple membership tiers with Stripe
- 🛡️ **Admin Dashboard** - Comprehensive admin panel for user management
- 📱 **Mobile Responsive** - Optimized for all devices
- 🔒 **Privacy First** - Row-level security and data protection

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account
- Stripe account (for payments)

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase and Stripe credentials

4. Run database migrations:
   - Execute SQL scripts in the `scripts` folder in order

5. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Configure custom domain: ebonidating.com
5. Deploy!

### Domain Configuration

- Primary domain: `ebonidating.com`
- Automatic redirect from `www.ebonidating.com` to `ebonidating.com`
- SSL/HTTPS enabled automatically by Vercel

## Admin Access

To create an admin user:

1. Sign up for a regular account
2. Insert a record in the `admin_users` table:
   \`\`\`sql
   INSERT INTO admin_users (user_id, email, role)
   VALUES ('your-user-id', 'admin@ebonidating.com', 'super_admin');
   \`\`\`
3. Access admin dashboard at `/admin`

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── discover/          # Browse profiles
│   ├── matches/           # View matches
│   ├── messages/          # Messaging system
│   └── profile/           # User profile
├── components/            # React components
├── lib/                   # Utility functions
│   └── supabase/         # Supabase client setup
├── scripts/              # Database migration scripts
└── public/               # Static assets
\`\`\`

## Security

- Row-level security (RLS) enabled on all tables
- Secure authentication with Supabase
- HTTPS enforced in production
- Security headers configured
- Rate limiting on API routes

## License

© 2025 Eboni Dating. All rights reserved.
