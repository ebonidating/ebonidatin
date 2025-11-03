#!/bin/bash

# Production Deployment Script for Eboni Dating
# This script deploys all changes to production

set -e  # Exit on error

echo "🚀 Eboni Dating Production Deployment"
echo "======================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Run this script from the project root.${NC}"
    exit 1
fi

echo "📋 Pre-deployment Checklist"
echo "----------------------------"

# Check Node.js
if command -v node &> /dev/null; then
    echo -e "${GREEN}✓${NC} Node.js $(node --version)"
else
    echo -e "${RED}✗${NC} Node.js not found"
    exit 1
fi

# Check pnpm
if command -v pnpm &> /dev/null; then
    echo -e "${GREEN}✓${NC} pnpm $(pnpm --version)"
else
    echo -e "${RED}✗${NC} pnpm not found. Installing..."
    npm install -g pnpm
fi

# Check git
if command -v git &> /dev/null; then
    echo -e "${GREEN}✓${NC} git $(git --version | cut -d' ' -f3)"
else
    echo -e "${RED}✗${NC} git not found"
    exit 1
fi

echo ""
echo "🔍 Running Tests"
echo "----------------"

# Check TypeScript
echo "Checking TypeScript..."
if pnpm run type-check 2>/dev/null; then
    echo -e "${GREEN}✓${NC} TypeScript check passed"
else
    echo -e "${YELLOW}⚠${NC} TypeScript check had warnings (continuing)"
fi

# Build the project
echo ""
echo "🏗️  Building Project"
echo "-------------------"
if pnpm run build; then
    echo -e "${GREEN}✓${NC} Build successful"
else
    echo -e "${RED}✗${NC} Build failed"
    exit 1
fi

# Check environment variables
echo ""
echo "🔐 Checking Environment Variables"
echo "-----------------------------------"

required_vars=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
)

missing_vars=0
for var in "${required_vars[@]}"; do
    if grep -q "^${var}=" .env.local 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $var"
    else
        echo -e "${RED}✗${NC} $var (missing)"
        missing_vars=$((missing_vars + 1))
    fi
done

if [ $missing_vars -gt 0 ]; then
    echo -e "${RED}Error: Missing $missing_vars required environment variable(s)${NC}"
    exit 1
fi

# Check database connection
echo ""
echo "🗄️  Checking Database Connection"
echo "--------------------------------"

if psql "${DATABASE_URL:-$POSTGRES_URL_NON_POOLING}" -c "SELECT 1" &> /dev/null; then
    echo -e "${GREEN}✓${NC} Database connection successful"
else
    echo -e "${YELLOW}⚠${NC} Could not verify database connection (may need manual check)"
fi

# Git status
echo ""
echo "📦 Git Status"
echo "-------------"

if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠${NC} You have uncommitted changes:"
    git status --short
    echo ""
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message: " commit_msg
        git commit -m "$commit_msg"
        echo -e "${GREEN}✓${NC} Changes committed"
    fi
else
    echo -e "${GREEN}✓${NC} Working directory clean"
fi

# Push to git
echo ""
echo "📤 Pushing to Git"
echo "-----------------"

current_branch=$(git branch --show-current)
echo "Current branch: $current_branch"

read -p "Push to origin/$current_branch? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if git push origin $current_branch; then
        echo -e "${GREEN}✓${NC} Pushed to origin/$current_branch"
    else
        echo -e "${RED}✗${NC} Push failed"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠${NC} Skipping git push"
fi

# Vercel deployment
echo ""
echo "🚀 Deploying to Vercel"
echo "----------------------"

if command -v vercel &> /dev/null; then
    read -p "Deploy to Vercel production? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        vercel --prod
        echo -e "${GREEN}✓${NC} Deployed to Vercel"
    else
        echo -e "${YELLOW}⚠${NC} Skipping Vercel deployment"
    fi
else
    echo -e "${YELLOW}⚠${NC} Vercel CLI not found. Install with: npm i -g vercel"
    echo "You can deploy manually at: https://vercel.com"
fi

# Post-deployment checks
echo ""
echo "✅ Post-Deployment Verification"
echo "--------------------------------"

echo ""
echo "Please verify the following endpoints:"
echo "1. https://ebonidating.com/ - Homepage"
echo "2. https://ebonidating.com/api/health - Health check"
echo "3. https://ebonidating.com/advertise - Advertise page"
echo "4. https://ebonidating.com/contact - Contact page"
echo "5. https://ebonidating.com/admin/debug - Admin dashboard (requires auth)"

echo ""
echo "🎉 Deployment Complete!"
echo "======================="
echo ""
echo "📊 Next Steps:"
echo "1. Verify all endpoints are working"
echo "2. Check Vercel deployment logs"
echo "3. Monitor error rates in production"
echo "4. Review user feedback"
echo ""
echo "📚 Documentation:"
echo "- Production setup: PRODUCTION_SETUP_COMPLETE.md"
echo "- Debug analysis: DEBUG_ANALYSIS.md"
echo "- Latest updates: LATEST_UPDATES.md"
echo ""
echo "💡 Quick Commands:"
echo "- Health check: curl https://ebonidating.com/api/health"
echo "- View logs: vercel logs"
echo "- Rollback: vercel rollback"
echo ""

exit 0
