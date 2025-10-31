-- Realtime and notification triggers
-- Enables realtime features for messaging and notifications

-- Enable realtime on key tables (if not already enabled)
ALTER PUBLICATION supabase_realtime ADD TABLE messaging.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE messaging.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE messaging.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE social.likes;
ALTER PUBLICATION supabase_realtime ADD TABLE social.post_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE social.user_follows;

-- Create notifications table for push notifications
CREATE TABLE IF NOT EXISTS public.push_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES core.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_push_notifications_user_id ON public.push_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_push_notifications_read ON public.push_notifications(read);
CREATE INDEX IF NOT EXISTS idx_push_notifications_created_at ON public.push_notifications(created_at DESC);

-- Enable RLS on push notifications
ALTER TABLE public.push_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own_notifications" ON public.push_notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "users_update_own_notifications" ON public.push_notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "service_role_all_notifications" ON public.push_notifications
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES core.profiles(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  new_message BOOLEAN DEFAULT true,
  new_match BOOLEAN DEFAULT true,
  new_like BOOLEAN DEFAULT true,
  new_follower BOOLEAN DEFAULT true,
  new_comment BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on notification preferences
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_manage_own_preferences" ON public.notification_preferences
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Function to create notification
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_title TEXT,
  p_body TEXT,
  p_data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO public.push_notifications (user_id, title, body, data)
  VALUES (p_user_id, p_title, p_body, p_data)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for new message notification
CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS TRIGGER AS $$
DECLARE
  v_sender_name TEXT;
  v_prefs RECORD;
BEGIN
  -- Get sender name
  SELECT display_name, full_name INTO v_sender_name
  FROM core.profiles
  WHERE id = NEW.sender_id;
  
  v_sender_name := COALESCE(v_sender_name, 'Someone');

  -- Check notification preferences
  SELECT * INTO v_prefs
  FROM public.notification_preferences
  WHERE user_id = NEW.receiver_id;

  -- Create notification if user wants them
  IF v_prefs.new_message THEN
    PERFORM public.create_notification(
      NEW.receiver_id,
      'New Message',
      v_sender_name || ' sent you a message',
      jsonb_build_object(
        'type', 'new_message',
        'sender_id', NEW.sender_id,
        'message_id', NEW.id
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new messages
DROP TRIGGER IF EXISTS on_new_message_notification ON messaging.messages;
CREATE TRIGGER on_new_message_notification
  AFTER INSERT ON messaging.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_message();

-- Trigger function for new match notification
CREATE OR REPLACE FUNCTION public.notify_new_match()
RETURNS TRIGGER AS $$
DECLARE
  v_user1_name TEXT;
  v_user2_name TEXT;
  v_prefs1 RECORD;
  v_prefs2 RECORD;
BEGIN
  -- Get user names
  SELECT display_name, full_name INTO v_user1_name
  FROM core.profiles
  WHERE id = NEW.user_id_1;

  SELECT display_name, full_name INTO v_user2_name
  FROM core.profiles
  WHERE id = NEW.user_id_2;

  v_user1_name := COALESCE(v_user1_name, 'Someone');
  v_user2_name := COALESCE(v_user2_name, 'Someone');

  -- Get notification preferences
  SELECT * INTO v_prefs1
  FROM public.notification_preferences
  WHERE user_id = NEW.user_id_1;

  SELECT * INTO v_prefs2
  FROM public.notification_preferences
  WHERE user_id = NEW.user_id_2;

  -- Notify both users
  IF v_prefs1.new_match THEN
    PERFORM public.create_notification(
      NEW.user_id_1,
      'New Match!',
      'You matched with ' || v_user2_name,
      jsonb_build_object(
        'type', 'new_match',
        'match_id', NEW.id,
        'user_id', NEW.user_id_2
      )
    );
  END IF;

  IF v_prefs2.new_match THEN
    PERFORM public.create_notification(
      NEW.user_id_2,
      'New Match!',
      'You matched with ' || v_user1_name,
      jsonb_build_object(
        'type', 'new_match',
        'match_id', NEW.id,
        'user_id', NEW.user_id_1
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new matches
DROP TRIGGER IF EXISTS on_new_match_notification ON messaging.matches;
CREATE TRIGGER on_new_match_notification
  AFTER INSERT ON messaging.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_match();

-- Trigger function for new follower notification
CREATE OR REPLACE FUNCTION public.notify_new_follower()
RETURNS TRIGGER AS $$
DECLARE
  v_follower_name TEXT;
  v_prefs RECORD;
BEGIN
  -- Get follower name
  SELECT display_name, full_name INTO v_follower_name
  FROM core.profiles
  WHERE id = NEW.follower_id;

  v_follower_name := COALESCE(v_follower_name, 'Someone');

  -- Check notification preferences
  SELECT * INTO v_prefs
  FROM public.notification_preferences
  WHERE user_id = NEW.following_id;

  IF v_prefs.new_follower THEN
    PERFORM public.create_notification(
      NEW.following_id,
      'New Follower',
      v_follower_name || ' started following you',
      jsonb_build_object(
        'type', 'new_follower',
        'follower_id', NEW.follower_id
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new followers
DROP TRIGGER IF EXISTS on_new_follower_notification ON social.user_follows;
CREATE TRIGGER on_new_follower_notification
  AFTER INSERT ON social.user_follows
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_follower();

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.create_notification(UUID, TEXT, TEXT, JSONB) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.notify_new_message() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.notify_new_match() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.notify_new_follower() TO authenticated, service_role;
