# 🚀 Production Deployment Guide

Welcome! This guide will help you deploy **Eboni Dating** to production on `ebonidating.com`.

---

## 📚 Documentation Files

We've created comprehensive documentation to guide you through the entire production deployment:

### 1. **QUICK_REFERENCE.md** ⚡ (Start Here!)
Quick access to:
- Critical environment variables
- OAuth configuration
- Redirect URLs
- Quick test commands
- Emergency fixes

**Best for:** Quick lookups and troubleshooting

---

### 2. **PRODUCTION_KEYS_SETUP.md** 🔑 (Detailed Setup)
Complete guide for all API keys and services:
- Supabase (Database & Auth)
- Stripe (Payments)
- Resend (Email)
- Vercel Blob (Storage)
- Security services
- Monitoring tools

**Best for:** Setting up each service step-by-step

---

### 3. **DEPLOYMENT_CHECKLIST.md** ✅ (Deployment Steps)
Step-by-step deployment process:
- Pre-deployment setup
- Configuration verification
- Build and deploy
- Post-deployment testing
- Monitoring setup
- Rollback procedures

**Best for:** Following during actual deployment

---

### 4. **PRODUCTION_UPDATE_SUMMARY.md** 📋 (What Changed)
Summary of all changes:
- Files updated for production
- Redirect flow diagrams
- Testing checklist
- Common issues and fixes

**Best for:** Understanding what was changed and why

---

### 5. **.env.production.template** 📝 (Environment Variables)
Template for Vercel environment variables:
- All required keys listed
- Comments explaining each key
- Priority levels marked
- Setup instructions included

**Best for:** Copy-paste into Vercel Dashboard

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Set Environment Variables
```bash
# In Vercel Dashboard:
# Project → Settings → Environment Variables

# Copy all variables from .env.production.template
# Set Environment to: Production
# Click Save
```

### Step 2: Configure Supabase
```bash
# In Supabase Dashboard:
# Authentication → URL Configuration

Site URL: https://ebonidating.com

Redirect URLs:
- https://ebonidating.com/auth/callback
- https://ebonidating.com/api/auth/callback
```

### Step 3: Update Email Templates
```bash
# In Supabase Dashboard:
# Authentication → Email Templates

# Update ALL templates redirect URL to:
https://ebonidating.com/auth/callback
```

### Step 4: Configure Google OAuth
```bash
# In Google Cloud Console:
# APIs & Services → Credentials

# Add Authorized Redirect URIs:
https://[your-project].supabase.co/auth/v1/callback
```

### Step 5: Deploy
```bash
git push origin main

# Or manually:
vercel --prod
```

### Step 6: Test
- [ ] Sign up with email
- [ ] Verify email received
- [ ] Click verification link
- [ ] Test Google OAuth
- [ ] Test payment flow

---

## 📂 Files Updated for Production

### Authentication Files:
✅ `/app/auth/login/page.tsx`  
✅ `/app/auth/sign-up/page.tsx`  
✅ `/app/auth/callback/page.tsx`  
✅ `/app/api/auth/callback/route.ts`  
✅ `/components/enhanced-signup-form.tsx`  
✅ `/components/login-form.tsx`  

### Configuration Files:
✅ `.env.example`  
✅ `.env.production.template`  

### All redirects now use:
```javascript
process.env.NEXT_PUBLIC_APP_URL || window.location.origin
```

---

## 🔑 Critical Environment Variables

**Must be set BEFORE deployment:**

```bash
# Production URLs (CRITICAL)
NEXT_PUBLIC_APP_URL=https://ebonidating.com
NODE_ENV=production

# Supabase (CRITICAL)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Stripe (CRITICAL)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (CRITICAL)
RESEND_API_KEY=...
RESEND_FROM_EMAIL=noreply@ebonidating.com

# Storage (CRITICAL)
BLOB_READ_WRITE_TOKEN=...

# Security (CRITICAL)
SESSION_SECRET=...
ENCRYPTION_KEY=...
```

---

## 🔄 Redirect Flow Summary

### Email Verification:
```
Sign Up → Email Link → /auth/callback → Dashboard/Onboarding
```

### Google OAuth (Login):
```
Click Google → Authenticate → /auth/callback → Dashboard
```

### Google OAuth (Signup):
```
Click Google → Authenticate → /api/auth/callback → Dashboard/Onboarding
```

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All critical environment variables set in Vercel
- [ ] Supabase redirect URLs updated to production domain
- [ ] Email templates updated with production URLs
- [ ] Google OAuth redirect URIs configured
- [ ] Stripe webhooks pointing to production
- [ ] Resend domain verified (DNS configured)
- [ ] Local build successful (`pnpm build`)
- [ ] All tests passing

---

## 🧪 Post-Deployment Testing

After deployment, test:

### Authentication:
- [ ] Email signup → Verify email → Login
- [ ] Google signup → Profile creation
- [ ] Google login → Dashboard access
- [ ] Sign out → Session cleared

### Payments:
- [ ] Premium subscription
- [ ] Elite subscription
- [ ] Webhook received
- [ ] Database updated

### Security:
- [ ] Turnstile widget loads
- [ ] HTTPS redirect works
- [ ] Security headers present

---

## 📊 Monitoring

### Watch These:
- **Vercel Analytics:** Response times, errors
- **Supabase Logs:** Auth attempts, database queries
- **Stripe Dashboard:** Payments, webhooks
- **Resend Dashboard:** Email delivery

### Alert Thresholds:
- Response time > 200ms
- Error rate > 0.1%
- Email delivery < 99%
- OAuth success < 95%

---

## 🆘 Common Issues

### Issue: Google OAuth fails
**Solution:** Check redirect URIs in Google Console and Supabase

### Issue: Email verification doesn't work
**Solution:** Verify Resend domain and check Supabase email templates

### Issue: Redirects go to wrong URL
**Solution:** Verify `NEXT_PUBLIC_APP_URL` in Vercel and redeploy

### Issue: Payments not processing
**Solution:** Check Stripe webhook URL and signing secret

---

## 📞 Need Help?

### Documentation Links:
- **Vercel:** https://vercel.com/docs
- **Supabase:** https://supabase.com/docs
- **Stripe:** https://stripe.com/docs
- **Next.js:** https://nextjs.org/docs

### Quick Reference:
See `QUICK_REFERENCE.md` for immediate help

### Detailed Setup:
See `PRODUCTION_KEYS_SETUP.md` for comprehensive guides

### Deployment Process:
See `DEPLOYMENT_CHECKLIST.md` for step-by-step instructions

---

## 🎉 Ready to Deploy?

Follow this order:

1. Read `QUICK_REFERENCE.md` (5 min)
2. Set up keys using `PRODUCTION_KEYS_SETUP.md` (30 min)
3. Follow `DEPLOYMENT_CHECKLIST.md` (20 min)
4. Test using checklist in `PRODUCTION_UPDATE_SUMMARY.md` (15 min)

**Total time: ~70 minutes**

---

## 📝 Support

For issues or questions:
- Review documentation files
- Check common issues section
- Verify environment variables
- Check service dashboards

---

**Version:** 1.0.0  
**Last Updated:** 2025-11-05  
**Status:** ✅ Production Ready  

**Next Step:** Open `QUICK_REFERENCE.md` to begin! 🚀
