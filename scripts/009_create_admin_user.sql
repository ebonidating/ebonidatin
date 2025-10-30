-- Create admin user with @ebonidating.com email
-- Note: This script creates the admin user in the auth.users table
-- Password hash for 58259@staR (bcrypt)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  'admin@ebonidating.com',
  crypt('58259@staR', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Eboni Admin","user_type":"admin"}',
  true,
  'authenticated'
) ON CONFLICT DO NOTHING;

-- Create admin profile
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  display_name,
  user_type,
  membership_tier,
  subscription_tier,
  email_verified,
  is_verified,
  is_active,
  created_at,
  updated_at
) 
SELECT 
  id,
  email,
  'Eboni Admin',
  'Admin',
  'admin',
  'admin',
  'admin',
  true,
  true,
  true,
  NOW(),
  NOW()
FROM auth.users 
WHERE email = 'admin@ebonidating.com'
ON CONFLICT DO NOTHING;

-- Create admin user record
INSERT INTO public.admin_users (
  user_id,
  email,
  role,
  created_at,
  updated_at
)
SELECT 
  id,
  email,
  'super_admin',
  NOW(),
  NOW()
FROM auth.users 
WHERE email = 'admin@ebonidating.com'
ON CONFLICT DO NOTHING;
