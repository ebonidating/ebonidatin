# Missing Environment Variables

Add these environment variables to your Vercel project in the **Vars** section of the in-chat sidebar:

## Email Service (Required for verification emails)
- `SENDGRID_API_KEY` - Get from SendGrid dashboard
- `SENDGRID_FROM_EMAIL` - Your verified sender email
- `SENDGRID_TEMPLATE_ID_VERIFY` - Email verification template ID
- `SENDGRID_TEMPLATE_ID_WELCOME` - Welcome email template ID

## SMS Service (Optional - for phone verification)
- `TWILIO_ACCOUNT_SID` - Get from Twilio console
- `TWILIO_AUTH_TOKEN` - Get from Twilio console
- `TWILIO_PHONE_NUMBER` - Your Twilio phone number

## Push Notifications (Optional)
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` - Already set
- `VAPID_PRIVATE_KEY` - Already set
- `VAPID_EMAIL` - Already set

## Error Tracking (Recommended)
- `SENTRY_DSN` - Get from Sentry.io project settings
- `SENTRY_ORG` - Your Sentry organization slug
- `SENTRY_PROJECT` - Your Sentry project slug

## Analytics (Optional)
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` - Get from Google Analytics
- `NEXT_PUBLIC_MIXPANEL_TOKEN` - Get from Mixpanel dashboard

## AI Features (Optional - for smart matching)
- `OPENAI_API_KEY` - Get from OpenAI platform

## Feature Flags
- `FEATURE_SMART_MATCHING_ENABLED=true`
- `FEATURE_VIDEO_CALLS_ENABLED=true`
- `FEATURE_LIVE_STREAMING_ENABLED=false`
- `FEATURE_GALLERY_ENABLED=true`

## Admin Configuration
- `ADMIN_EMAIL` - Super admin email address
- `ADMIN_PASSWORD_HASH` - Bcrypt hash of admin password

## Already Configured
✅ Supabase (database, auth, storage)
✅ Stripe (payments)
✅ Vercel Blob (file storage)
✅ Google OAuth (social login)

## Setup Instructions

1. **SendGrid** (Email):
   - Sign up at sendgrid.com
   - Create API key with "Mail Send" permissions
   - Verify sender email
   - Create email templates for verification and welcome emails

2. **Twilio** (SMS - Optional):
   - Sign up at twilio.com
   - Get Account SID and Auth Token from console
   - Purchase a phone number

3. **Sentry** (Error Tracking):
   - Sign up at sentry.io
   - Create new project
   - Copy DSN from project settings

4. **Google Analytics**:
   - Create property at analytics.google.com
   - Copy Measurement ID (starts with G-)

All environment variables should be added in the Vercel dashboard or the Vars section in v0.
