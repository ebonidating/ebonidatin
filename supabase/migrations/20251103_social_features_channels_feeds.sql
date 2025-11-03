-- Social Features: Channels, Feeds, Countries, and Follow System
-- Instagram-like features for global dating platform

-- ============================================================================
-- PART 1: COUNTRY SUPPORT
-- ============================================================================

-- Add country and language support to profiles
ALTER TABLE core.profiles ADD COLUMN IF NOT EXISTS country_code VARCHAR(2);
ALTER TABLE core.profiles ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en';
ALTER TABLE core.profiles ADD COLUMN IF NOT EXISTS timezone TEXT;
ALTER TABLE core.profiles ADD COLUMN IF NOT EXISTS bio_extended TEXT;
ALTER TABLE core.profiles ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Create index for country-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_country_code 
ON core.profiles(country_code) WHERE country_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_country_active 
ON core.profiles(country_code, last_active DESC) WHERE is_active = true;

-- ============================================================================
-- PART 2: FOLLOWERS SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS social.followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES core.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES core.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id),
  UNIQUE(follower_id, following_id)
);

CREATE INDEX IF NOT EXISTS idx_followers_follower 
ON social.followers(follower_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_followers_following 
ON social.followers(following_id, created_at DESC);

-- ============================================================================
-- PART 3: CHANNELS SYSTEM (Like Instagram Channels)
-- ============================================================================

CREATE TABLE IF NOT EXISTS social.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES core.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  category TEXT CHECK (category IN ('dating', 'lifestyle', 'fashion', 'beauty', 'fitness', 'food', 'travel', 'entertainment', 'music', 'art', 'other')),
  is_public BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  subscribers_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_channels_owner 
ON social.channels(owner_id);

CREATE INDEX IF NOT EXISTS idx_channels_category 
ON social.channels(category, subscribers_count DESC);

CREATE INDEX IF NOT EXISTS idx_channels_subscribers 
ON social.channels(subscribers_count DESC);

CREATE INDEX IF NOT EXISTS idx_channels_public 
ON social.channels(is_public, subscribers_count DESC) WHERE is_public = true;

-- Channel subscribers table
CREATE TABLE IF NOT EXISTS social.channel_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES social.channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES core.profiles(id) ON DELETE CASCADE,
  notification_enabled BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_channel_subscribers_channel 
ON social.channel_subscribers(channel_id, subscribed_at DESC);

CREATE INDEX IF NOT EXISTS idx_channel_subscribers_user 
ON social.channel_subscribers(user_id, subscribed_at DESC);

-- ============================================================================
-- PART 4: FEEDS SYSTEM (Posts, Stories, Reels)
-- ============================================================================

CREATE TABLE IF NOT EXISTS social.feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES core.profiles(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES social.channels(id) ON DELETE SET NULL,
  feed_type TEXT NOT NULL CHECK (feed_type IN ('post', 'story', 'reel')),
  caption TEXT,
  media_urls TEXT[] NOT NULL,
  media_type TEXT CHECK (media_type IN ('image', 'video', 'mixed')),
  location TEXT,
  country_code VARCHAR(2),
  tags TEXT[],
  mentions UUID[],
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ, -- For stories (24 hours)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feeds_user 
ON social.feeds(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feeds_channel 
ON social.feeds(channel_id, created_at DESC) WHERE channel_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_feeds_country 
ON social.feeds(country_code, created_at DESC) WHERE country_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_feeds_type 
ON social.feeds(feed_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feeds_public 
ON social.feeds(is_public, created_at DESC) WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_feeds_expires 
ON social.feeds(expires_at) WHERE expires_at IS NOT NULL;

-- Feed likes
CREATE TABLE IF NOT EXISTS social.feed_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_id UUID NOT NULL REFERENCES social.feeds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES core.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(feed_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_feed_likes_feed 
ON social.feed_likes(feed_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feed_likes_user 
ON social.feed_likes(user_id, created_at DESC);

-- Feed comments
CREATE TABLE IF NOT EXISTS social.feed_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_id UUID NOT NULL REFERENCES social.feeds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES core.profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES social.feed_comments(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feed_comments_feed 
ON social.feed_comments(feed_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feed_comments_user 
ON social.feed_comments(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feed_comments_parent 
ON social.feed_comments(parent_id, created_at DESC) WHERE parent_id IS NOT NULL;

-- ============================================================================
-- PART 5: SAVED POSTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS social.saved_feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_id UUID NOT NULL REFERENCES social.feeds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES core.profiles(id) ON DELETE CASCADE,
  collection_name TEXT DEFAULT 'All',
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(feed_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_feeds_user 
ON social.saved_feeds(user_id, saved_at DESC);

-- ============================================================================
-- PART 6: HELPER FUNCTIONS
-- ============================================================================

-- Function to get user feed (posts from followed users)
CREATE OR REPLACE FUNCTION public.get_user_feed(
  requesting_user_id UUID,
  page_limit INT DEFAULT 20,
  page_offset INT DEFAULT 0
)
RETURNS TABLE (
  feed_id UUID,
  user_id UUID,
  user_name TEXT,
  user_avatar TEXT,
  feed_type TEXT,
  caption TEXT,
  media_urls TEXT[],
  likes_count INT,
  comments_count INT,
  is_liked BOOLEAN,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id AS feed_id,
    f.user_id,
    p.display_name AS user_name,
    p.profile_photo_url AS user_avatar,
    f.feed_type,
    f.caption,
    f.media_urls,
    f.likes_count,
    f.comments_count,
    EXISTS(SELECT 1 FROM social.feed_likes WHERE feed_id = f.id AND user_id = requesting_user_id) AS is_liked,
    f.created_at
  FROM social.feeds f
  JOIN core.profiles p ON f.user_id = p.id
  WHERE f.user_id IN (
    SELECT following_id FROM social.followers WHERE follower_id = requesting_user_id
    UNION
    SELECT requesting_user_id
  )
  AND f.is_public = true
  AND (f.expires_at IS NULL OR f.expires_at > NOW())
  ORDER BY f.created_at DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get explore feed (popular posts)
CREATE OR REPLACE FUNCTION public.get_explore_feed(
  requesting_user_id UUID,
  country_filter VARCHAR(2) DEFAULT NULL,
  page_limit INT DEFAULT 20,
  page_offset INT DEFAULT 0
)
RETURNS TABLE (
  feed_id UUID,
  user_id UUID,
  user_name TEXT,
  user_avatar TEXT,
  feed_type TEXT,
  caption TEXT,
  media_urls TEXT[],
  likes_count INT,
  comments_count INT,
  views_count INT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id AS feed_id,
    f.user_id,
    p.display_name AS user_name,
    p.profile_photo_url AS user_avatar,
    f.feed_type,
    f.caption,
    f.media_urls,
    f.likes_count,
    f.comments_count,
    f.views_count,
    f.created_at
  FROM social.feeds f
  JOIN core.profiles p ON f.user_id = p.id
  WHERE f.is_public = true
  AND (f.expires_at IS NULL OR f.expires_at > NOW())
  AND (country_filter IS NULL OR f.country_code = country_filter)
  AND f.user_id NOT IN (
    SELECT blocked_id FROM social.blocks WHERE blocker_id = requesting_user_id
  )
  ORDER BY (f.likes_count + f.comments_count * 2 + f.views_count / 10) DESC, f.created_at DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to follow/unfollow user
CREATE OR REPLACE FUNCTION public.toggle_follow(
  follower_user_id UUID,
  following_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  is_following BOOLEAN;
BEGIN
  -- Check if already following
  SELECT EXISTS(
    SELECT 1 FROM social.followers 
    WHERE follower_id = follower_user_id AND following_id = following_user_id
  ) INTO is_following;
  
  IF is_following THEN
    -- Unfollow
    DELETE FROM social.followers 
    WHERE follower_id = follower_user_id AND following_id = following_user_id;
    
    UPDATE core.profiles 
    SET followers_count = GREATEST(0, followers_count - 1)
    WHERE id = following_user_id;
    
    UPDATE core.profiles 
    SET following_count = GREATEST(0, following_count - 1)
    WHERE id = follower_user_id;
    
    RETURN FALSE;
  ELSE
    -- Follow
    INSERT INTO social.followers (follower_id, following_id)
    VALUES (follower_user_id, following_user_id)
    ON CONFLICT DO NOTHING;
    
    UPDATE core.profiles 
    SET followers_count = followers_count + 1
    WHERE id = following_user_id;
    
    UPDATE core.profiles 
    SET following_count = following_count + 1
    WHERE id = follower_user_id;
    
    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create feed post
CREATE OR REPLACE FUNCTION public.create_feed_post(
  posting_user_id UUID,
  post_type TEXT,
  post_caption TEXT,
  post_media_urls TEXT[],
  post_media_type TEXT,
  post_location TEXT DEFAULT NULL,
  post_country_code VARCHAR(2) DEFAULT NULL,
  post_tags TEXT[] DEFAULT NULL,
  post_channel_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_feed_id UUID;
  expires_time TIMESTAMPTZ;
BEGIN
  -- Set expiry for stories (24 hours)
  IF post_type = 'story' THEN
    expires_time := NOW() + INTERVAL '24 hours';
  END IF;
  
  -- Create feed post
  INSERT INTO social.feeds (
    user_id, feed_type, caption, media_urls, media_type,
    location, country_code, tags, channel_id, expires_at
  )
  VALUES (
    posting_user_id, post_type, post_caption, post_media_urls, post_media_type,
    post_location, post_country_code, post_tags, post_channel_id, expires_time
  )
  RETURNING id INTO new_feed_id;
  
  -- Update channel post count if applicable
  IF post_channel_id IS NOT NULL THEN
    UPDATE social.channels
    SET posts_count = posts_count + 1
    WHERE id = post_channel_id;
  END IF;
  
  RETURN new_feed_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PART 7: TRIGGERS
-- ============================================================================

-- Trigger to update channel updated_at
CREATE OR REPLACE FUNCTION update_channel_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE social.channels
  SET updated_at = NOW()
  WHERE id = NEW.channel_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_channel_timestamp ON social.feeds;
CREATE TRIGGER trigger_update_channel_timestamp
  AFTER INSERT ON social.feeds
  FOR EACH ROW
  WHEN (NEW.channel_id IS NOT NULL)
  EXECUTE FUNCTION update_channel_timestamp();

-- ============================================================================
-- PART 8: ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE social.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE social.channel_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE social.feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE social.feed_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE social.feed_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE social.followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE social.saved_feeds ENABLE ROW LEVEL SECURITY;

-- Channels policies
CREATE POLICY channels_select ON social.channels
  FOR SELECT USING (is_public = true OR owner_id = auth.uid());

CREATE POLICY channels_insert ON social.channels
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY channels_update ON social.channels
  FOR UPDATE USING (owner_id = auth.uid());

-- Feeds policies
CREATE POLICY feeds_select ON social.feeds
  FOR SELECT USING (
    is_public = true OR 
    user_id = auth.uid() OR
    user_id IN (SELECT following_id FROM social.followers WHERE follower_id = auth.uid())
  );

CREATE POLICY feeds_insert ON social.feeds
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY feeds_update ON social.feeds
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY feeds_delete ON social.feeds
  FOR DELETE USING (user_id = auth.uid());

-- Followers policies
CREATE POLICY followers_select ON social.followers
  FOR SELECT USING (true);

CREATE POLICY followers_insert ON social.followers
  FOR INSERT WITH CHECK (follower_id = auth.uid());

CREATE POLICY followers_delete ON social.followers
  FOR DELETE USING (follower_id = auth.uid());

-- ============================================================================
-- PART 9: GRANT PERMISSIONS
-- ============================================================================

GRANT SELECT ON social.channels TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON social.channels TO authenticated;

GRANT SELECT ON social.feeds TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON social.feeds TO authenticated;

GRANT SELECT, INSERT, DELETE ON social.followers TO authenticated;
GRANT SELECT, INSERT, DELETE ON social.feed_likes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON social.feed_comments TO authenticated;

GRANT EXECUTE ON FUNCTION public.get_user_feed TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_explore_feed TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.toggle_follow TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_feed_post TO authenticated;

COMMENT ON TABLE social.channels IS 'Instagram-like channels for content creators';
COMMENT ON TABLE social.feeds IS 'Social feed posts, stories, and reels';
COMMENT ON TABLE social.followers IS 'User following relationships';
