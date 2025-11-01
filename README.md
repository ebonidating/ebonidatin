# Eboni Dating

> A premium dating platform for the Black diaspora community

![Eboni Dating](./public/hero-banner.jpg)

## 🌟 Features

- **Smart Matching Algorithm** - Find compatible matches based on preferences and cultural values
- **Verified Profiles** - Secure environment with profile verification
- **Rich Messaging** - Text, voice, and video communication
- **Premium Tiers** - Flexible membership options (Basic, Premium, VIP)
- **PWA Support** - Install as mobile app for native-like experience
- **Real-time Analytics** - Performance monitoring with Web Vitals
- **Rate Limiting** - Built-in API protection
- **Security Headers** - Enterprise-grade security configuration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/ebonidatin.git
cd ebonidatin
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
- Supabase credentials
- Stripe keys
- Sentry DSN (optional)
- Other API keys

4. Run development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📦 Building

Build for production:
```bash
pnpm build
```

Start production server:
```bash
pnpm start
```

## 🧪 Testing

Run type checking:
```bash
pnpm type-check
```

Run linting:
```bash
pnpm lint
```

## 🚢 Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

### Environment Variables

Required environment variables in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## 📁 Project Structure

```
ebonidatin/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── discover/          # Match discovery
│   ├── messages/          # Messaging system
│   └── admin/             # Admin panel
├── components/            # React components
├── lib/                   # Utilities and helpers
├── public/                # Static assets
├── styles/                # Global styles
└── supabase/             # Database migrations
```

## 🔐 Security Features

- **Rate Limiting** - API and auth endpoint protection
- **Security Headers** - CSP, HSTS, X-Frame-Options
- **CORS Configuration** - Controlled cross-origin access
- **Environment Variables** - Secure credential management
- **Input Validation** - Zod schema validation

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Analytics**: Vercel Analytics + Speed Insights
- **Monitoring**: Sentry
- **Deployment**: Vercel

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Image Optimization**: Next/Image with WebP/AVIF
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Aggressive static asset caching
- **Web Vitals**: Real-time monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

© 2025 Eboni Dating. All rights reserved.

## 🆘 Support

For support, email support@ebonidating.com or join our community Discord.

## 🗺️ Roadmap

- [ ] Mobile Apps (iOS/Android)
- [ ] AI-powered matching
- [ ] Live video events
- [ ] Advanced filtering
- [ ] Community forums
- [ ] Verified celebrity profiles

---

Built with ❤️ for the Black community
