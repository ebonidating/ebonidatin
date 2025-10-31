-- Fix foreign key inconsistencies
-- Some tables reference auth.users instead of core.profiles
-- This migration fixes those references

-- Fix social.user_follows to reference core.profiles instead of auth.users
ALTER TABLE social.user_follows
  DROP CONSTRAINT IF EXISTS user_follows_follower_id_fkey,
  DROP CONSTRAINT IF EXISTS user_follows_following_id_fkey;

ALTER TABLE social.user_follows
  ADD CONSTRAINT user_follows_follower_id_fkey
    FOREIGN KEY (follower_id) REFERENCES core.profiles(id) ON DELETE CASCADE,
  ADD CONSTRAINT user_follows_following_id_fkey
    FOREIGN KEY (following_id) REFERENCES core.profiles(id) ON DELETE CASCADE;

-- Ensure admin.admin_users can handle NULL user_id
-- This allows creating admin users before they sign up
ALTER TABLE admin.admin_users
  ALTER COLUMN user_id DROP NOT NULL;

-- Add index for better performance on email lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin.admin_users(email);

-- Ensure admin.verified_users references core.profiles
ALTER TABLE admin.verified_users
  DROP CONSTRAINT IF EXISTS verified_users_verified_by_fkey;

ALTER TABLE admin.verified_users
  ADD CONSTRAINT verified_users_verified_by_fkey
    FOREIGN KEY (verified_by) REFERENCES core.profiles(id);

-- Add missing indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON core.profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON core.profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON core.profiles(location);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON core.profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON core.profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON core.profiles(last_active DESC);

CREATE INDEX IF NOT EXISTS idx_posts_created_at ON core.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_is_featured ON core.posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_posts_post_type ON core.posts(post_type);

CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON messaging.messages(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messaging.messages(is_read);

CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON messaging.chat_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_matches_matched_at ON messaging.matches(matched_at DESC);
CREATE INDEX IF NOT EXISTS idx_matches_is_active ON messaging.matches(is_active);

CREATE INDEX IF NOT EXISTS idx_likes_liked_at ON social.likes(liked_at DESC);

CREATE INDEX IF NOT EXISTS idx_reports_status ON admin.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_reported_at ON admin.reports(reported_at DESC);

-- Add composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON messaging.messages(sender_id, receiver_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_receiver ON messaging.chat_messages(sender_id, receiver_id, created_at DESC);

-- Add GIN indexes for array columns
CREATE INDEX IF NOT EXISTS idx_profiles_interests_gin ON core.profiles USING GIN (interests);
CREATE INDEX IF NOT EXISTS idx_profiles_interested_in_gin ON core.profiles USING GIN (interested_in);
CREATE INDEX IF NOT EXISTS idx_profiles_additional_photos_gin ON core.profiles USING GIN (additional_photos);

CREATE INDEX IF NOT EXISTS idx_posts_image_urls_gin ON core.posts USING GIN (image_urls);
