-- Create likes table for tracking user likes/swipes
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  liker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  liked_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  liked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(liker_id, liked_id)
);

-- Enable Row Level Security
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view likes they've given
CREATE POLICY "Users can view their own likes"
  ON likes FOR SELECT
  TO authenticated
  USING (auth.uid() = liker_id);

-- Policy: Users can insert their own likes
CREATE POLICY "Users can insert their own likes"
  ON likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = liker_id);

-- Policy: Users can delete their own likes
CREATE POLICY "Users can delete their own likes"
  ON likes FOR DELETE
  TO authenticated
  USING (auth.uid() = liker_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_likes_liker ON likes(liker_id);
CREATE INDEX IF NOT EXISTS idx_likes_liked ON likes(liked_id);

-- Function to create a match when both users like each other
CREATE OR REPLACE FUNCTION check_mutual_like()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the liked user has also liked the liker
  IF EXISTS (
    SELECT 1 FROM likes
    WHERE liker_id = NEW.liked_id AND liked_id = NEW.liker_id
  ) THEN
    -- Create a match (ensure user_id_1 < user_id_2)
    INSERT INTO matches (user_id_1, user_id_2)
    VALUES (
      LEAST(NEW.liker_id, NEW.liked_id),
      GREATEST(NEW.liker_id, NEW.liked_id)
    )
    ON CONFLICT (user_id_1, user_id_2) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to check for mutual likes
CREATE TRIGGER check_mutual_like_trigger
  AFTER INSERT ON likes
  FOR EACH ROW
  EXECUTE FUNCTION check_mutual_like();
