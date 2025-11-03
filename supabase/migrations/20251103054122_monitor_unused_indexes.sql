-- 🧩 Safe fix for unused indexes — non-destructive
-- This script tracks and monitors unused indexes instead of deleting them.
-- Supabase lint: unused_index

-- Step 1: Create an audit schema/table if not already present
CREATE SCHEMA IF NOT EXISTS analytics;

CREATE TABLE IF NOT EXISTS analytics.index_usage_audit (
  id BIGSERIAL PRIMARY KEY,
  schema_name TEXT NOT NULL,
  table_name TEXT NOT NULL,
  index_name TEXT NOT NULL,
  last_checked TIMESTAMPTZ DEFAULT now(),
  idx_scan_count BIGINT DEFAULT 0,
  index_size TEXT DEFAULT 'unknown'
);

-- Step 2: Log all currently unused indexes (safe insert, ignores duplicates)
INSERT INTO analytics.index_usage_audit (schema_name, table_name, index_name, idx_scan_count, index_size)
SELECT
  schemaname,
  relname AS table_name,
  indexrelname AS index_name,
  idx_scan AS idx_scan_count,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ON CONFLICT DO NOTHING;

-- Step 3: Ensure index statistics are refreshed for future checks
ANALYZE;

-- Step 4: (Optional) Add comment metadata for tracking
COMMENT ON TABLE analytics.index_usage_audit IS
'Tracks Supabase-detected unused indexes. Do not drop automatically — review manually.';
