-- Create schema if not exists (safety)
CREATE SCHEMA IF NOT EXISTS public;

-- Drop old version if exists
DROP FUNCTION IF EXISTS public.get_unread_count(uuid);

-- Create the new function
CREATE OR REPLACE FUNCTION public.get_unread_count(p_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(*)::integer
  FROM messaging.messages
  WHERE receiver_id = p_user_id
    AND is_read = false;
$$;

-- Optional: grant permissions
GRANT EXECUTE ON FUNCTION public.get_unread_count(uuid) TO anon, authenticated, service_role;
