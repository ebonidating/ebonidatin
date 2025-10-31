-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy: Public can view verified user profiles (for discovery)
CREATE POLICY "Public can view verified profiles" ON profiles
  FOR SELECT USING (email_verified = true);

-- Enable RLS on email_verifications table
ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own verification records
CREATE POLICY "Users can view own verifications" ON email_verifications
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Service role can manage verifications
CREATE POLICY "Service role can manage verifications" ON email_verifications
  FOR ALL USING (auth.role() = 'service_role');
