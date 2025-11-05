# 🚀 Production Deployment Guide

Complete guide for deploying Eboni Dating to production on `ebonidating.com`.

---

## 📚 Quick Links

- **Quick Reference:** See `QUICK_REFERENCE.md` for keys, configs, and emergency fixes
- **Database Updates:** See `DATABASE_UPDATES.md` for migration details
- **Project Info:** See `README.md` for development setup

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Set Environment Variables in Vercel
```bash
# Go to: Vercel Dashboard → Project → Settings → Environment Variables
# Copy from: .env.production.template
# Set Environment to: Production
```

**Critical Variables:**
```bash
NEXT_PUBLIC_APP_URL=https://ebonidating.com
NEXT_PUBLIC_URL=https://ebonidating.com
NODE_ENV=production
```

### Step 2: Configure Supabase
```bash
# In Supabase Dashboard: Authentication → URL Configuration

Site URL: https://ebonidating.com

Redirect URLs:
- https://ebonidating.com/auth/callback
- https://ebonidating.com/api/auth/callback
```

### Step 3: Update Email Templates
```bash
# In Supabase Dashboard: Authentication → Email Templates
# Update ALL templates redirect URL to:
https://ebonidating.com/auth/callback
```

### Step 4: Configure Google OAuth
```bash
# In Google Cloud Console: APIs & Services → Credentials
# Add Authorized Redirect URIs:
https://[your-project].supabase.co/auth/v1/callback
```

### Step 5: Apply Database Migration
```bash
# See DATABASE_UPDATES.md for instructions
# Quick: Copy SQL from supabase/migrations/20251105_*.sql
# Paste in Supabase Dashboard SQL Editor and run
```

### Step 6: Deploy
```bash
git push origin main
# Or: vercel --prod
```

---

## 🔑 Required API Keys & Services

### 🔴 CRITICAL (App Won't Work Without These)

#### 1. Supabase
**Where:** https://supabase.com → Settings → API
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

**Configuration:**
- Site URL: `https://ebonidating.com`
- Redirect URLs: `/auth/callback`, `/api/auth/callback`
- Email templates updated with production URL

#### 2. Stripe
**Where:** https://dashboard.stripe.com → Developers → API keys (LIVE MODE)
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID=price_...
```

**Webhook:** `https://ebonidating.com/api/webhooks/stripe`

#### 3. Resend (Email)
**Where:** https://resend.com → API Keys
```bash
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@ebonidating.com
```

**Must verify domain:** Add DNS records from Resend dashboard

#### 4. Vercel Blob Storage
**Where:** Vercel Dashboard → Storage → Blob
```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_...
```

#### 5. Security Keys
```bash
# Generate with: openssl rand -base64 32
SESSION_SECRET=[32+ chars]

# Generate with: openssl rand -hex 32
ENCRYPTION_KEY=[32+ chars]
```

#### 6. Cloudflare Turnstile
**Where:** https://dash.cloudflare.com → Turnstile
```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
```

### 🟠 HIGH PRIORITY (Important Features)

#### 7. Twilio (SMS)
```bash
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890
```

#### 8. Upstash Redis (Rate Limiting)
```bash
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...
```

#### 9. VAPID (Push Notifications)
```bash
# Generate with: npx web-push generate-vapid-keys
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_EMAIL=mailto:admin@ebonidating.com
```

### 🟡 OPTIONAL (Enhanced Features)

