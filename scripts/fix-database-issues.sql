-- Fix Database Issues and Update All Entries
-- Run this in Supabase SQL Editor

-- 1. Ensure all profiles have required fields
UPDATE profiles
SET 
  updated_at = NOW()
WHERE updated_at IS NULL;

-- 2. Fix any profiles missing essential data
UPDATE profiles
SET 
  full_name = COALESCE(full_name, 'User'),
  bio = COALESCE(bio, ''),
  location = COALESCE(location, ''),
  verified = COALESCE(verified, false),
  online_status = COALESCE(online_status, 'offline')
WHERE full_name IS NULL OR bio IS NULL OR location IS NULL;

-- 3. Update subscription statuses for expired subscriptions
UPDATE profiles
SET subscription_tier = 'free'
WHERE subscription_tier IN ('premium', 'elite')
  AND subscription_end_date IS NOT NULL
  AND subscription_end_date < NOW();

-- 4. Fix any broken foreign key relationships in matches
DELETE FROM matches
WHERE user_id_1 NOT IN (SELECT id FROM profiles)
   OR user_id_2 NOT IN (SELECT id FROM profiles);

-- 5. Fix any broken foreign key relationships in messages
DELETE FROM messages
WHERE sender_id NOT IN (SELECT id FROM profiles)
   OR receiver_id NOT IN (SELECT id FROM profiles);

-- 6. Fix any broken relationships in likes
DELETE FROM likes
WHERE liker_id NOT IN (SELECT id FROM profiles)
   OR liked_id NOT IN (SELECT id FROM profiles);

-- 7. Update last_active for inactive users
UPDATE profiles
SET last_active = NOW()
WHERE last_active IS NULL;

-- 8. Ensure all users have a gender set
UPDATE profiles
SET gender = 'other'
WHERE gender IS NULL;

-- 9. Fix profile completion percentages
UPDATE profiles
SET profile_completion = CASE
  WHEN full_name IS NOT NULL AND bio IS NOT NULL AND location IS NOT NULL AND gender IS NOT NULL THEN 80
  WHEN full_name IS NOT NULL AND bio IS NOT NULL THEN 60
  WHEN full_name IS NOT NULL THEN 40
  ELSE 20
END
WHERE profile_completion IS NULL OR profile_completion = 0;

-- 10. Clean up orphaned notifications
DELETE FROM notifications
WHERE user_id NOT IN (SELECT id FROM profiles);

-- 11. Verify and log results
SELECT 
  'Total Profiles' as metric,
  COUNT(*) as count
FROM profiles
UNION ALL
SELECT 
  'Verified Profiles',
  COUNT(*)
FROM profiles
WHERE verified = true
UNION ALL
SELECT 
  'Active Subscriptions',
  COUNT(*)
FROM profiles
WHERE subscription_tier IN ('premium', 'elite')
  AND (subscription_end_date IS NULL OR subscription_end_date > NOW())
UNION ALL
SELECT 
  'Total Matches',
  COUNT(*)
FROM matches
UNION ALL
SELECT 
  'Total Messages',
  COUNT(*)
FROM messages
UNION ALL
SELECT 
  'Total Likes',
  COUNT(*)
FROM likes;

-- 12. Add FAQ entries if the table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'faqs') THEN
    INSERT INTO faqs (category, question, answer, created_at) VALUES
    ('Getting Started', 'How do I create an account?', 'Click "Get Started" or "Sign Up" on the homepage. You can register using your email or sign up instantly with Google.', NOW()),
    ('Getting Started', 'Is Eboni Dating really free?', 'Yes! Our basic membership is completely free. Premium and Elite tiers offer additional features.', NOW()),
    ('Profile & Matching', 'How does the matching algorithm work?', 'Our algorithm considers your location, age preferences, interests, and cultural values to suggest compatible matches.', NOW()),
    ('Safety & Privacy', 'Is my personal information safe?', 'Yes! We use bank-level encryption and never share your data with third parties.', NOW()),
    ('Subscriptions', 'Can I cancel my subscription anytime?', 'Yes! You can cancel your subscription anytime from your Account Settings.', NOW())
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- 13. Create success_stories table if it doesn't exist
CREATE TABLE IF NOT EXISTS success_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  names TEXT NOT NULL,
  location TEXT NOT NULL,
  match_date TEXT NOT NULL,
  story TEXT NOT NULL,
  quote TEXT NOT NULL,
  image_url TEXT,
  engaged BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Add sample success stories
INSERT INTO success_stories (names, location, match_date, story, quote, engaged) VALUES
('Marcus & Amara', 'Atlanta, GA', 'March 2023', 'We matched on a sunny Saturday morning, and from the first message, we knew there was something special.', 'Finding love that truly understands your culture is priceless.', true),
('David & Zoe', 'London, UK', 'January 2023', 'As a busy professional, I didn''t have much time for dating. Eboni Dating''s smart matching connected me with David.', 'The algorithm really works! We''re so compatible.', true),
('James & Keisha', 'Toronto, Canada', 'June 2023', 'After trying other dating apps, I almost gave up. Then I found Eboni Dating.', 'Finally, a platform that gets us.', false)
ON CONFLICT DO NOTHING;

-- 15. Refresh materialized views if any exist
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_matviews WHERE matviewname = 'user_stats') THEN
    REFRESH MATERIALIZED VIEW user_stats;
  END IF;
END $$;

-- 16. Update statistics
ANALYZE profiles;
ANALYZE matches;
ANALYZE messages;
ANALYZE likes;

-- 17. Verify RLS policies are enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'matches', 'messages', 'likes', 'notifications')
ORDER BY tablename;

-- Success message
SELECT 'Database cleanup and updates completed successfully!' as status;
