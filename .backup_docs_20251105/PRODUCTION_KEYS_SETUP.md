# Production Keys & Configuration Setup Guide

## 🔴 CRITICAL - Required for Core Functionality

### 1. Supabase (Database & Authentication)
**Priority: CRITICAL**

#### Setup Steps:
1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project or select existing
3. Navigate to Settings → API
4. Copy the following keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
```

#### Authentication Configuration:
1. Go to Authentication → URL Configuration
2. Set **Site URL**: `https://ebonidating.com`
3. Add **Redirect URLs**:
   - `https://ebonidating.com/auth/callback`
   - `https://ebonidating.com/api/auth/callback`
   - `https://www.ebonidating.com/auth/callback`
   - `https://www.ebonidating.com/api/auth/callback`

#### Google OAuth Setup:
1. Go to Authentication → Providers → Google
2. Enable Google provider
3. Add **Authorized redirect URIs** in Google Cloud Console:
   - `https://[your-project-ref].supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase

#### Email Templates:
1. Go to Authentication → Email Templates
2. Update **Confirm signup** template redirect URL to: `https://ebonidating.com/auth/callback`
3. Update **Magic Link** template redirect URL to: `https://ebonidating.com/auth/callback`

---

### 2. Stripe (Payment Processing)
**Priority: CRITICAL**

#### Setup Steps:
1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Navigate to Developers → API keys
3. Copy production keys:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[your-key]
STRIPE_SECRET_KEY=sk_live_[your-key]
```

#### Webhook Configuration:
1. Go to Developers → Webhooks
2. Add endpoint: `https://ebonidating.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook signing secret:

```bash
STRIPE_WEBHOOK_SECRET=whsec_[your-secret]
```

#### Product & Price IDs:
1. Go to Products → Create products for each tier
2. Copy Price IDs:

```bash
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_[premium-id]
NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID=price_[elite-id]
```

---

### 3. Vercel Blob Storage
**Priority: CRITICAL**

#### Setup Steps:
1. Go to Vercel Dashboard → Storage → Blob
2. Create new blob store or select existing
3. Copy token:

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_[your-token]
```

---

### 4. Email Service - Resend
**Priority: CRITICAL**

#### Setup Steps:
1. Go to [https://resend.com](https://resend.com)
2. Navigate to API Keys
3. Create new API key with full access
4. Verify your domain:

```bash
RESEND_API_KEY=re_[your-key]
RESEND_FROM_EMAIL=noreply@ebonidating.com
```

#### Domain Verification:
1. Add DNS records provided by Resend
2. Verify domain ownership
3. Wait for DNS propagation (up to 48 hours)

---

## 🟠 HIGH PRIORITY - Important Features

### 5. Twilio (SMS/Phone Verification)
**Priority: HIGH**

#### Setup Steps:
1. Go to [https://www.twilio.com](https://www.twilio.com)
2. Navigate to Console Dashboard
3. Copy credentials:

```bash
TWILIO_ACCOUNT_SID=AC[your-sid]
TWILIO_AUTH_TOKEN=[your-auth-token]
TWILIO_PHONE_NUMBER=+1234567890
```

#### Phone Number Setup:
1. Purchase a phone number with SMS capability
2. Configure messaging webhook (optional)

---

### 6. Cloudflare Turnstile (Security)
**Priority: HIGH**

#### Setup Steps:
1. Go to [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. Navigate to Turnstile
3. Create new site widget
4. Add domain: `ebonidating.com`

```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=[your-site-key]
TURNSTILE_SECRET_KEY=[your-secret-key]
```

---

### 7. Upstash Redis (Rate Limiting)
**Priority: HIGH**

#### Setup Steps:
1. Go to [https://console.upstash.com](https://console.upstash.com)
2. Create new Redis database (select region closest to your users)
3. Copy REST API credentials:

```bash
UPSTASH_REDIS_REST_URL=https://[your-db].upstash.io
UPSTASH_REDIS_REST_TOKEN=[your-token]
```

---

### 8. Web Push Notifications (VAPID)
**Priority: HIGH**

#### Generate VAPID Keys:
```bash
npx web-push generate-vapid-keys
```

Copy output:
```bash
NEXT_PUBLIC_VAPID_PUBLIC_KEY=[your-public-key]
VAPID_PRIVATE_KEY=[your-private-key]
VAPID_EMAIL=mailto:admin@ebonidating.com
```

---

## 🟡 MEDIUM PRIORITY - Enhanced Features

### 9. Cloudinary (Image Processing)
**Priority: MEDIUM**

#### Setup Steps:
1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Navigate to Dashboard
3. Copy credentials:

```bash
CLOUDINARY_CLOUD_NAME=[your-cloud-name]
CLOUDINARY_API_KEY=[your-api-key]
CLOUDINARY_API_SECRET=[your-api-secret]
```

---

### 10. Google Maps API
**Priority: MEDIUM**

#### Setup Steps:
1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Enable Google Maps JavaScript API and Places API
3. Create API key
4. Restrict key to your domain:

```bash
GOOGLE_MAPS_API_KEY=AIzaSy[your-key]
```

---

## 📊 MONITORING & ANALYTICS

### 11. Sentry (Error Tracking)
**Priority: RECOMMENDED**

#### Setup Steps:
1. Go to [https://sentry.io](https://sentry.io)
2. Create new Next.js project
3. Copy DSN and auth token:

```bash
NEXT_PUBLIC_SENTRY_DSN=https://[your-dsn]@sentry.io/[project-id]
SENTRY_AUTH_TOKEN=[your-auth-token]
SENTRY_ORG=[your-org]
SENTRY_PROJECT=[your-project]
```

---

### 12. Google Analytics
**Priority: RECOMMENDED**

#### Setup Steps:
1. Go to [https://analytics.google.com](https://analytics.google.com)
2. Create new GA4 property
3. Copy Measurement ID:

```bash
NEXT_PUBLIC_GA_ID=G-[your-id]
```

---

## ⚙️ APPLICATION SETTINGS

### 13. Environment Variables
**Priority: CRITICAL**

```bash
# Environment
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://ebonidating.com
NEXT_PUBLIC_URL=https://ebonidating.com
VERCEL_ENV=production

