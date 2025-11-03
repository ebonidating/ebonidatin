-- Production Security and Optimization Setup
-- This migration adds all necessary security, indexes, and production features

-- ============================================================================
-- PART 1: PERFORMANCE INDEXES
-- ============================================================================

-- Profiles table indexes for common queries
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier 
ON core.profiles(subscription_tier) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_profiles_user_type 
ON core.profiles(user_type) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_profiles_last_active 
ON core.profiles(last_active DESC) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_profiles_email_verified 
ON core.profiles(email_verified) WHERE email_verified = false;

CREATE INDEX IF NOT EXISTS idx_profiles_location 
ON core.profiles(country, state, city) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_profiles_subscription_expires 
ON core.profiles(subscription_expires_at) 
WHERE subscription_tier != 'free' AND subscription_expires_at IS NOT NULL;

-- Posts table indexes
CREATE INDEX IF NOT EXISTS idx_posts_created_at 
ON core.posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_posts_user_featured 
ON core.posts(user_id, is_featured) WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS idx_posts_type_created 
ON core.posts(post_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_posts_likes_count 
ON core.posts(likes_count DESC) WHERE likes_count > 0;

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_receiver_created 
ON messaging.messages(receiver_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_sender_created 
ON messaging.messages(sender_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_unread 
ON messaging.messages(receiver_id, is_read) WHERE is_read = false;

-- Matches indexes
CREATE INDEX IF NOT EXISTS idx_matches_user1_created 
ON messaging.matches(user_id_1, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_matches_user2_created 
ON messaging.matches(user_id_2, created_at DESC);

-- Social indexes
CREATE INDEX IF NOT EXISTS idx_likes_liker_created 
ON social.likes(liker_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_likes_liked_created 
ON social.likes(liked_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_blocks_blocker 
ON social.blocks(blocker_id);

CREATE INDEX IF NOT EXISTS idx_post_likes_post 
ON social.post_likes(post_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_post_comments_post 
ON social.post_comments(post_id, created_at DESC);

-- ============================================================================
-- PART 2: DATABASE VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Active premium users view
CREATE OR REPLACE VIEW analytics.active_premium_users AS
SELECT 
  id, 
  full_name, 
  display_name,
  email, 
  subscription_tier, 
  last_active,
  created_at,
  subscription_expires_at
FROM core.profiles
WHERE is_active = true 
  AND subscription_tier IN ('premium', 'vip', 'model_pro')
  AND (subscription_expires_at IS NULL OR subscription_expires_at > NOW());

-- User engagement metrics view
CREATE OR REPLACE VIEW analytics.user_engagement_metrics AS
SELECT 
  p.id,
  p.full_name,
  p.user_type,
  p.subscription_tier,
  p.last_active,
  COUNT(DISTINCT po.id) as total_posts,
  COUNT(DISTINCT l.id) as total_likes_given,
  COUNT(DISTINCT m.id) as total_messages_sent,
  COALESCE(SUM(po.likes_count), 0) as total_likes_received
FROM core.profiles p
LEFT JOIN core.posts po ON p.id = po.user_id
LEFT JOIN social.likes l ON p.id = l.liker_id
LEFT JOIN messaging.messages m ON p.id = m.sender_id
WHERE p.is_active = true
GROUP BY p.id, p.full_name, p.user_type, p.subscription_tier, p.last_active;

-- Daily statistics view
CREATE OR REPLACE VIEW analytics.daily_statistics AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as new_users,
  COUNT(*) FILTER (WHERE user_type = 'model') as new_models,
  COUNT(*) FILTER (WHERE subscription_tier != 'free') as paid_signups
FROM core.profiles
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Top models view
CREATE OR REPLACE VIEW analytics.top_models AS
SELECT 
  p.id,
  p.full_name,
  p.display_name,
  p.profile_photo_url,
  p.followers_count,
  COUNT(DISTINCT po.id) as total_posts,
  COALESCE(SUM(po.likes_count), 0) as total_likes,
  COALESCE(SUM(po.views), 0) as total_views
FROM core.profiles p
LEFT JOIN core.posts po ON p.id = po.user_id
WHERE p.user_type = 'model' 
  AND p.is_active = true
GROUP BY p.id, p.full_name, p.display_name, p.profile_photo_url, p.followers_count
ORDER BY total_likes DESC, followers_count DESC
LIMIT 100;

-- ============================================================================
-- PART 3: SECURITY FUNCTIONS
-- ============================================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM core.profiles
    WHERE id = auth.uid()
    AND user_type = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can access premium features
CREATE OR REPLACE FUNCTION auth.has_premium_access()
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

-- Function to check if user is blocked
CREATE OR REPLACE FUNCTION auth.is_blocked_by(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM social.blocks
    WHERE blocker_id = target_user_id
    AND blocked_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PART 4: ENHANCED RLS POLICIES
-- ============================================================================

-- Messages: Users can only see messages they sent or received, and not blocked users
DROP POLICY IF EXISTS messages_select ON messaging.messages;
CREATE POLICY messages_select ON messaging.messages
FOR SELECT USING (
  (sender_id = auth.uid() OR receiver_id = auth.uid())
  AND NOT auth.is_blocked_by(
    CASE 
      WHEN sender_id = auth.uid() THEN receiver_id 
      ELSE sender_id 
    END
  )
);

-- Posts: Users can view posts from non-blocked users
DROP POLICY IF EXISTS posts_select ON core.posts;
CREATE POLICY posts_select ON core.posts
FOR SELECT USING (
  NOT auth.is_blocked_by(user_id)
);

-- Matches: Users can only see their own matches
DROP POLICY IF EXISTS matches_select ON messaging.matches;
CREATE POLICY matches_select ON messaging.matches
FOR SELECT USING (
  user_id_1 = auth.uid() OR user_id_2 = auth.uid()
);

-- ============================================================================
-- PART 5: DATABASE FUNCTIONS FOR COMMON OPERATIONS
-- ============================================================================

-- Function to get user match recommendations
CREATE OR REPLACE FUNCTION public.get_match_recommendations(
  user_id UUID,
  limit_count INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  display_name TEXT,
  profile_photo_url TEXT,
  bio TEXT,
  age INT,
  city TEXT,
  country TEXT,
  match_score FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.display_name,
    p.profile_photo_url,
    p.bio,
    EXTRACT(YEAR FROM AGE(p.date_of_birth))::INT as age,
    p.city,
    p.country,
    COALESCE(sms.score, 0.5) as match_score
  FROM core.profiles p
  LEFT JOIN analytics.smart_matching_scores sms 
    ON sms.user_id = user_id AND sms.match_id = p.id
  WHERE p.id != user_id
    AND p.is_active = true
    AND p.id NOT IN (
      SELECT blocked_id FROM social.blocks WHERE blocker_id = user_id
    )
    AND p.id NOT IN (
      SELECT blocker_id FROM social.blocks WHERE blocked_id = user_id
    )
    AND p.id NOT IN (
      SELECT CASE 
        WHEN user_id_1 = user_id THEN user_id_2 
        ELSE user_id_1 
      END
      FROM messaging.matches 
      WHERE user_id_1 = user_id OR user_id_2 = user_id
    )
  ORDER BY match_score DESC, p.last_active DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a match
CREATE OR REPLACE FUNCTION public.create_match(
  user1_id UUID,
  user2_id UUID
)
RETURNS UUID AS $$
DECLARE
  match_id UUID;
  mutual_like BOOLEAN;
BEGIN
  -- Check if both users liked each other
  mutual_like := EXISTS (
    SELECT 1 FROM social.likes 
    WHERE liker_id = user1_id AND liked_id = user2_id
  ) AND EXISTS (
    SELECT 1 FROM social.likes 
    WHERE liker_id = user2_id AND liked_id = user1_id
  );

  IF mutual_like THEN
    -- Create match if doesn't exist
    INSERT INTO messaging.matches (user_id_1, user_id_2)
    VALUES (
      LEAST(user1_id, user2_id),
      GREATEST(user1_id, user2_id)
    )
    ON CONFLICT DO NOTHING
    RETURNING id INTO match_id;
    
    RETURN match_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get unread message count (fixed)
CREATE OR REPLACE FUNCTION public.get_unread_message_count(user_id UUID)
RETURNS INT AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INT
    FROM messaging.messages
    WHERE receiver_id = user_id 
    AND is_read = false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PART 6: AUDIT AND LOGGING
-- ============================================================================

-- Create audit log table
CREATE TABLE IF NOT EXISTS admin.audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES core.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user 
ON admin.audit_log(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_log_action 
ON admin.audit_log(action, created_at DESC);

-- Audit trigger function
CREATE OR REPLACE FUNCTION admin.audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO admin.audit_log (user_id, action, table_name, record_id, old_data)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, OLD.id, row_to_json(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO admin.audit_log (user_id, action, table_name, record_id, old_data, new_data)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO admin.audit_log (user_id, action, table_name, record_id, new_data)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, row_to_json(NEW));
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to sensitive tables
DROP TRIGGER IF EXISTS audit_profiles_trigger ON core.profiles;
CREATE TRIGGER audit_profiles_trigger
AFTER INSERT OR UPDATE OR DELETE ON core.profiles
FOR EACH ROW EXECUTE FUNCTION admin.audit_trigger_func();

-- ============================================================================
-- PART 7: RATE LIMITING
-- ============================================================================

-- Enhanced rate limit check function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  user_id UUID,
  action_type TEXT,
  max_actions INT,
  time_window INTERVAL
)
RETURNS BOOLEAN AS $$
DECLARE
  action_count INT;
BEGIN
  -- Clean old entries
  DELETE FROM analytics.rate_limits
  WHERE created_at < NOW() - time_window;
  
  -- Count recent actions
  SELECT COUNT(*) INTO action_count
  FROM analytics.rate_limits
  WHERE analytics.rate_limits.user_id = check_rate_limit.user_id
  AND action = action_type
  AND created_at > NOW() - time_window;
  
  IF action_count >= max_actions THEN
    RETURN FALSE;
  END IF;
  
  -- Log this action
  INSERT INTO analytics.rate_limits (user_id, action)
  VALUES (user_id, action_type);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PART 8: SUBSCRIPTION MANAGEMENT
-- ============================================================================

-- Table for subscription history
CREATE TABLE IF NOT EXISTS subscriptions_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES core.profiles(id) ON DELETE CASCADE,
  old_tier TEXT,
  new_tier TEXT NOT NULL,
  stripe_subscription_id TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  amount DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_history_user 
ON subscriptions_history(user_id, created_at DESC);

-- Function to update subscription
CREATE OR REPLACE FUNCTION public.update_subscription(
  user_id UUID,
  new_tier TEXT,
  expires_at TIMESTAMPTZ,
  stripe_sub_id TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  old_tier TEXT;
BEGIN
  -- Get current tier
  SELECT subscription_tier INTO old_tier
  FROM core.profiles
  WHERE id = user_id;
  
  -- Update profile
  UPDATE core.profiles
  SET 
    subscription_tier = new_tier,
    subscription_expires_at = expires_at,
    updated_at = NOW()
  WHERE id = user_id;
  
  -- Log to history
  INSERT INTO subscriptions_history (user_id, old_tier, new_tier, stripe_subscription_id)
  VALUES (user_id, old_tier, new_tier, stripe_sub_id);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PART 9: CLEANUP AND MAINTENANCE
-- ============================================================================

-- Function to clean up old data
CREATE OR REPLACE FUNCTION admin.cleanup_old_data()
RETURNS VOID AS $$
BEGIN
  -- Delete old rate limit entries (older than 24 hours)
  DELETE FROM analytics.rate_limits
  WHERE created_at < NOW() - INTERVAL '24 hours';
  
  -- Delete old audit logs (older than 90 days)
  DELETE FROM admin.audit_log
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Delete inactive users (not active for 2 years and free tier)
  UPDATE core.profiles
  SET is_active = false
  WHERE last_active < NOW() - INTERVAL '2 years'
  AND subscription_tier = 'free'
  AND is_active = true;
  
  -- Vacuum analyze for performance
  VACUUM ANALYZE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PART 10: GRANT PERMISSIONS
-- ============================================================================

-- Grant select on views to authenticated users
GRANT SELECT ON analytics.active_premium_users TO authenticated;
GRANT SELECT ON analytics.user_engagement_metrics TO authenticated;
GRANT SELECT ON analytics.top_models TO authenticated;

-- Grant execute on public functions
GRANT EXECUTE ON FUNCTION public.get_match_recommendations TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_match TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_unread_message_count TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit TO authenticated;

-- Admin only functions
GRANT EXECUTE ON FUNCTION admin.cleanup_old_data TO service_role;

COMMENT ON MIGRATION IS 'Production security, optimization, and feature setup';
