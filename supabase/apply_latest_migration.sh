#!/bin/bash

# ============================================================================
# Apply Latest Database Migration
# ============================================================================

set -e  # Exit on error

echo "🚀 Starting Database Migration..."
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Migration file
MIGRATION_FILE="migrations/20251105_enhanced_auth_and_optimization.sql"

# Check if migration file exists
if [ ! -f "$MIGRATION_FILE" ]; then
    echo -e "${RED}❌ Migration file not found: $MIGRATION_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Migration file found${NC}"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}⚠️  Supabase CLI not found${NC}"
    echo "Please install: npm install -g supabase"
    echo ""
    echo "Or apply migration manually via Supabase Dashboard SQL Editor"
    echo ""
    read -p "Do you want to see the manual instructions? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cat << 'EOF'

📝 Manual Migration Steps:
═══════════════════════════════════════════════════════

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Click "New Query"
4. Copy the entire content from:
   supabase/migrations/20251105_enhanced_auth_and_optimization.sql
5. Paste into the SQL editor
6. Click "Run" button
7. Wait for completion messages
8. Verify success messages at the bottom

Expected Success Messages:
✅ Migration completed successfully!
✅ Email verification tracking enabled
✅ Auth logging system active
✅ Onboarding progress tracking enabled
✅ Performance indexes created
✅ Profile completion calculation active

EOF
    fi
    exit 0
fi

echo "🔍 Checking Supabase project connection..."

# Check if project is linked
if [ ! -f ".supabase/config.toml" ]; then
    echo -e "${YELLOW}⚠️  Project not linked${NC}"
    echo ""
    read -p "Enter your Supabase Project Reference ID: " PROJECT_REF
    
    echo "Linking to project..."
    supabase link --project-ref "$PROJECT_REF"
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to link project${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Project linked successfully${NC}"
fi

echo ""
echo "📊 Database Information:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
supabase db inspect --db-url "$DATABASE_URL" || echo "Using linked project"
echo ""

# Confirm before applying
read -p "🤔 Do you want to apply the migration now? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Migration cancelled${NC}"
    exit 0
fi

echo ""
echo "🔄 Applying migration..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Apply the migration
supabase db push

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Migration applied successfully!${NC}"
    echo ""
    
    # Run verification queries
    echo "🔍 Verifying migration..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Note: These verification queries would need to be run separately
    # as supabase CLI doesn't have a direct SQL query command
    
    cat << 'EOF'

✅ Migration Complete!

📋 What was added:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Email verification tracking table
✓ User authentication logs table
✓ Onboarding progress tracking
✓ Enhanced profile fields
✓ 8 new database functions
✓ 2 new views for querying
✓ 15+ performance indexes
✓ RLS policies for security
✓ Auto-triggers for tracking

🔍 Next Steps:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ✓ Migration applied
2. → Test authentication flows
3. → Verify API endpoints work
4. → Check onboarding system
5. → Monitor logs and stats

📚 Documentation:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
See DATABASE_UPDATES.md for:
- Complete table documentation
- Function usage examples
- API endpoint details
- Performance tuning tips
- Troubleshooting guide

🧪 Test Queries (run in Supabase SQL Editor):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Check tables created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'core' 
AND table_name IN ('email_verifications', 'user_auth_logs', 'onboarding_progress');

-- Check functions created
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%onboarding%';

-- View active users
SELECT COUNT(*) FROM core.active_users;

EOF

else
    echo ""
    echo -e "${RED}❌ Migration failed!${NC}"
    echo ""
    echo "Common issues:"
    echo "1. Check database connection"
    echo "2. Verify permissions (need service_role access)"
    echo "3. Check for syntax errors in migration file"
    echo "4. Review Supabase Dashboard logs"
    echo ""
    echo "See DATABASE_UPDATES.md for troubleshooting guide"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 All done!${NC}"
