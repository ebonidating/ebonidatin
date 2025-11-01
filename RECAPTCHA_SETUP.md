# reCAPTCHA Enterprise Setup Guide

## ✅ Implementation Complete

reCAPTCHA Enterprise has been integrated into your authentication flows!

## 🔑 Your Site Key

```
6Lf2Rv4rAAAAAA4L6cUK2v9Q9gfadD_u_FbnyP6L
```

This key is already configured in the code and `.env.example`.

## 📋 What You Need to Do

### Step 1: Add Environment Variables to Vercel

Go to your Vercel project dashboard and add these environment variables:

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lf2Rv4rAAAAAA4L6cUK2v9Q9gfadD_u_FbnyP6L
RECAPTCHA_SECRET_KEY=your-secret-key-from-google-cloud
GOOGLE_CLOUD_PROJECT_ID=your-gcp-project-id
```

### Step 2: Get Your Secret Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **Security** → **reCAPTCHA Enterprise**
3. Find your site key `6Lf2Rv4rAAAAAA4L6cUK2v9Q9gfadD_u_FbnyP6L`
4. Copy the **API Key** (secret key)
5. Note your **Project ID**

### Step 3: Configure the API

The reCAPTCHA Enterprise API uses a different endpoint than standard reCAPTCHA.

**Current endpoint in code:**
```typescript
https://recaptchaenterprise.googleapis.com/v1/projects/{PROJECT_ID}/assessments?key={API_KEY}
```

You need to replace `{PROJECT_ID}` with your actual Google Cloud Project ID.

## 🎯 Where It's Implemented

### 1. Login Page
- **File**: `app/auth/login/page.tsx`
- **Action**: `LOGIN`
- Executes on form submission
- Verifies user is human before authentication

### 2. Signup Form
- **File**: `components/enhanced-signup-form.tsx`
- **Action**: `SIGNUP`
- Executes on form submission
- Prevents bot registrations

### 3. Verification API
- **File**: `app/api/verify-recaptcha/route.ts`
- Validates tokens server-side
- Returns score (0.0 - 1.0)
- Threshold: 0.5 (configurable)

## 🔧 How It Works

### Client-Side (Browser)
```typescript
import { useRecaptcha } from '@/hooks/use-recaptcha'

const { executeRecaptcha } = useRecaptcha()

// On form submit:
const token = await executeRecaptcha('ACTION_NAME')

// Send token to backend
await fetch('/api/verify-recaptcha', {
  method: 'POST',
  body: JSON.stringify({ token, action: 'ACTION_NAME' })
})
```

### Server-Side (API)
```typescript
// Verify with Google
const response = await fetch(
  `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${secretKey}`,
  {
    method: 'POST',
    body: JSON.stringify({
      event: {
        token,
        expectedAction: action,
        siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
      }
    })
  }
)

// Check score
const data = await response.json()
const score = data.riskAnalysis?.score || 0

// Pass if score >= 0.5
return score >= 0.5
```

## 📊 Score Interpretation

reCAPTCHA Enterprise returns a **risk score**:

- **1.0**: Very likely a human ✅
- **0.7-0.9**: Probably human ✅
- **0.5-0.6**: Uncertain ⚠️ (current threshold)
- **0.3-0.4**: Likely a bot ❌
- **0.0-0.2**: Very likely a bot ❌

**Current threshold**: 0.5 (blocks ~50% of bots)
**Recommended**: 0.5-0.7 for balance

## 🛡️ Security Features

### ✅ Implemented
- [x] Bot detection on login
- [x] Bot detection on signup
- [x] Score-based verification
- [x] Graceful degradation (works without keys)
- [x] Error handling
- [x] Action-specific validation

### 🔄 Future Enhancements
- [ ] Add to password reset
- [ ] Add to contact forms
- [ ] Add to message sending
- [ ] Add to profile editing
- [ ] Monitoring dashboard

## 🚨 Important Notes

### 1. Different from reCAPTCHA v3
reCAPTCHA **Enterprise** is NOT the same as reCAPTCHA v3:
- Uses different API endpoints
- Requires Google Cloud project
- Better accuracy and features
- More control over thresholds

### 2. API Endpoint
Make sure to update the project ID in:
```typescript
// app/api/verify-recaptcha/route.ts
const verifyUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/${process.env.GOOGLE_CLOUD_PROJECT_ID}/assessments?key=${secretKey}`
```

### 3. Graceful Fallback
If reCAPTCHA is not configured:
- ✅ Forms still work
- ⚠️ No bot protection
- 📝 Warning in console

## 🔍 Testing

### Test Bot Detection
1. Go to `/auth/login` or `/auth/sign-up`
2. Submit the form
3. Check browser console for reCAPTCHA token
4. Check server logs for verification result
5. Score should be displayed

### Verify It's Working
1. **Client-side**: Open browser DevTools
   - Console should show: "reCAPTCHA loaded"
   - Network tab should show token generation

2. **Server-side**: Check Vercel logs
   - Should see verification API calls
   - Score should be logged

3. **Google Cloud Console**
   - Go to reCAPTCHA Enterprise dashboard
   - View recent requests
   - Check scores and actions

## 📝 Environment Variables Summary

| Variable | Type | Example | Required |
|----------|------|---------|----------|
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Public | `6Lf2Rv4r...` | Yes |
| `RECAPTCHA_SECRET_KEY` | Private | `your-api-key` | Yes |
| `GOOGLE_CLOUD_PROJECT_ID` | Private | `my-project-123` | Yes |

## 🎯 Quick Start Checklist

- [ ] Get secret key from Google Cloud Console
- [ ] Get project ID from Google Cloud Console
- [ ] Add `RECAPTCHA_SECRET_KEY` to Vercel
- [ ] Add `GOOGLE_CLOUD_PROJECT_ID` to Vercel
- [ ] Verify `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set
- [ ] Redeploy site on Vercel
- [ ] Test login form
- [ ] Test signup form
- [ ] Check Google Cloud Console for requests

## 🔗 Helpful Links

- [reCAPTCHA Enterprise Docs](https://cloud.google.com/recaptcha-enterprise/docs)
- [Google Cloud Console](https://console.cloud.google.com/)
- [API Reference](https://cloud.google.com/recaptcha-enterprise/docs/reference/rest)
- [Best Practices](https://cloud.google.com/recaptcha-enterprise/docs/implement-guide)

## 💰 Pricing

**reCAPTCHA Enterprise Pricing:**
- First 10,000 assessments/month: **FREE** ✅
- Additional assessments: $1 per 1,000

**Estimated costs:**
- 1,000 users/month: **FREE**
- 10,000 users/month: **FREE**
- 50,000 users/month: ~$40/month
- 100,000 users/month: ~$90/month

## ⚠️ Troubleshooting

### "reCAPTCHA not loaded"
- Check if script is in `<head>` (it is ✅)
- Verify site key is correct
- Check browser console for errors

### "Verification failed"
- Check secret key is correct
- Verify project ID matches
- Check API is enabled in GCP

### "Invalid token"
- Token expired (valid for 2 minutes)
- Action name mismatch
- Wrong site key

### "Score too low"
- User might be using VPN
- Browser in incognito mode
- Adjust threshold if needed

---

**Status**: ✅ Code ready, waiting for API keys
**Next Step**: Add environment variables to Vercel
