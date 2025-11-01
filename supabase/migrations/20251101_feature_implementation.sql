-- Feature Implementation Database Migrations
-- Run this script to add all necessary fields for new features

-- ====================================
-- PROFILE ENHANCEMENTS
-- ====================================

-- Badge-related fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS photo_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS message_response_rate DECIMAL(3,2) DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_active TIMESTAMP DEFAULT NOW();

-- Filter fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS education VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profession VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS height_cm INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS religion VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cultural_background TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS languages_spoken TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS relationship_goal VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS interests TEXT[];

-- Gamification fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS achievement_count INTEGER DEFAULT 0;

-- ====================================
-- INDEXES FOR PERFORMANCE
-- ====================================

CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(country, city);
CREATE INDEX IF NOT EXISTS idx_profiles_active ON profiles(last_active DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON profiles(photo_verified, email_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_popular ON profiles(is_popular DESC) WHERE is_popular = TRUE;

-- ====================================
-- STORIES TABLE
-- ====================================

CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type VARCHAR(10) CHECK (media_type IN ('image', 'video')),
  caption TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '24 hours'),
  view_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_stories_user_expires ON stories(user_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_stories_active ON stories(is_active, expires_at DESC);

-- ====================================
-- STORY VIEWS TABLE
-- ====================================

CREATE TABLE IF NOT EXISTS story_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  viewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(story_id, viewer_id)
);

CREATE INDEX IF NOT EXISTS idx_story_views_story ON story_views(story_id);
CREATE INDEX IF NOT EXISTS idx_story_views_viewer ON story_views(viewer_id);

-- ====================================
-- ACHIEVEMENTS TABLE
-- ====================================

CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  points INTEGER NOT NULL,
  icon VARCHAR(50),
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ====================================
-- USER ACHIEVEMENTS TABLE
-- ====================================

CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_earned ON user_achievements(earned_at DESC);

-- ====================================
-- VIRTUAL GIFTS TABLE
-- ====================================

CREATE TABLE IF NOT EXISTS gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  price_credits INTEGER NOT NULL,
  category VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ====================================
-- GIFT TRANSACTIONS TABLE
-- ====================================

CREATE TABLE IF NOT EXISTS gift_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  gift_id UUID NOT NULL REFERENCES gifts(id),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gift_trans_sender ON gift_transactions(sender_id);
CREATE INDEX IF NOT EXISTS idx_gift_trans_receiver ON gift_transactions(receiver_id);
CREATE INDEX IF NOT EXISTS idx_gift_trans_created ON gift_transactions(created_at DESC);

-- ====================================
-- USER CREDITS TABLE
-- ====================================

CREATE TABLE IF NOT EXISTS user_credits (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  balance INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ====================================
-- SEED DEFAULT ACHIEVEMENTS
-- ====================================

INSERT INTO achievements (name, description, points, icon, category) VALUES
  ('Complete Profile', 'Fill out all profile information', 50, '📝', 'profile'),
  ('First Message', 'Send your first message', 25, '💬', 'social'),
  ('First Match', 'Get your first match', 100, '💖', 'social'),
  ('Week Streak', 'Log in for 7 consecutive days', 200, '🔥', 'engagement'),
  ('Month Streak', 'Log in for 30 consecutive days', 500, '⚡', 'engagement'),
  ('Video Call', 'Complete your first video call', 150, '📹', 'social'),
  ('Photo Verified', 'Verify your photos', 75, '✅', 'trust'),
  ('Super Conversationalist', 'Respond to 50 messages', 300, '💫', 'social'),
  ('Popular Profile', 'Get 100 profile views', 250, '⭐', 'popularity')
ON CONFLICT DO NOTHING;

-- ====================================
-- SEED DEFAULT GIFTS
-- ====================================

INSERT INTO gifts (name, description, icon, price_credits, category) VALUES
  ('Red Rose', 'Classic romantic gesture', '🌹', 10, 'romantic'),
  ('Heart', 'Show your affection', '❤️', 5, 'romantic'),
  ('Bouquet', 'Beautiful flowers', '💐', 25, 'romantic'),
  ('Crown', 'You are royalty', '👑', 50, 'premium'),
  ('Diamond', 'You are precious', '💎', 100, 'premium'),
  ('Coffee', 'Let''s grab coffee', '☕', 15, 'casual'),
  ('Champagne', 'Celebrate together', '🍾', 30, 'celebration'),
  ('Gift Box', 'Surprise gift', '🎁', 20, 'celebration')
ON CONFLICT DO NOTHING;

-- ====================================
-- UPDATE EXISTING PROFILES
-- ====================================

-- Set last_active for existing users
UPDATE profiles 
SET last_active = updated_at 
WHERE last_active IS NULL;

-- Mark active users as popular (example logic)
UPDATE profiles 
SET is_popular = TRUE 
WHERE subscription_tier IN ('premium', 'vip');

-- ====================================
-- FUNCTIONS
-- ====================================

-- Function to clean up expired stories
CREATE OR REPLACE FUNCTION cleanup_expired_stories()
RETURNS void AS $$
BEGIN
  UPDATE stories
  SET is_active = FALSE
  WHERE expires_at < NOW() AND is_active = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to update user points
CREATE OR REPLACE FUNCTION add_user_points(p_user_id UUID, p_points INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET total_points = total_points + p_points
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- TRIGGERS
-- ====================================

-- Update last_active on profile update
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_active = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_last_active ON profiles;
CREATE TRIGGER trigger_update_last_active
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_last_active();

-- ====================================
-- COMMENTS
-- ====================================

COMMENT ON TABLE stories IS 'User stories that expire after 24 hours';
COMMENT ON TABLE achievements IS 'Gamification achievements that users can earn';
COMMENT ON TABLE gifts IS 'Virtual gifts that can be sent between users';
COMMENT ON COLUMN profiles.photo_verified IS 'Whether user has completed photo verification';
COMMENT ON COLUMN profiles.is_popular IS 'Whether profile is marked as popular';
COMMENT ON COLUMN profiles.message_response_rate IS 'Percentage of messages user responds to';
COMMENT ON COLUMN profiles.cultural_background IS 'Array of cultural backgrounds/ethnicities';

-- ====================================
-- COMPLETION MESSAGE
-- ====================================

DO $$
BEGIN
  RAISE NOTICE '✅ Migration completed successfully!';
  RAISE NOTICE '✅ Added profile enhancement fields';
  RAISE NOTICE '✅ Created stories tables';
  RAISE NOTICE '✅ Created achievements system';
  RAISE NOTICE '✅ Created gifts system';
  RAISE NOTICE '✅ Added indexes for performance';
  RAISE NOTICE '✅ Seeded default data';
END $$;
