-- Fix production issues and complete setup
-- Part 1: Fix schema permissions for auth functions

-- Create functions in public schema instead of auth
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM core.profiles
    WHERE id = auth.uid()
    AND user_type = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.has_premium_access()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM core.profiles
    WHERE id = auth.uid()
    AND subscription_tier IN ('premium', 'vip', 'model_pro')
    AND (subscription_expires_at IS NULL OR subscription_expires_at > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_blocked_by(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM social.blocks
    WHERE blocker_id = target_user_id
    AND blocked_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Part 2: Fix RLS policies to use public functions
DROP POLICY IF EXISTS messages_select ON messaging.messages;
CREATE POLICY messages_select ON messaging.messages
FOR SELECT USING (
  (sender_id = auth.uid() OR receiver_id = auth.uid())
  AND NOT public.is_blocked_by(
    CASE 
      WHEN sender_id = auth.uid() THEN receiver_id 
      ELSE sender_id 
    END
  )
);

DROP POLICY IF EXISTS posts_select ON core.posts;
CREATE POLICY posts_select ON core.posts
FOR SELECT USING (
  NOT public.is_blocked_by(user_id)
);

-- Part 3: Add missing created_at columns where needed
DO $$ 
BEGIN
  -- Check and add created_at to matches if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'messaging' 
    AND table_name = 'matches' 
    AND column_name = 'created_at'
  ) THEN
    ALTER TABLE messaging.matches ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  -- Check and add created_at to likes if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'social' 
    AND table_name = 'likes' 
    AND column_name = 'created_at'
  ) THEN
    ALTER TABLE social.likes ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  -- Check and add created_at to blocks if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'social' 
    AND table_name = 'blocks' 
    AND column_name = 'created_at'
  ) THEN
    ALTER TABLE social.blocks ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Part 4: Now create indexes with created_at
DROP INDEX IF EXISTS messaging.idx_messages_receiver_created;
CREATE INDEX idx_messages_receiver_created 
ON messaging.messages(receiver_id, created_at DESC);

DROP INDEX IF EXISTS messaging.idx_messages_sender_created;
CREATE INDEX idx_messages_sender_created 
ON messaging.messages(sender_id, created_at DESC);

DROP INDEX IF EXISTS messaging.idx_matches_user1_created;
CREATE INDEX idx_matches_user1_created 
ON messaging.matches(user_id_1, created_at DESC);

DROP INDEX IF EXISTS messaging.idx_matches_user2_created;
CREATE INDEX idx_matches_user2_created 
ON messaging.matches(user_id_2, created_at DESC);

DROP INDEX IF EXISTS social.idx_likes_liker_created;
CREATE INDEX idx_likes_liker_created 
ON social.likes(liker_id, created_at DESC);

DROP INDEX IF EXISTS social.idx_likes_liked_created;
CREATE INDEX idx_likes_liked_created 
ON social.likes(liked_id, created_at DESC);

-- Part 5: Enable Row Level Security on all tables
ALTER TABLE core.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messaging.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE messaging.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messaging.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE social.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE social.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE social.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE social.post_comments ENABLE ROW LEVEL SECURITY;

-- Part 6: Grant necessary permissions
GRANT USAGE ON SCHEMA core TO authenticated, anon;
GRANT USAGE ON SCHEMA messaging TO authenticated;
GRANT USAGE ON SCHEMA social TO authenticated;
GRANT USAGE ON SCHEMA analytics TO authenticated, anon;
GRANT USAGE ON SCHEMA admin TO service_role;

-- Grant select on analytics views
GRANT SELECT ON analytics.active_premium_users TO authenticated;
GRANT SELECT ON analytics.user_engagement_metrics TO authenticated;
GRANT SELECT ON analytics.daily_statistics TO authenticated, anon;
GRANT SELECT ON analytics.top_models TO authenticated, anon;

-- Grant execute on public functions
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_premium_access TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_blocked_by TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_match_recommendations TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_match TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_unread_message_count TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit TO authenticated;

