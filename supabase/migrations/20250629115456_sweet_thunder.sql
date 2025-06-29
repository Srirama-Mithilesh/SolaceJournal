/*
  # Safe Policy Creation for Solace Journal

  This migration safely creates or updates policies without conflicts.
  It drops existing policies first, then recreates them to ensure consistency.

  1. Drop existing policies if they exist
  2. Recreate all policies with proper permissions
  3. Ensure all tables have proper RLS enabled
*/

-- Drop existing policies if they exist (safe approach)
DO $$ 
BEGIN
  -- Drop profiles policies
  DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
  
  -- Drop user preferences policies
  DROP POLICY IF EXISTS "Users can manage own preferences" ON user_preferences;
  
  -- Drop journal entries policies
  DROP POLICY IF EXISTS "Users can manage own journal entries" ON journal_entries;
  
  -- Drop mood analytics policies
  DROP POLICY IF EXISTS "Users can manage own mood analytics" ON mood_analytics;
  
  -- Drop monthly rewinds policies
  DROP POLICY IF EXISTS "Users can manage own monthly rewinds" ON monthly_rewinds;
  
  -- Drop daily prompts policies
  DROP POLICY IF EXISTS "Users can read daily prompts" ON daily_prompts;
  
  -- Drop wellness metrics policies
  DROP POLICY IF EXISTS "Users can manage own wellness metrics" ON wellness_metrics;
  
  -- Drop entry tags policies
  DROP POLICY IF EXISTS "Users can manage own tags" ON entry_tags;
  
  -- Drop journal entry tags policies
  DROP POLICY IF EXISTS "Users can manage own entry tags" ON journal_entry_tags;
  
  -- Drop AI interactions policies
  DROP POLICY IF EXISTS "Users can read own AI interactions" ON ai_interactions;
  DROP POLICY IF EXISTS "Users can insert own AI interactions" ON ai_interactions;
  
  -- Drop birthday celebrations policies
  DROP POLICY IF EXISTS "Users can manage own birthday celebrations" ON birthday_celebrations;
END $$;

-- Ensure RLS is enabled on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_rewinds ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entry_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE birthday_celebrations ENABLE ROW LEVEL SECURITY;

-- Create fresh policies

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- User preferences policies
CREATE POLICY "Users can manage own preferences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Journal entries policies
CREATE POLICY "Users can manage own journal entries"
  ON journal_entries
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Mood analytics policies
CREATE POLICY "Users can manage own mood analytics"
  ON mood_analytics
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Monthly rewinds policies
CREATE POLICY "Users can manage own monthly rewinds"
  ON monthly_rewinds
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Daily prompts policies (read-only for users)
CREATE POLICY "Users can read daily prompts"
  ON daily_prompts
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Wellness metrics policies
CREATE POLICY "Users can manage own wellness metrics"
  ON wellness_metrics
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Entry tags policies
CREATE POLICY "Users can manage own tags"
  ON entry_tags
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Journal entry tags policies
CREATE POLICY "Users can manage own entry tags"
  ON journal_entry_tags
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM journal_entries 
      WHERE id = entry_id AND user_id = auth.uid()
    )
  );

-- AI interactions policies
CREATE POLICY "Users can read own AI interactions"
  ON ai_interactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI interactions"
  ON ai_interactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Birthday celebrations policies
CREATE POLICY "Users can manage own birthday celebrations"
  ON birthday_celebrations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure helper function exists for incrementing tag usage
CREATE OR REPLACE FUNCTION increment_tag_usage(tag_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE entry_tags 
  SET usage_count = usage_count + 1 
  WHERE id = tag_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;