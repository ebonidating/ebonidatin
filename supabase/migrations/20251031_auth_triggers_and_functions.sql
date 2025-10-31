-- Auth triggers and functions for user management
-- Creates automatic profile creation and management

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO core.profiles (
    id,
    email,
    full_name,
    email_verified,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.email_confirmed_at IS NOT NULL), false),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to sync email verification status
CREATE OR REPLACE FUNCTION public.sync_email_verification()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE core.profiles
  SET email_verified = true
  WHERE id = NEW.id
  AND NEW.email_confirmed_at IS NOT NULL
  AND OLD.email_confirmed_at IS NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for email verification
DROP TRIGGER IF EXISTS on_email_verified ON auth.users;
CREATE TRIGGER on_email_verified
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL)
  EXECUTE FUNCTION public.sync_email_verification();

-- Function to update last_active timestamp
CREATE OR REPLACE FUNCTION public.update_last_active()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE core.profiles
  SET last_active = NOW()
  WHERE id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle user deletion (cleanup)
CREATE OR REPLACE FUNCTION public.handle_user_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Profile will be deleted automatically via CASCADE
  -- But we can log or do other cleanup here
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for user deletion
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_delete();

-- Function to check if user is blocked
CREATE OR REPLACE FUNCTION public.is_blocked(user_id_1 UUID, user_id_2 UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM social.blocks
    WHERE (blocker_id = user_id_1 AND blocked_id = user_id_2)
       OR (blocker_id = user_id_2 AND blocked_id = user_id_1)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get unread message count
CREATE OR REPLACE FUNCTION public.get_unread_count(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  count INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO count
  FROM messaging.messages
  WHERE receiver_id = user_uuid
  AND is_read = false;
  RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION public.mark_messages_read(sender_uuid UUID, receiver_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE messaging.messages
  SET is_read = true, read_at = NOW()
  WHERE sender_id = sender_uuid
  AND receiver_id = receiver_uuid
  AND is_read = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.sync_email_verification() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.update_last_active() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_user_delete() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_blocked(UUID, UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_unread_count(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.mark_messages_read(UUID, UUID) TO authenticated, service_role;
