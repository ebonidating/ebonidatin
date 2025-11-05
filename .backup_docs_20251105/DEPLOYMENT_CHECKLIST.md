# 🚀 Production Deployment Checklist

## Pre-Deployment Setup

### ✅ 1. Environment Variables Configuration

#### In Vercel Dashboard:
1. Navigate to: `Project Settings → Environment Variables`
2. Set environment to: **Production**
3. Add all variables from `.env.local`

**Critical Variables to Verify:**
```bash
# Application URLs - MUST BE PRODUCTION DOMAIN
NEXT_PUBLIC_APP_URL=https://ebonidating.com
NEXT_PUBLIC_URL=https://ebonidating.com
NODE_ENV=production
```

---

### ✅ 2. Supabase Configuration

#### A. Update Authentication URLs:
1. Go to: `Supabase Dashboard → Authentication → URL Configuration`
2. Set **Site URL**: `https://ebonidating.com`
3. Add **Redirect URLs**:
   ```
   https://ebonidating.com/auth/callback
   https://ebonidating.com/api/auth/callback
   https://www.ebonidating.com/auth/callback
   https://www.ebonidating.com/api/auth/callback
   ```

#### B. Update Email Templates:
1. Navigate to: `Authentication → Email Templates`
2. For each template (Confirm signup, Invite user, Magic Link, etc.):
   - Replace `{{ .ConfirmationURL }}` redirect with: `https://ebonidating.com/auth/callback`
   - Verify sender email is configured
   - Test email delivery

