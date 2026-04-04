# 🚨 CRITICAL FIXES CHECKLIST

**BLOCKING YOUR LAUNCH: 3 critical issues must be fixed before anything else works**

---

## ✋ STOP! DO THESE FIRST (Next 1 Hour)

### 1️⃣ Add Environment Variables to Vercel
**Status**: 🔴 BLOCKING  
**Estimated Time**: 15 minutes

**Why**: Database won't connect, users can't sign up, payments won't process

**Steps**:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (ebonidatin)
3. Click **Settings** → **Environment Variables**
4. Add these from your Supabase & Stripe dashboards:

```env
# From Supabase (https://app.supabase.com → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# From Stripe (https://dashboard.stripe.com → Developers → API Keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# From Resend (https://resend.com → API Keys)
RESEND_API_KEY=re_xxx
```

5. Click **Save** on each variable
6. Redeploy: Click **Deployments** → Click latest → Click **Redeploy**

**Verify**: Go to `/api/health` - should return green status

---

### 2️⃣ Initialize Database Schema
**Status**: 🔴 BLOCKING  
**Estimated Time**: 10 minutes

**Why**: Tables don't exist, user signup fails

**Steps**:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click your project (aqxnvdpbyfpwfqrsorer)
3. Click **SQL Editor** in left sidebar
4. Click **New Query**
5. Copy entire content from: `/scripts/complete-database-setup.sql`
6. Paste into query editor
7. Click **Run** or press `Ctrl+Enter`
8. Wait for success message

**Expected Output**:
```
✅ Database setup and update completed successfully!
All tables created, RLS enabled, sample data inserted
```

**Verify**:
- Click **Table Editor** in left sidebar
- You should see 7 tables:
  - ✅ profiles
  - ✅ matches
  - ✅ messages
  - ✅ likes
  - ✅ notifications
  - ✅ faqs
  - ✅ success_stories

---

### 3️⃣ Test User Signup (End-to-End)
**Status**: 🔴 BLOCKING  
**Estimated Time**: 5 minutes

**Why**: Verify everything is connected

**Steps**:
1. Go to your app at `https://your-vercel-url.vercel.app`
2. Click **Sign Up**
3. Enter test credentials:
   - Email: `test@example.com`
   - Password: `TestPassword123!`
