/*
  # Comprehensive Solace Journal Database Schema

  1. New Tables
    - `profiles` - Extended user profiles with birthday tracking
    - `journal_entries` - Journal entries with enhanced metadata
    - `mood_analytics` - Daily mood tracking and happiness index
    - `monthly_rewinds` - Generated monthly wellness reports
    - `daily_prompts` - Customizable daily prompts
    - `user_preferences` - User settings and preferences
    - `wellness_metrics` - Detailed wellness tracking
    - `entry_tags` - Tagging system for entries
    - `ai_interactions` - Track AI conversation history

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text NOT NULL,
  email text NOT NULL,
  date_of_birth date NOT NULL,
  occupation text,
  location text,
  bio text,
  avatar_url text,
  recovery_email text,
  recovery_phone text,
  timezone text DEFAULT 'UTC',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  ai_tone text DEFAULT 'calm' CHECK (ai_tone IN ('calm', 'cheerful', 'thoughtful')),
  notifications_enabled boolean DEFAULT true,
  dark_mode boolean DEFAULT false,
  show_all_entries boolean DEFAULT false,
  daily_reminder_time time DEFAULT '20:00:00',
  privacy_level text DEFAULT 'private' CHECK (privacy_level IN ('private', 'friends', 'public')),
  language text DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create journal entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text,
  content text NOT NULL,
  mood text NOT NULL CHECK (mood IN ('happy', 'neutral', 'sad')),
  happiness_score integer CHECK (happiness_score >= 1 AND happiness_score <= 10),
  ai_response text,
  summary text,
  highlights text[],
  entry_type text DEFAULT 'text' CHECK (entry_type IN ('text', 'audio', 'photo')),
  audio_url text,
  photo_urls text[],
  transcription text,
  word_count integer DEFAULT 0,
  reading_time_minutes integer DEFAULT 0,
  is_favorite boolean DEFAULT false,
  is_private boolean DEFAULT true,
  weather text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create mood analytics table for daily tracking
CREATE TABLE IF NOT EXISTS mood_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  dominant_mood text CHECK (dominant_mood IN ('happy', 'neutral', 'sad')),
  happiness_index numeric(3,2) CHECK (happiness_index >= 0 AND happiness_index <= 10),
  entry_count integer DEFAULT 0,
  mood_distribution jsonb DEFAULT '{"happy": 0, "neutral": 0, "sad": 0}',
  wellness_score numeric(3,2) CHECK (wellness_score >= 0 AND wellness_score <= 10),
  sleep_quality integer CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  stress_level integer CHECK (stress_level >= 1 AND stress_level <= 5),
  energy_level integer CHECK (energy_level >= 1 AND energy_level <= 5),
  social_interaction integer CHECK (social_interaction >= 1 AND social_interaction <= 5),
  physical_activity integer CHECK (physical_activity >= 1 AND physical_activity <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create monthly rewinds table
CREATE TABLE IF NOT EXISTS monthly_rewinds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  year integer NOT NULL,
  total_entries integer DEFAULT 0,
  mood_summary jsonb DEFAULT '{"happy": 0, "neutral": 0, "sad": 0}',
  average_happiness_index numeric(3,2),
  wellness_report text,
  key_insights text[],
  mood_trends jsonb,
  personal_growth_notes text,
  challenges_overcome text[],
  gratitude_highlights text[],
  goals_for_next_month text[],
  ai_generated_summary text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, month, year)
);

-- Create daily prompts table
CREATE TABLE IF NOT EXISTS daily_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_text text NOT NULL,
  category text DEFAULT 'general',
  difficulty_level text DEFAULT 'easy' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  tags text[],
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES profiles(id),
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create wellness metrics table
CREATE TABLE IF NOT EXISTS wellness_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  meditation_minutes integer DEFAULT 0,
  exercise_minutes integer DEFAULT 0,
  social_time_minutes integer DEFAULT 0,
  outdoor_time_minutes integer DEFAULT 0,
  screen_time_minutes integer DEFAULT 0,
  water_intake_glasses integer DEFAULT 0,
  sleep_hours numeric(3,1) DEFAULT 0,
  gratitude_count integer DEFAULT 0,
  stress_triggers text[],
  coping_strategies_used text[],
  achievements text[],
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create entry tags table
CREATE TABLE IF NOT EXISTS entry_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tag_name text NOT NULL,
  color text DEFAULT '#6366f1',
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tag_name)
);

-- Create junction table for entry-tag relationships
CREATE TABLE IF NOT EXISTS journal_entry_tags (
  entry_id uuid REFERENCES journal_entries(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES entry_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (entry_id, tag_id)
);

-- Create AI interactions table
CREATE TABLE IF NOT EXISTS ai_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  entry_id uuid REFERENCES journal_entries(id) ON DELETE CASCADE,
  interaction_type text NOT NULL CHECK (interaction_type IN ('mood_analysis', 'audio_transcription', 'wellness_advice', 'monthly_summary')),
  input_data text,
  ai_response text,
  confidence_score numeric(3,2),
  processing_time_ms integer,
  model_version text,
  created_at timestamptz DEFAULT now()
);

-- Create birthday celebrations table
CREATE TABLE IF NOT EXISTS birthday_celebrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  celebration_year integer NOT NULL,
  special_message text,
  achievements_summary text,
  year_in_review text,
  mood_journey_summary text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, celebration_year)
);

-- Enable Row Level Security
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

-- Create RLS Policies

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

-- Daily prompts policies (read-only for users, admin can manage)
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_date ON journal_entries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mood_analytics_user_date ON mood_analytics(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_monthly_rewinds_user_period ON monthly_rewinds(user_id, year DESC, month DESC);
CREATE INDEX IF NOT EXISTS idx_wellness_metrics_user_date ON wellness_metrics(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_type ON ai_interactions(user_id, interaction_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_birthday ON profiles(date_of_birth);

-- Insert default daily prompts
INSERT INTO daily_prompts (prompt_text, category, tags) VALUES
  ('What made you smile today?', 'gratitude', ARRAY['happiness', 'gratitude']),
  ('Describe a moment that brought you peace.', 'mindfulness', ARRAY['peace', 'mindfulness']),
  ('What are you grateful for right now?', 'gratitude', ARRAY['gratitude', 'appreciation']),
  ('What was challenging about today and how did you handle it?', 'reflection', ARRAY['challenges', 'growth']),
  ('If you could change one thing about today, what would it be?', 'reflection', ARRAY['improvement', 'reflection']),
  ('What are you looking forward to tomorrow?', 'future', ARRAY['anticipation', 'goals']),
  ('What did you learn about yourself today?', 'self-discovery', ARRAY['learning', 'self-awareness']),
  ('How did you take care of yourself today?', 'self-care', ARRAY['self-care', 'wellness']),
  ('What emotions did you experience most strongly today?', 'emotions', ARRAY['emotions', 'awareness']),
  ('What would you tell your past self about today?', 'wisdom', ARRAY['wisdom', 'growth']),
  ('Describe a person who made your day better.', 'relationships', ARRAY['relationships', 'gratitude']),
  ('What small victory can you celebrate today?', 'achievements', ARRAY['success', 'celebration']),
  ('How did you step out of your comfort zone today?', 'growth', ARRAY['courage', 'growth']),
  ('What are three things that went well today?', 'positivity', ARRAY['positivity', 'gratitude']),
  ('How did you show kindness to yourself or others today?', 'kindness', ARRAY['kindness', 'compassion'])
ON CONFLICT DO NOTHING;

-- Create functions for automatic updates

-- Function to update happiness index based on mood
CREATE OR REPLACE FUNCTION update_happiness_index()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate happiness score based on mood
  NEW.happiness_score = CASE 
    WHEN NEW.mood = 'happy' THEN GREATEST(7, COALESCE(NEW.happiness_score, 8))
    WHEN NEW.mood = 'neutral' THEN GREATEST(4, COALESCE(NEW.happiness_score, 5))
    WHEN NEW.mood = 'sad' THEN LEAST(4, COALESCE(NEW.happiness_score, 3))
    ELSE COALESCE(NEW.happiness_score, 5)
  END;
  
  -- Calculate word count
  NEW.word_count = array_length(string_to_array(NEW.content, ' '), 1);
  
  -- Calculate reading time (average 200 words per minute)
  NEW.reading_time_minutes = GREATEST(1, NEW.word_count / 200);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for journal entries
CREATE TRIGGER trigger_update_happiness_index
  BEFORE INSERT OR UPDATE ON journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_happiness_index();

-- Function to update mood analytics daily
CREATE OR REPLACE FUNCTION update_daily_mood_analytics()
RETURNS TRIGGER AS $$
DECLARE
  entry_date date;
  mood_counts jsonb;
  total_entries integer;
  avg_happiness numeric;
BEGIN
  entry_date = NEW.created_at::date;
  
  -- Calculate mood distribution for the day
  SELECT 
    jsonb_build_object(
      'happy', COUNT(*) FILTER (WHERE mood = 'happy'),
      'neutral', COUNT(*) FILTER (WHERE mood = 'neutral'),
      'sad', COUNT(*) FILTER (WHERE mood = 'sad')
    ),
    COUNT(*),
    AVG(happiness_score)
  INTO mood_counts, total_entries, avg_happiness
  FROM journal_entries 
  WHERE user_id = NEW.user_id 
    AND created_at::date = entry_date;
  
  -- Determine dominant mood
  INSERT INTO mood_analytics (
    user_id, 
    date, 
    dominant_mood, 
    happiness_index, 
    entry_count, 
    mood_distribution
  )
  VALUES (
    NEW.user_id,
    entry_date,
    CASE 
      WHEN (mood_counts->>'happy')::int >= (mood_counts->>'neutral')::int 
        AND (mood_counts->>'happy')::int >= (mood_counts->>'sad')::int THEN 'happy'
      WHEN (mood_counts->>'sad')::int > (mood_counts->>'neutral')::int THEN 'sad'
      ELSE 'neutral'
    END,
    avg_happiness,
    total_entries,
    mood_counts
  )
  ON CONFLICT (user_id, date) 
  DO UPDATE SET
    dominant_mood = EXCLUDED.dominant_mood,
    happiness_index = EXCLUDED.happiness_index,
    entry_count = EXCLUDED.entry_count,
    mood_distribution = EXCLUDED.mood_distribution,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for mood analytics
CREATE TRIGGER trigger_update_daily_mood_analytics
  AFTER INSERT OR UPDATE ON journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_daily_mood_analytics();

-- Function to check for birthdays and create celebrations
CREATE OR REPLACE FUNCTION check_birthday_celebration()
RETURNS void AS $$
DECLARE
  user_record RECORD;
  current_year integer;
BEGIN
  current_year := EXTRACT(year FROM CURRENT_DATE);
  
  FOR user_record IN 
    SELECT id, full_name, date_of_birth
    FROM profiles 
    WHERE EXTRACT(month FROM date_of_birth) = EXTRACT(month FROM CURRENT_DATE)
      AND EXTRACT(day FROM date_of_birth) = EXTRACT(day FROM CURRENT_DATE)
  LOOP
    INSERT INTO birthday_celebrations (
      user_id, 
      celebration_year, 
      special_message,
      created_at
    )
    VALUES (
      user_record.id,
      current_year,
      'Happy Birthday! 🎉 Another year of growth, reflection, and beautiful moments captured in your journal.',
      CURRENT_TIMESTAMP
    )
    ON CONFLICT (user_id, celebration_year) DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql;