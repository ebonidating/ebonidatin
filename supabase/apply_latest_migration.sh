#!/bin/bash

echo "🚀 Starting Database Migration..."
echo "================================"

# Find the latest migration file
LATEST_MIGRATION=$(ls supabase/migrations/*.sql | sort -r | head -n1)

if [ -z "$LATEST_MIGRATION" ]; then
    echo "❌ No migration files found in supabase/migrations/"
    exit 1
fi

echo "📄 Latest migration: $(basename $LATEST_MIGRATION)"

# Check if we have database connection
if [ -z "$POSTGRES_URL" ]; then
    echo "❌ POSTGRES_URL environment variable not set"
    exit 1
fi

echo "🔗 Applying migration to database..."
psql "$POSTGRES_URL" -f "$LATEST_MIGRATION"

if [ $? -eq 0 ]; then
    echo "✅ Migration applied successfully!"
    echo "📊 Migration file: $(basename $LATEST_MIGRATION)"
else
    echo "❌ Migration failed!"
    exit 1
fi
