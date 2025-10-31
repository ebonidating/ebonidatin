#!/bin/bash
# Apply all database migrations to Supabase
set -e

echo "🚀 Applying database migrations to Supabase..."

# Database connection details from .env.vercel
DB_URL="postgres://postgres.aqxnvdpbyfpwfqrsorer:dfn63Ia14glSEXcQ@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require"

# Array of migration files in order
MIGRATIONS=(
  "20251031_fix_rls_policies.sql"
  "20251031_fix_foreign_keys_and_indexes.sql"
  "20251031_auth_triggers_and_functions.sql"
  "20251031_stripe_webhooks.sql"
  "20251031_realtime_and_notifications.sql"
)

# Apply each migration
for migration in "${MIGRATIONS[@]}"; do
  echo ""
  echo "📝 Applying migration: $migration"
  PGPASSWORD='dfn63Ia14glSEXcQ' psql "$DB_URL" -f "supabase/migrations/$migration"
  
  if [ $? -eq 0 ]; then
    echo "✅ Successfully applied: $migration"
  else
    echo "❌ Failed to apply: $migration"
    exit 1
  fi
done

echo ""
echo "✨ All migrations applied successfully!"
echo ""
echo "Next steps:"
echo "1. Configure Stripe webhook endpoint: https://your-domain.com/api/webhooks/stripe"
echo "2. Add webhook secret to .env.local: STRIPE_WEBHOOK_SECRET=whsec_xxx"
echo "3. Configure Supabase Auth settings in dashboard"
echo "4. Set up email templates for verification and password reset"
