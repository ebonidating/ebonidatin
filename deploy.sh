#!/bin/bash
echo "🚀 Deploying Eboni Dating to Vercel..."
echo ""
echo "Step 1: Checking git status..."
git status --short

echo ""
echo "Step 2: Starting Vercel deployment..."
vercel --prod --yes

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Visit Vercel dashboard to verify: https://vercel.com/dashboard"
echo "2. Add domain: vercel domains add ebonidating.com"
echo "3. Configure DNS records"
echo ""