4. Click **Sign Up**
5. Should redirect to onboarding or dashboard
6. Create profile
7. Go to [Supabase Dashboard](https://app.supabase.com) → **Table Editor** → **profiles**
8. Should see new profile row created

**If it fails**:
- ❌ Check error message
- ❌ Verify environment variables were added
- ❌ Check Supabase tables were created
- ❌ Try redeploying

---

## ⚡ DO THESE NEXT (1-2 Hours)

### 4️⃣ Setup Email Service (Verification & Password Reset)
**Status**: 🟠 HIGH PRIORITY  
**Estimated Time**: 2 hours

**Why**: Users can't verify email, password reset won't work

**Steps**:
1. Get Resend API Key from [resend.com](https://resend.com)
2. Already added to `.env` (step 1)
3. Create email template files:
   - `/lib/email-templates/verification.tsx`
   - `/lib/email-templates/password-reset.tsx`
   - `/lib/email-templates/welcome.tsx`

4. Create `/lib/send-email.ts`:
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`
  
  return await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'noreply@ebonidating.com',
    to: email,
    subject: 'Verify your Eboni Dating account',
    html: `<a href="${verificationUrl}">Click here to verify</a>`,
  })
}
```

5. Update signup flow to send verification emails
6. Test email delivery

**Verify**: Sign up with new email → Check inbox → Click verification link

---

### 5️⃣ Add SEO Meta Tags to All Pages
**Status**: 🟠 HIGH PRIORITY  
**Estimated Time**: 2 hours

**Why**: Pages won't show up in Google, social sharing broken

**Pages that need meta tags**:
- [ ] `/dashboard` - Add title, description, OG image
- [ ] `/discover` - "Browse potential matches..."
- [ ] `/messages` - "Your conversations..."
- [ ] `/pricing` - Include pricing in description
- [ ] `/admin` - Admin dashboard (private)

**Template for each page**:
```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Eboni Dating - Find Your Perfect Match',
  description: 'Browse your matches, manage your profile, and find love in the Black community',
  openGraph: {
    title: 'Dashboard | Eboni Dating',
    description: 'Browse your matches and find love',
    type: 'website',
    url: 'https://ebonidating.com/dashboard',
    images: [{
      url: '/og-dashboard.jpg',
      width: 1200,
      height: 630,
      alt: 'Eboni Dating Dashboard',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dashboard | Eboni Dating',
    description: 'Browse your matches and find love',
    images: ['/og-dashboard.jpg'],
  },
}

export default function DashboardPage() {
  // ... page content
}
```

**Verify**: 
- Use [Schema.org validator](https://validator.schema.org/)
- Test with [Open Graph debugger](https://www.opengraph.xyz/)

---

### 6️⃣ Compress Images in `/public`
**Status**: 🟠 HIGH PRIORITY  
**Estimated Time**: 1 hour

**Why**: App loads 30% slower than it should

**Steps**:
1. Go to [TinyPNG](https://tinypng.com)
2. Upload each image in `/public`:
   - hero-banner.jpg
   - model-1.jpg through model-5.jpg
   - og-image.png
   - Any other images
3. Download compressed versions
4. Replace in `/public`
5. Also convert to WebP for modern browsers

**Expected Savings**: 20-30% file size reduction (2-5MB → 500KB-2MB)

**Verify**: Run Lighthouse, check image sizes decreased

---

## 📋 THE REST OF YOUR CRITICAL PATH

### Phase 1 Progress Tracking

```
✅ Environment Variables Added
✅ Database Schema Initialized
✅ User Signup Tested
⏳ Email Service Setup (IN PROGRESS)
⏳ SEO Meta Tags Added (IN PROGRESS)
⏳ Images Compressed (IN PROGRESS)
⏳ Loading Skeletons Added
⏳ Empty States Added
⏳ Profile Completion Indicator
⏳ Rate Limiting Implemented
⏳ Admin Analytics Dashboard
⏳ Input Sanitization
⏳ Ready for Beta Launch
```

---

## 🎯 SUCCESS CRITERIA

You'll know you're ready to move to Phase 2 when:

- ✅ All environment variables set in Vercel
- ✅ Database has 7 tables with data
- ✅ User can sign up → receive verification email → login
- ✅ All pages have proper meta tags
- ✅ Lighthouse score > 80
- ✅ Page load time < 3 seconds
- ✅ No console errors on main pages
- ✅ Admin can login and see users

---

## 🆘 TROUBLESHOOTING

### "Database connection refused"
1. Check Supabase credentials in Vercel env vars
2. Verify Supabase project is active
3. Check firewall allows Vercel IPs
4. Try redeploying

### "Email not sending"
1. Verify Resend API key is correct
2. Check email is from verified domain
3. Look for Resend error logs
4. Try different recipient email

### "Images not showing"
1. Check file exists in `/public`
2. Verify filename matches exactly
3. Check file permissions
4. Try clearing browser cache

### "Meta tags not showing on Twitter/Facebook"
1. Use social media debugger tools
2. Wait 24 hours for cache refresh
3. Check OG image URL is accessible
4. Verify metadata export syntax

---

## 📞 NEXT STEPS

When you complete this checklist:
1. ✅ Commit these changes to git
2. ✅ Create GitHub issue for Phase 2 tasks
3. ✅ Schedule code review
4. ✅ Plan user beta testing
5. ✅ Set launch date (target: April 24, 2026)

---

**Estimated Time to Complete**: 4-5 hours  
**Recommended Order**: 1 → 2 → 3 → 4 → 5 → 6  
**Start Now**: Go to step 1️⃣

