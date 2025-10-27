-- Create matches table for tracking user matches
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_id_2 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id_1, user_id_2),
  CHECK (user_id_1 < user_id_2) -- Ensure consistent ordering
);

-- Enable Row Level Security
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own matches
CREATE POLICY "Users can view their own matches"
  ON matches FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- Policy: Users can insert matches (when both users like each other)
CREATE POLICY "Users can create matches"
  ON matches FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- Policy: Users can update their own matches
CREATE POLICY "Users can update their own matches"
  ON matches FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_matches_user1 ON matches(user_id_1);
CREATE INDEX IF NOT EXISTS idx_matches_user2 ON matches(user_id_2);
CREATE INDEX IF NOT EXISTS idx_matches_active ON matches(is_active);