#### C. Google OAuth Setup:
1. In Supabase: `Authentication → Providers → Google`
2. Enable Google provider
3. Copy the **Callback URL**: `https://[your-ref].supabase.co/auth/v1/callback`
4. Add to Google Cloud Console:
   - Go to: [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to: `APIs & Services → Credentials`
   - Edit OAuth 2.0 Client
   - Add **Authorized redirect URIs**:
     ```
     https://[your-ref].supabase.co/auth/v1/callback
     ```
5. Copy Client ID and Secret back to Supabase

---

### ✅ 3. Stripe Configuration

#### A. Switch to Live Mode:
1. In Stripe Dashboard, toggle from **Test** to **Live**
2. Get live keys: `Developers → API keys`
3. Update in Vercel:
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   ```

#### B. Configure Webhooks:
1. Go to: `Developers → Webhooks`
2. Add endpoint: `https://ebonidating.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy signing secret:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

#### C. Update Product URLs:
1. For each product/price, update success URLs to:
   ```
   https://ebonidating.com/dashboard/subscription?success=true
   ```
2. Update cancel URLs to:
   ```
   https://ebonidating.com/pricing
   ```

---

### ✅ 4. Email Service (Resend)

#### Domain Verification:
1. Go to: [Resend Dashboard](https://resend.com/domains)
2. Add domain: `ebonidating.com`
3. Add DNS records to your domain provider:
   ```
   Type: TXT
   Name: _resend
   Value: [provided by Resend]
   
   Type: MX
   Name: ebonidating.com
   Value: [provided by Resend]
   ```
4. Wait for verification (up to 48 hours)
5. Set **From Email**:
   ```bash
   RESEND_FROM_EMAIL=noreply@ebonidating.com
   ```

---

### ✅ 5. Security Configuration

#### A. Cloudflare Turnstile:
1. Create widget at: [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Add domain: `ebonidating.com`
3. Update keys in Vercel:
   ```bash
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
   TURNSTILE_SECRET_KEY=...
   ```

#### B. Generate Secure Keys:
```bash
# SESSION_SECRET
openssl rand -base64 32

# ENCRYPTION_KEY
openssl rand -hex 32
```

Add to Vercel environment variables.

---

### ✅ 6. Domain & SSL

#### Vercel Domain Setup:
1. Go to: `Project Settings → Domains`
2. Add domains:
   - `ebonidating.com`
   - `www.ebonidating.com`
3. Update DNS records at your domain provider:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Wait for SSL certificate (automatic)

---

## Deployment Steps

### 📦 1. Build Verification (Local)
```bash
# Install dependencies
pnpm install

# Run build locally
pnpm build

# Check for errors
# Fix any TypeScript or build errors
```

### 🔄 2. Deploy to Vercel
```bash
# Option A: Git Push (Recommended)
git add .
git commit -m "Production deployment"
git push origin main

# Option B: Vercel CLI
vercel --prod
```

### ⏳ 3. Monitor Deployment
1. Watch build logs in Vercel Dashboard
2. Wait for "Deployment Ready" status
3. Note the deployment URL

---

## Post-Deployment Testing

### 🧪 Test Checklist

#### A. Authentication Flow:
- [ ] Navigate to: `https://ebonidating.com/auth/sign-up`
- [ ] Fill out signup form
- [ ] Submit and verify "Check Your Email" message
- [ ] Check email inbox (and spam)
- [ ] Click verification link
- [ ] Verify redirect to `/dashboard` or `/onboarding`
- [ ] Sign out
- [ ] Navigate to: `https://ebonidating.com/auth/login`
- [ ] Sign in with credentials
- [ ] Verify successful login

#### B. Google OAuth:
- [ ] Navigate to: `https://ebonidating.com/auth/login`
- [ ] Click "Sign in with Google"
- [ ] Complete Google authentication
- [ ] Verify redirect to dashboard
- [ ] Check profile creation in Supabase
- [ ] Sign out
- [ ] Test Google signup from `/auth/sign-up`

#### C. Email Verification:
- [ ] Create test account
- [ ] Check email delivery time (should be < 1 minute)
- [ ] Verify email formatting and branding
- [ ] Test verification link
- [ ] Verify "email_verified" flag in database

#### D. Payment Flow:
- [ ] Navigate to: `https://ebonidating.com/pricing`
- [ ] Click "Subscribe" for Premium tier
- [ ] Complete Stripe checkout (use test card: 4242 4242 4242 4242)
- [ ] Verify redirect back to app
- [ ] Check subscription status in dashboard
- [ ] Verify webhook received in Stripe Dashboard
- [ ] Check database subscription_tier update

#### E. Security Features:
- [ ] Verify Turnstile widget loads on login/signup
- [ ] Test rate limiting (multiple failed logins)
- [ ] Check HTTPS redirect (try http://)
- [ ] Verify security headers (use securityheaders.com)

---

## Monitoring Setup

### 📊 1. Sentry (Error Tracking)
```bash
# If not already configured
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=...
```

Test error tracking:
- [ ] Trigger a test error
- [ ] Verify it appears in Sentry dashboard
- [ ] Set up alert notifications

### 📈 2. Analytics
```bash
NEXT_PUBLIC_GA_ID=G-...
```

Verify:
- [ ] Check Google Analytics real-time
- [ ] Track page views
- [ ] Verify event tracking

### 🔍 3. Vercel Monitoring
- [ ] Enable Web Vitals
- [ ] Set up custom monitoring rules
- [ ] Configure deployment notifications

---

## Database Verification

### 🗄️ Supabase Checks:

#### A. Row Level Security (RLS):
```sql
-- Verify RLS is enabled on all tables
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

#### B. Test Policies:
- [ ] Users can only read their own profile
- [ ] Users can only update their own data
- [ ] Admin users have appropriate access
- [ ] Public tables are readable

#### C. Indexes:
```sql
-- Verify indexes exist for performance
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public';
```

---

## Performance Optimization

### ⚡ 1. Vercel Configuration
- [ ] Enable Edge Functions where applicable
- [ ] Configure caching headers (already in next.config.mjs)
- [ ] Enable Image Optimization
- [ ] Set up ISR (Incremental Static Regeneration) for static pages

### 🖼️ 2. Image Optimization
- [ ] Verify Vercel Blob storage working
- [ ] Test image upload
- [ ] Check image optimization settings
- [ ] Configure cloudinary if using

### 💾 3. Database Optimization
- [ ] Run `EXPLAIN ANALYZE` on slow queries
- [ ] Add indexes where needed
- [ ] Enable connection pooling (Supabase Pooler)

---

## Backup & Recovery

### 💾 Backup Strategy:

#### A. Database:
- [ ] Enable automated Supabase backups
- [ ] Download manual backup
- [ ] Store in secure location
- [ ] Document restore procedure

#### B. Environment Variables:
- [ ] Export all Vercel env vars
- [ ] Store in password manager (1Password, LastPass)
- [ ] Document key rotation schedule

#### C. Code:
- [ ] Ensure git repository is backed up
- [ ] Tag release version: `git tag v1.0.0-prod`
- [ ] Push tags: `git push --tags`

---

## Final Verification

### ✅ Production Readiness:
- [ ] All environment variables set in Vercel
- [ ] All redirect URLs updated to production
- [ ] Email delivery working
- [ ] Google OAuth working
- [ ] Payment processing working
- [ ] SSL certificate active
- [ ] Domain resolving correctly
- [ ] Error tracking configured
- [ ] Analytics tracking working
- [ ] Database backups enabled
- [ ] Rate limiting active
- [ ] Security headers configured
- [ ] Performance monitoring active

---

## Emergency Contacts

**Critical Issues:**
- Vercel Support: https://vercel.com/support
- Supabase Support: support@supabase.io
- Stripe Support: https://support.stripe.com

**Documentation:**
- See: `PRODUCTION_KEYS_SETUP.md` for detailed key setup
- See: `README.md` for development information

---

## Rollback Procedure

If issues occur:

1. **Immediate Rollback:**
   ```bash
   # In Vercel Dashboard
   # Go to Deployments → Click previous working deployment → "Promote to Production"
   ```

2. **Revert Code:**
   ```bash
   git revert HEAD
   git push origin main
   ```

3. **Check Logs:**
   - Vercel Function Logs
   - Supabase Logs
   - Sentry Errors

4. **Notify Users:**
   - Post status update
   - Send email if needed

---

## Post-Launch Monitoring (First 24 Hours)

### 🔍 Watch For:
- [ ] Spike in error rates
- [ ] Failed authentication attempts
- [ ] Payment processing failures
- [ ] Email delivery issues
- [ ] Performance degradation
- [ ] Increased response times
- [ ] Database connection issues

### 📊 Key Metrics:
- Response time < 200ms
- Error rate < 0.1%
- Email delivery > 99%
- OAuth success rate > 95%
- Payment success rate > 98%

---

**Deployment Date:** _________________

**Deployed By:** _________________

**Version:** v1.0.0

**Status:** ✅ Production Ready