#### 10. Cloudinary (Images)
```bash
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

#### 11. Google Maps
```bash
GOOGLE_MAPS_API_KEY=AIzaSy...
```

#### 12. Sentry (Error Tracking)
```bash
NEXT_PUBLIC_SENTRY_DSN=...
SENTRY_AUTH_TOKEN=...
```

#### 13. Google Analytics
```bash
NEXT_PUBLIC_GA_ID=G-...
```

---

## ✅ Pre-Deployment Checklist

### Configuration
- [ ] All critical environment variables set in Vercel
- [ ] Supabase redirect URLs updated to production domain
- [ ] Email templates point to production URLs
- [ ] Google OAuth redirect URIs configured
- [ ] Stripe webhooks point to production
- [ ] Resend domain verified (DNS configured)

### Code & Build
- [ ] Local build successful: `pnpm build`
- [ ] All tests passing
- [ ] Code committed to main branch
- [ ] Database migration ready

### Services
- [ ] Vercel project connected to GitHub
- [ ] Domain added to Vercel: `ebonidating.com`
- [ ] SSL certificate active (automatic via Vercel)

---

## 🧪 Post-Deployment Testing

### Authentication Flow
- [ ] Email signup → Verify email → Complete onboarding → Dashboard
- [ ] Email login → Dashboard access
- [ ] Google signup → Profile created → Onboarding check
- [ ] Google login → Dashboard access
- [ ] Sign out → Session cleared

### Payment Flow
- [ ] Subscribe to Premium tier
- [ ] Subscribe to Elite tier
- [ ] Verify webhook received in Stripe Dashboard
- [ ] Check subscription_tier updated in database

### Security
- [ ] Turnstile widget loads on login/signup
- [ ] HTTPS redirect works (try http://)
- [ ] Security headers present
- [ ] Rate limiting active (if Redis configured)

### Performance
- [ ] Page load < 2 seconds
- [ ] API response < 200ms
- [ ] Images optimized and loading

---

## 🔄 Redirect Flow Summary

### Email Verification
```
Sign Up → Email Link → /auth/callback → Dashboard or Onboarding
```

### Google OAuth (Login)
```
Click Google → Authenticate → /auth/callback → Dashboard
```

### Google OAuth (Signup)
```
Click Google → Authenticate → /api/auth/callback → Onboarding or Dashboard
```

---

## 📊 Monitoring & Alerts

### Watch These Metrics
- **Response Time:** < 200ms
- **Error Rate:** < 0.1%
- **Email Delivery:** > 99%
- **OAuth Success:** > 95%
- **Payment Success:** > 98%

### Tools
- Vercel Analytics (built-in)
- Supabase Logs
- Stripe Dashboard
- Sentry (if configured)
- Google Analytics

---

## 🐛 Common Issues & Fixes

### Issue: Google OAuth redirects to wrong URL
**Fix:**
1. Check `NEXT_PUBLIC_APP_URL` in Vercel
2. Verify Google Console redirect URIs
3. Redeploy after env var changes

### Issue: Email verification doesn't work
**Fix:**
1. Check Supabase email templates
2. Verify Resend domain DNS
3. Check spam folder

### Issue: Payments not processing
**Fix:**
1. Verify Stripe webhook URL
2. Check webhook signing secret
3. Review Stripe webhook logs

### Issue: Redirects go to localhost
**Fix:**
1. Verify `NEXT_PUBLIC_APP_URL=https://ebonidating.com`
2. Clear browser cache
3. Redeploy application

---

## 🔄 Rollback Procedure

If issues occur:

**Immediate Rollback:**
1. Go to Vercel Dashboard → Deployments
2. Click previous working deployment
3. Click "Promote to Production"

**Code Revert:**
```bash
git revert HEAD
git push origin main
```

**Check Logs:**
- Vercel Function Logs
- Supabase Logs → Database & Auth
- Sentry Errors (if configured)

---

## 📝 Post-Launch (First 24 Hours)

### Monitor:
- [ ] Error rates and patterns
- [ ] Failed authentication attempts
- [ ] Payment processing success rate
- [ ] Email delivery rates
- [ ] Response times
- [ ] User feedback

### Review:
- [ ] Supabase auth logs
- [ ] Vercel function logs
- [ ] Stripe webhook logs
- [ ] Email delivery logs

---

## 🎯 Performance Optimization Tips

1. **Enable Caching:**
   - Already configured in `next.config.mjs`
   - Headers set for static assets

2. **Database Queries:**
   - Use indexes (created in migration)
   - Leverage views for complex queries
   - Use connection pooling

3. **Images:**
   - Use Next.js Image component
   - Vercel automatic optimization
   - WebP/AVIF formats enabled

4. **API Routes:**
   - Minimize database calls
   - Use Edge Functions where applicable
   - Cache responses when possible

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Next.js Docs:** https://nextjs.org/docs

---

## 🎉 Deployment Complete!

After successful deployment:

1. **Announce:** Let your team/users know
2. **Monitor:** Watch metrics for first 24 hours
3. **Backup:** Export database and env vars
4. **Document:** Note any custom configurations
5. **Celebrate:** You've deployed to production! 🎉

---

**Version:** 1.0.0  
**Last Updated:** 2025-11-05  
**Status:** ✅ Production Ready
