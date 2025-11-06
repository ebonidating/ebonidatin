-- ============================================================
-- ADMIN USER SETUP FOR EBONI DATING
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'moderator', 'support')),
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create reports table if it doesn't exist
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reported_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reported_content_id UUID,
  content_type TEXT CHECK (content_type IN ('profile', 'message', 'photo', 'behavior')),
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES admin_users(user_id),
  reviewed_at TIMESTAMPTZ,
  action_taken TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create admin_logs table for audit trail
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(user_id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_reported_user ON reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON admin_logs(created_at DESC);

-- 5. Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for admin_users
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT user_id FROM admin_users WHERE is_active = true
    )
  );

-- 7. Create RLS policies for reports
DROP POLICY IF EXISTS "Admins can view reports" ON reports;
CREATE POLICY "Admins can view reports"
  ON reports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins can update reports" ON reports;
CREATE POLICY "Admins can update reports"
  ON reports FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- 8. Create or update admin user
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- First, check if the user exists in auth.users
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'info@ebonidating.com';

  -- If user doesn't exist in auth.users, we need to create it via Supabase Auth
  -- For now, we'll insert a placeholder admin_users entry
  -- You'll need to create the actual auth user separately
  
  IF admin_user_id IS NULL THEN
    RAISE NOTICE 'Admin user not found in auth.users. You need to:';
    RAISE NOTICE '1. Sign up at /auth/sign-up with email: info@ebonidating.com';
    RAISE NOTICE '2. Then run this script again to grant admin privileges';
  ELSE
    -- User exists, grant admin privileges
    INSERT INTO admin_users (user_id, email, role, permissions, is_active)
    VALUES (
      admin_user_id,
      'info@ebonidating.com',
      'super_admin',
      '{
        "manage_users": true,
        "manage_content": true,
        "view_reports": true,
        "manage_reports": true,
        "manage_admins": true,
        "view_analytics": true,
        "manage_subscriptions": true,
        "delete_accounts": true,
        "ban_users": true,
        "manage_settings": true
      }'::jsonb,
      true
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
      role = 'super_admin',
      permissions = '{
        "manage_users": true,
        "manage_content": true,
        "view_reports": true,
        "manage_reports": true,
        "manage_admins": true,
        "view_analytics": true,
        "manage_subscriptions": true,
        "delete_accounts": true,
        "ban_users": true,
        "manage_settings": true
      }'::jsonb,
      is_active = true,
      updated_at = NOW();
    
    RAISE NOTICE 'Admin user configured successfully!';
  END IF;
END $$;

-- 9. Create function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  p_admin_id UUID,
  p_action TEXT,
  p_target_type TEXT DEFAULT NULL,
  p_target_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO admin_logs (admin_id, action, target_type, target_id, details, ip_address)
  VALUES (p_admin_id, p_action, p_target_type, p_target_id, p_details, p_ip_address)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Verify setup
SELECT 
  'Admin users table' as item,
  COUNT(*) as count
FROM admin_users
UNION ALL
SELECT 
  'Reports table',
  COUNT(*)
FROM reports
UNION ALL
SELECT 
  'Admin logs table',
  COUNT(*)
FROM admin_logs;

-- 11. Show admin users
SELECT 
  email,
  role,
  is_active,
  created_at
FROM admin_users
ORDER BY created_at DESC;

-- Success message
SELECT '✅ Admin setup completed!' as status;
SELECT 'Next steps:' as next_step;
SELECT '1. Create auth user at /auth/sign-up with email: info@ebonidating.com and password: 58259@staR' as step_1;
SELECT '2. After signup, run this script again to grant admin privileges' as step_2;
SELECT '3. Login at /admin/login with the same credentials' as step_3;