# Security (Generate random 32+ character strings)
SESSION_SECRET=[generate-random-32-chars]
ENCRYPTION_KEY=[generate-random-32-chars]
```

#### Generate Secure Keys:
```bash
# For SESSION_SECRET
openssl rand -base64 32

# For ENCRYPTION_KEY
openssl rand -hex 32
```

---

## 🚀 Deployment Checklist

### Before Going Live:

- [ ] All CRITICAL keys configured
- [ ] Supabase redirect URLs updated to production domain
- [ ] Google OAuth redirect URIs configured
- [ ] Stripe webhooks pointing to production
- [ ] Email domain verified and DNS configured
- [ ] SSL certificate active (handled by Vercel)
- [ ] Test email verification flow
- [ ] Test Google OAuth flow
- [ ] Test Stripe payment flow
- [ ] Rate limiting configured
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] Performance monitoring active

### Environment Variables Setup in Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all variables from `.env.local` to production environment
3. Ensure `NEXT_PUBLIC_*` variables are visible to the browser
4. Click "Save" and redeploy

### Post-Deployment Testing:

1. **Authentication Flow:**
   - Sign up with email
   - Verify email
   - Sign in
   - Google OAuth
   - Sign out

2. **Payment Flow:**
   - Subscribe to Premium
   - Subscribe to Elite
   - Check subscription status

3. **Security:**
   - Test rate limiting
   - Verify Turnstile widget
   - Check HTTPS redirects

4. **Monitoring:**
   - Check Sentry for errors
   - Verify Analytics tracking
   - Monitor API performance

---

## 📝 Important Notes

### Security Best Practices:
- Never commit `.env.local` to git
- Rotate keys regularly (every 90 days)
- Use different keys for staging and production
- Monitor failed authentication attempts
- Set up alerts for unusual activity

### Domain Configuration:
- Ensure `ebonidating.com` and `www.ebonidating.com` both work
- Set up automatic HTTPS redirect
- Configure HSTS headers (already in next.config.mjs)

### Backup & Recovery:
- Export Supabase database regularly
- Keep backup of all API keys in secure password manager
- Document any custom configurations

---

## 🆘 Troubleshooting

### Common Issues:

1. **Email verification not working:**
   - Check Supabase email templates
   - Verify domain DNS records
   - Check spam folder

2. **Google OAuth failing:**
   - Verify redirect URIs match exactly
   - Check Google Cloud Console quotas
   - Ensure OAuth consent screen is published

3. **Stripe webhooks not receiving:**
   - Verify webhook URL is accessible
   - Check webhook signing secret
   - Review Stripe webhook logs

4. **Rate limiting not working:**
   - Confirm Upstash Redis connection
   - Check Redis REST API credentials
   - Verify IP detection in middleware

---

## 📧 Support

For issues or questions:
- Email: admin@ebonidating.com
- Documentation: [Vercel Docs](https://vercel.com/docs)
- Supabase Docs: [https://supabase.com/docs](https://supabase.com/docs)
