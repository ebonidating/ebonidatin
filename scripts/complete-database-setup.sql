-- ============================================================
-- EBONI DATING - COMPLETE DATABASE SETUP AND FIX
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- ============================================================
-- 1. CREATE ALL TABLES (if they don't exist)
-- ============================================================

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'non-binary', 'other')),
  phone TEXT,
  country TEXT,
  city TEXT,
  bio TEXT,
  interests TEXT[],
  looking_for TEXT,
  relationship_goals TEXT,
  avatar_url TEXT,
  photos TEXT[],
  verified BOOLEAN DEFAULT false,
  online_status TEXT DEFAULT 'offline' CHECK (online_status IN ('online', 'offline', 'away')),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'elite')),
  subscription_start_date TIMESTAMPTZ,
  subscription_end_date TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  profile_completion INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id_1 UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user_id_2 UUID REFERENCES profiles(id) ON DELETE CASCADE,
  matched_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unmatched', 'blocked')),
  compatibility_score INTEGER,
  UNIQUE(user_id_1, user_id_2),
  CHECK (user_id_1 < user_id_2)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'voice', 'video')),
  media_url TEXT,
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Likes table  
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  liker_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  liked_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  super_like BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(liker_id, liked_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQs table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  question TEXT NOT NULL UNIQUE,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Success Stories table
CREATE TABLE IF NOT EXISTS success_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  names TEXT NOT NULL,
  location TEXT NOT NULL,
  match_date TEXT NOT NULL,
  story TEXT NOT NULL,
  quote TEXT NOT NULL,
  image_url TEXT,
  engaged BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON profiles(verified);
CREATE INDEX IF NOT EXISTS idx_profiles_online_status ON profiles(online_status);
CREATE INDEX IF NOT EXISTS idx_matches_user1 ON matches(user_id_1);
CREATE INDEX IF NOT EXISTS idx_matches_user2 ON matches(user_id_2);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
CREATE INDEX IF NOT EXISTS idx_likes_liker ON likes(liker_id);
CREATE INDEX IF NOT EXISTS idx_likes_liked ON likes(liked_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- ============================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. CREATE RLS POLICIES
-- ============================================================

-- Profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Messages policies
DROP POLICY IF EXISTS "Users can view their own messages" ON messages;
CREATE POLICY "Users can view their own messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Likes policies
DROP POLICY IF EXISTS "Users can view likes" ON likes;
CREATE POLICY "Users can view likes"
  ON likes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can create likes" ON likes;
CREATE POLICY "Users can create likes"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = liker_id);

-- Notifications policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================
-- 5. CREATE FUNCTIONS AND TRIGGERS
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 6. INSERT SAMPLE DATA
-- ============================================================

-- Insert FAQs
INSERT INTO faqs (category, question, answer) VALUES
  ('Getting Started', 'How do I create an account?', 'Click "Get Started" or "Sign Up" on the homepage. You can register using your email or sign up instantly with Google. Fill in your basic information, verify your email (for email signups), and you''re ready to start connecting!'),
  ('Getting Started', 'Is Eboni Dating really free?', 'Yes! Our basic membership is completely free. You can create a profile, browse members, send likes, and send limited messages. Premium and Elite tiers offer additional features like unlimited messaging, advanced filters, and priority support.'),
  ('Getting Started', 'How do I verify my email?', 'After signing up with email, check your inbox for a verification link. Click it to verify your account. If you don''t see the email, check your spam folder. Google OAuth users are automatically verified.'),
  ('Profile & Matching', 'How does the matching algorithm work?', 'Our algorithm considers your location, age preferences, interests, relationship goals, and cultural values to suggest compatible matches. The more complete your profile, the better your matches!'),
  ('Profile & Matching', 'How do I complete my profile?', 'Go to your Dashboard > Edit Profile. Add photos, write a compelling bio, select your interests, and set your preferences. A complete profile gets up to 5x more matches!'),
  ('Safety & Privacy', 'Is my personal information safe?', 'Yes! We use bank-level encryption, never share your data with third parties, and comply with international privacy laws. Your email and phone number are never publicly visible.'),
  ('Safety & Privacy', 'How do I report suspicious profiles?', 'Click the three dots on any profile and select ''Report''. Our moderation team reviews all reports within 24 hours and takes appropriate action.'),
  ('Subscriptions', 'Can I cancel my subscription anytime?', 'Yes! You can cancel your subscription anytime from your Account Settings. You''ll continue to have premium access until the end of your billing period.'),
  ('Subscriptions', 'What payment methods do you accept?', 'We accept all major credit cards (Visa, Mastercard, Amex), debit cards, and digital wallets through our secure Stripe payment processor.')
ON CONFLICT (question) DO NOTHING;

-- Insert Success Stories
INSERT INTO success_stories (names, location, match_date, story, quote, engaged, featured) VALUES
  ('Marcus & Amara', 'Atlanta, GA', 'March 2023', 
   'We matched on a sunny Saturday morning, and from the first message, we knew there was something special. Marcus made me laugh with his witty opening line, and we talked for hours about everything from music to our dreams. Six months later, we''re planning our future together. Thank you, Eboni Dating, for bringing us together!',
   'Finding love that truly understands your culture is priceless. Eboni Dating made it possible.', 
   true, true),
  ('David & Zoe', 'London, UK', 'January 2023',
   'As a busy professional, I didn''t have much time for dating. Eboni Dating''s smart matching connected me with David, who shared my values and ambitions. We connected instantly over our love for African art and cuisine. Today, we''re engaged and couldn''t be happier!',
   'The algorithm really works! We''re so compatible, it''s like we''ve known each other forever.',
   true, true),
  ('James & Keisha', 'Toronto, Canada', 'June 2023',
   'After trying other dating apps, I almost gave up on online dating. Then I found Eboni Dating. The platform''s focus on the Black community made all the difference. Keisha''s profile caught my eye, and we bonded over our Caribbean heritage. We''re now planning to move in together!',
   'Finally, a platform that gets us. We''re building our future together, one day at a time.',
   false, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 7. FIX ANY EXISTING DATA ISSUES
-- ============================================================

-- Update profiles with missing data
UPDATE profiles
SET 
  full_name = COALESCE(full_name, 'User'),
  bio = COALESCE(bio, ''),
  verified = COALESCE(verified, false),
  online_status = COALESCE(online_status, 'offline'),
  last_active = COALESCE(last_active, NOW()),
  updated_at = NOW()
WHERE full_name IS NULL OR bio IS NULL OR verified IS NULL;

-- Update profile completion
UPDATE profiles
SET profile_completion = CASE
  WHEN full_name IS NOT NULL AND bio IS NOT NULL AND avatar_url IS NOT NULL AND array_length(photos, 1) > 0 THEN 100
  WHEN full_name IS NOT NULL AND bio IS NOT NULL AND avatar_url IS NOT NULL THEN 80
  WHEN full_name IS NOT NULL AND bio IS NOT NULL THEN 60
  WHEN full_name IS NOT NULL THEN 40
  ELSE 20
END
WHERE profile_completion = 0 OR profile_completion IS NULL;

-- Fix expired subscriptions
UPDATE profiles
SET subscription_tier = 'free'
WHERE subscription_tier IN ('premium', 'elite')
  AND subscription_end_date IS NOT NULL
  AND subscription_end_date < NOW();

-- ============================================================
-- 8. VERIFY DATABASE SETUP
-- ============================================================

-- Check table counts
SELECT 
  'Tables Created' as status,
  COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'matches', 'messages', 'likes', 'notifications', 'faqs', 'success_stories');

-- Check RLS status
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'matches', 'messages', 'likes', 'notifications')
ORDER BY tablename;

-- Get statistics
SELECT 
  'Total Profiles' as metric,
  COUNT(*) as count
FROM profiles
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
  'FAQ Entries',
  COUNT(*)
FROM faqs
UNION ALL
SELECT 
  'Success Stories',
  COUNT(*)
FROM success_stories;

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================

SELECT '✅ Database setup and update completed successfully!' as status;
SELECT 'All tables created, RLS enabled, sample data inserted' as message;
SELECT 'Your Eboni Dating database is ready!' as next_step;