-- Part 7: Create admin user type if it doesn't exist
DO $$
BEGIN
  -- Add admin to user_type check constraint
  ALTER TABLE core.profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;
  ALTER TABLE core.profiles ADD CONSTRAINT profiles_user_type_check 
  CHECK (user_type IN ('user', 'model', 'admin'));
EXCEPTION
  WHEN OTHERS THEN
    -- Ignore if already exists
    NULL;
END $$;

-- Part 8: Create contact submissions table
CREATE TABLE IF NOT EXISTS admin.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status 
ON admin.contact_submissions(status, created_at DESC);

-- Part 9: Create system settings table
CREATE TABLE IF NOT EXISTS admin.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES core.profiles(id)
);

-- Insert default settings
INSERT INTO admin.system_settings (key, value, description) VALUES
  ('maintenance_mode', 'false'::jsonb, 'Enable/disable maintenance mode'),
  ('registration_enabled', 'true'::jsonb, 'Allow new user registrations'),
  ('max_free_messages_per_day', '10'::jsonb, 'Maximum messages for free users per day')
ON CONFLICT (key) DO NOTHING;

-- Part 10: Add database statistics function
CREATE OR REPLACE FUNCTION admin.get_database_stats()
RETURNS TABLE (
  stat_name TEXT,
  stat_value BIGINT,
  stat_description TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'total_users'::TEXT,
    COUNT(*)::BIGINT,
    'Total number of users'::TEXT
  FROM core.profiles
  UNION ALL
  SELECT 
    'active_users'::TEXT,
    COUNT(*)::BIGINT,
    'Users active in last 7 days'::TEXT
  FROM core.profiles
  WHERE last_active > NOW() - INTERVAL '7 days'
  UNION ALL
  SELECT 
    'premium_users'::TEXT,
    COUNT(*)::BIGINT,
    'Users with premium subscription'::TEXT
  FROM core.profiles
  WHERE subscription_tier IN ('premium', 'vip', 'model_pro')
    AND (subscription_expires_at IS NULL OR subscription_expires_at > NOW())
  UNION ALL
  SELECT 
    'total_posts'::TEXT,
    COUNT(*)::BIGINT,
    'Total number of posts'::TEXT
  FROM core.posts
  UNION ALL
  SELECT 
    'total_messages'::TEXT,
    COUNT(*)::BIGINT,
    'Total messages sent'::TEXT
  FROM messaging.messages;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION admin.get_database_stats TO service_role;

-- Part 11: Add audit trigger to profiles
CREATE OR REPLACE FUNCTION admin.audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO admin.audit_log (user_id, action, table_name, record_id, old_data)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO admin.audit_log (user_id, action, table_name, record_id, old_data, new_data)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO admin.audit_log (user_id, action, table_name, record_id, new_data)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit trigger to profiles
DROP TRIGGER IF EXISTS audit_profiles_trigger ON core.profiles;
CREATE TRIGGER audit_profiles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON core.profiles
  FOR EACH ROW EXECUTE FUNCTION admin.audit_trigger_func();

-- Part 12: Add realtime publication for important tables
ALTER PUBLICATION supabase_realtime ADD TABLE core.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE messaging.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE messaging.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE social.likes;

-- Part 13: Create backup and restore functions
CREATE OR REPLACE FUNCTION admin.backup_user_data(user_id_param UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'profile', (SELECT row_to_json(p) FROM core.profiles p WHERE id = user_id_param),
    'posts', (SELECT jsonb_agg(row_to_json(po)) FROM core.posts po WHERE user_id = user_id_param),
    'messages_sent', (SELECT jsonb_agg(row_to_json(m)) FROM messaging.messages m WHERE sender_id = user_id_param LIMIT 1000),
    'backup_date', NOW()
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION admin.backup_user_data TO service_role;

COMMENT ON MIGRATION IS 'Fix production issues and complete secure setup';
