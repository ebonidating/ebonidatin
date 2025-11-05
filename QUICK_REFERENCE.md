# 🔑 Quick Reference - Production Keys

## Critical Keys (Required Immediately)

### 1. Supabase
```bash
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```
**Where:** Supabase Dashboard → Settings → API

**Critical Setup:**
- Site URL: `https://ebonidating.com`
- Redirect URLs: 
  - `https://ebonidating.com/auth/callback`
  - `https://ebonidating.com/api/auth/callback`

---

### 2. Production URLs
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://ebonidating.com
NEXT_PUBLIC_URL=https://ebonidating.com
```

---

### 3. Stripe
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID=price_...
```
**Where:** Stripe Dashboard → Developers → API keys

**Webhook:** `https://ebonidating.com/api/webhooks/stripe`

---

### 4. Resend (Email)
```bash
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@ebonidating.com
```
**Where:** Resend Dashboard → API Keys

**Must:** Verify domain DNS records

---

### 5. Vercel Blob
```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_...
```
**Where:** Vercel Dashboard → Storage → Blob

---

### 6. Security Keys
```bash
# Generate with: openssl rand -base64 32
SESSION_SECRET=[32+ random characters]
ENCRYPTION_KEY=[32+ random characters]
```

---

### 7. Cloudflare Turnstile
```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
```
**Where:** Cloudflare Dashboard → Turnstile

---

## OAuth Configuration

### Google OAuth
**Console:** https://console.cloud.google.com

**Authorized Redirect URIs:**
```
https://[your-project].supabase.co/auth/v1/callback
```

**Authorized JavaScript Origins:**
```
https://ebonidating.com
https://www.ebonidating.com
```

---

## Critical Redirects Summary

### Authentication Flow:
1. **Signup Email** → `https://ebonidating.com/auth/callback`
2. **Google OAuth (Login)** → `https://ebonidating.com/auth/callback`
3. **Google OAuth (Signup)** → `https://ebonidating.com/api/auth/callback`
4. **After Verification** → `/dashboard` or `/onboarding`

### Files Updated for Production:
- ✅ `/app/auth/login/page.tsx` - Login redirect
- ✅ `/app/auth/sign-up/page.tsx` - Signup redirect  
- ✅ `/components/enhanced-signup-form.tsx` - Email & Google signup
- ✅ `/components/login-form.tsx` - Google login
- ✅ `/app/api/auth/callback/route.ts` - API callback handler
- ✅ `/app/auth/callback/page.tsx` - Auth callback page
- ✅ `.env.example` - Production environment template

---

## Quick Test Commands

### Test Environment Variables (in Vercel)
```bash
vercel env ls
```

### Test Local Build
```bash
pnpm build
```

### Test Production Deployment
```bash
vercel --prod
```

---

## Emergency Quick Fixes

### If Google OAuth Fails:
1. Check redirect URIs in Google Console
2. Verify Supabase callback URL
3. Check `NEXT_PUBLIC_APP_URL` in Vercel

### If Email Verification Fails:
1. Check Resend domain verification
2. Verify email templates in Supabase
3. Check spam folder

### If Redirects Go to Wrong URL:
1. Verify `NEXT_PUBLIC_APP_URL=https://ebonidating.com`
2. Redeploy after env var changes
3. Clear browser cache

---

## Important Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://app.supabase.com
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Resend Dashboard:** https://resend.com/home
- **Google Cloud Console:** https://console.cloud.google.com
- **Cloudflare Dashboard:** https://dash.cloudflare.com

---

## Deployment Order

1. ✅ Set all environment variables in Vercel
2. ✅ Update Supabase redirect URLs
3. ✅ Configure Google OAuth
4. ✅ Set up Stripe webhooks
5. ✅ Verify Resend domain
6. ✅ Deploy to production
7. ✅ Test authentication flow
8. ✅ Test payment flow

---

**Last Updated:** 2025-11-05
**Version:** 1.0.0
**Status:** Production Ready ✅
