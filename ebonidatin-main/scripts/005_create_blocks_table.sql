-- Create blocks table for users to block others
CREATE TABLE IF NOT EXISTS blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reason TEXT,
  UNIQUE(blocker_id, blocked_id)
);

-- Enable Row Level Security
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own blocks
CREATE POLICY "Users can view their own blocks"
  ON blocks FOR SELECT
  TO authenticated
  USING (auth.uid() = blocker_id);

-- Policy: Users can insert their own blocks
CREATE POLICY "Users can insert their own blocks"
  ON blocks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = blocker_id);

-- Policy: Users can delete their own blocks
CREATE POLICY "Users can delete their own blocks"
  ON blocks FOR DELETE
  TO authenticated
  USING (auth.uid() = blocker_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_blocks_blocker ON blocks(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocks_blocked ON blocks(blocked_id);
