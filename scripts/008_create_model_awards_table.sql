-- Create model awards table
CREATE TABLE IF NOT EXISTS model_awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  award_type TEXT CHECK (award_type IN ('model_of_day', 'model_of_week', 'model_of_month')),
  likes_count INTEGER NOT NULL,
  awarded_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, award_type, DATE(awarded_at))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_model_awards_user_id ON model_awards(user_id);
CREATE INDEX IF NOT EXISTS idx_model_awards_award_type ON model_awards(award_type);
CREATE INDEX IF NOT EXISTS idx_model_awards_awarded_at ON model_awards(awarded_at DESC);
