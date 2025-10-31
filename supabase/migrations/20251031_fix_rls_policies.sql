-- Fix Row Level Security Policies for all tables
-- This migration adds missing RLS policies and fixes existing ones

-- Enable RLS on all tables first
ALTER TABLE messaging.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE messaging.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE social.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE social.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE social.post_comments ENABLE ROW LEVEL SECURITY;

-- MESSAGING.MESSAGES POLICIES
DROP POLICY IF EXISTS "messages_select" ON messaging.messages;
DROP POLICY IF EXISTS "messages_insert" ON messaging.messages;
DROP POLICY IF EXISTS "messages_update" ON messaging.messages;

CREATE POLICY "messages_select" ON messaging.messages
  FOR SELECT TO authenticated
  USING (
    auth.uid() = sender_id OR 
    auth.uid() = receiver_id
  );

CREATE POLICY "messages_insert" ON messaging.messages
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "messages_update" ON messaging.messages
  FOR UPDATE TO authenticated
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- MESSAGING.CHAT_MESSAGES POLICIES
DROP POLICY IF EXISTS "chat_messages_select" ON messaging.chat_messages;
DROP POLICY IF EXISTS "chat_messages_insert" ON messaging.chat_messages;
DROP POLICY IF EXISTS "chat_messages_update" ON messaging.chat_messages;

CREATE POLICY "chat_messages_select" ON messaging.chat_messages
  FOR SELECT TO authenticated
  USING (
    auth.uid() = sender_id OR 
    auth.uid() = receiver_id
  );

CREATE POLICY "chat_messages_insert" ON messaging.chat_messages
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "chat_messages_update" ON messaging.chat_messages
  FOR UPDATE TO authenticated
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- SOCIAL.BLOCKS POLICIES
DROP POLICY IF EXISTS "blocks_select" ON social.blocks;
DROP POLICY IF EXISTS "blocks_insert" ON social.blocks;
DROP POLICY IF EXISTS "blocks_delete" ON social.blocks;

CREATE POLICY "blocks_select" ON social.blocks
  FOR SELECT TO authenticated
  USING (auth.uid() = blocker_id);

CREATE POLICY "blocks_insert" ON social.blocks
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "blocks_delete" ON social.blocks
  FOR DELETE TO authenticated
  USING (auth.uid() = blocker_id);

-- SOCIAL.USER_FOLLOWS POLICIES
DROP POLICY IF EXISTS "user_follows_select" ON social.user_follows;
DROP POLICY IF EXISTS "user_follows_insert" ON social.user_follows;
DROP POLICY IF EXISTS "user_follows_delete" ON social.user_follows;

CREATE POLICY "user_follows_select" ON social.user_follows
  FOR SELECT TO authenticated
  USING (
    auth.uid() = follower_id OR 
    auth.uid() = following_id
  );

CREATE POLICY "user_follows_insert" ON social.user_follows
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "user_follows_delete" ON social.user_follows
  FOR DELETE TO authenticated
  USING (auth.uid() = follower_id);

-- SOCIAL.POST_COMMENTS POLICIES
DROP POLICY IF EXISTS "post_comments_select" ON social.post_comments;
DROP POLICY IF EXISTS "post_comments_insert" ON social.post_comments;
DROP POLICY IF EXISTS "post_comments_update" ON social.post_comments;
DROP POLICY IF EXISTS "post_comments_delete" ON social.post_comments;

CREATE POLICY "post_comments_select" ON social.post_comments
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "post_comments_insert" ON social.post_comments
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "post_comments_update" ON social.post_comments
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "post_comments_delete" ON social.post_comments
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Fix admin.reports policies to allow admins to review
DROP POLICY IF EXISTS "admin_can_review_reports" ON admin.reports;
CREATE POLICY "admin_can_review_reports" ON admin.reports
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin.admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Service role bypass for all tables
DROP POLICY IF EXISTS "service_role_all_messaging_messages" ON messaging.messages;
CREATE POLICY "service_role_all_messaging_messages" ON messaging.messages
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_chat_messages" ON messaging.chat_messages;
CREATE POLICY "service_role_all_chat_messages" ON messaging.chat_messages
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_blocks" ON social.blocks;
CREATE POLICY "service_role_all_blocks" ON social.blocks
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_comments" ON social.post_comments;
CREATE POLICY "service_role_all_comments" ON social.post_comments
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
