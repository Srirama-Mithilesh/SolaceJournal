export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string
          email: string
          date_of_birth: string
          occupation: string | null
          location: string | null
          bio: string | null
          avatar_url: string | null
          recovery_email: string | null
          recovery_phone: string | null
          timezone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name: string
          email: string
          date_of_birth: string
          occupation?: string | null
          location?: string | null
          bio?: string | null
          avatar_url?: string | null
          recovery_email?: string | null
          recovery_phone?: string | null
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string
          email?: string
          date_of_birth?: string
          occupation?: string | null
          location?: string | null
          bio?: string | null
          avatar_url?: string | null
          recovery_email?: string | null
          recovery_phone?: string | null
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          ai_tone: string
          notifications_enabled: boolean
          dark_mode: boolean
          show_all_entries: boolean
          daily_reminder_time: string
          privacy_level: string
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ai_tone?: string
          notifications_enabled?: boolean
          dark_mode?: boolean
          show_all_entries?: boolean
          daily_reminder_time?: string
          privacy_level?: string
          language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ai_tone?: string
          notifications_enabled?: boolean
          dark_mode?: boolean
          show_all_entries?: boolean
          daily_reminder_time?: string
          privacy_level?: string
          language?: string
          created_at?: string
          updated_at?: string
        }
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          title: string | null
          content: string
          mood: string
          happiness_score: number | null
          ai_response: string | null
          summary: string | null
          highlights: string[] | null
          entry_type: string
          audio_url: string | null
          photo_urls: string[] | null
          transcription: string | null
          word_count: number
          reading_time_minutes: number
          is_favorite: boolean
          is_private: boolean
          weather: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          content: string
          mood: string
          happiness_score?: number | null
          ai_response?: string | null
          summary?: string | null
          highlights?: string[] | null
          entry_type?: string
          audio_url?: string | null
          photo_urls?: string[] | null
          transcription?: string | null
          word_count?: number
          reading_time_minutes?: number
          is_favorite?: boolean
          is_private?: boolean
          weather?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          content?: string
          mood?: string
          happiness_score?: number | null
          ai_response?: string | null
          summary?: string | null
          highlights?: string[] | null
          entry_type?: string
          audio_url?: string | null
          photo_urls?: string[] | null
          transcription?: string | null
          word_count?: number
          reading_time_minutes?: number
          is_favorite?: boolean
          is_private?: boolean
          weather?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      mood_analytics: {
        Row: {
          id: string
          user_id: string
          date: string
          dominant_mood: string | null
          happiness_index: number | null
          entry_count: number
          mood_distribution: Json
          wellness_score: number | null
          sleep_quality: number | null
          stress_level: number | null
          energy_level: number | null
          social_interaction: number | null
          physical_activity: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          dominant_mood?: string | null
          happiness_index?: number | null
          entry_count?: number
          mood_distribution?: Json
          wellness_score?: number | null
          sleep_quality?: number | null
          stress_level?: number | null
          energy_level?: number | null
          social_interaction?: number | null
          physical_activity?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          dominant_mood?: string | null
          happiness_index?: number | null
          entry_count?: number
          mood_distribution?: Json
          wellness_score?: number | null
          sleep_quality?: number | null
          stress_level?: number | null
          energy_level?: number | null
          social_interaction?: number | null
          physical_activity?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      monthly_rewinds: {
        Row: {
          id: string
          user_id: string
          month: number
          year: number
          total_entries: number
          mood_summary: Json
          average_happiness_index: number | null
          wellness_report: string | null
          key_insights: string[] | null
          mood_trends: Json | null
          personal_growth_notes: string | null
          challenges_overcome: string[] | null
          gratitude_highlights: string[] | null
          goals_for_next_month: string[] | null
          ai_generated_summary: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          month: number
          year: number
          total_entries?: number
          mood_summary?: Json
          average_happiness_index?: number | null
          wellness_report?: string | null
          key_insights?: string[] | null
          mood_trends?: Json | null
          personal_growth_notes?: string | null
          challenges_overcome?: string[] | null
          gratitude_highlights?: string[] | null
          goals_for_next_month?: string[] | null
          ai_generated_summary?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          month?: number
          year?: number
          total_entries?: number
          mood_summary?: Json
          average_happiness_index?: number | null
          wellness_report?: string | null
          key_insights?: string[] | null
          mood_trends?: Json | null
          personal_growth_notes?: string | null
          challenges_overcome?: string[] | null
          gratitude_highlights?: string[] | null
          goals_for_next_month?: string[] | null
          ai_generated_summary?: string | null
          created_at?: string
        }
      }
      daily_prompts: {
        Row: {
          id: string
          prompt_text: string
          category: string | null
          difficulty_level: string
          tags: string[] | null
          is_active: boolean
          created_by: string | null
          usage_count: number
          created_at: string
        }
        Insert: {
          id?: string
          prompt_text: string
          category?: string | null
          difficulty_level?: string
          tags?: string[] | null
          is_active?: boolean
          created_by?: string | null
          usage_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          prompt_text?: string
          category?: string | null
          difficulty_level?: string
          tags?: string[] | null
          is_active?: boolean
          created_by?: string | null
          usage_count?: number
          created_at?: string
        }
      }
      wellness_metrics: {
        Row: {
          id: string
          user_id: string
          date: string
          meditation_minutes: number
          exercise_minutes: number
          social_time_minutes: number
          outdoor_time_minutes: number
          screen_time_minutes: number
          water_intake_glasses: number
          sleep_hours: number
          gratitude_count: number
          stress_triggers: string[] | null
          coping_strategies_used: string[] | null
          achievements: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          meditation_minutes?: number
          exercise_minutes?: number
          social_time_minutes?: number
          outdoor_time_minutes?: number
          screen_time_minutes?: number
          water_intake_glasses?: number
          sleep_hours?: number
          gratitude_count?: number
          stress_triggers?: string[] | null
          coping_strategies_used?: string[] | null
          achievements?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          meditation_minutes?: number
          exercise_minutes?: number
          social_time_minutes?: number
          outdoor_time_minutes?: number
          screen_time_minutes?: number
          water_intake_glasses?: number
          sleep_hours?: number
          gratitude_count?: number
          stress_triggers?: string[] | null
          coping_strategies_used?: string[] | null
          achievements?: string[] | null
          created_at?: string
        }
      }
      entry_tags: {
        Row: {
          id: string
          user_id: string
          tag_name: string
          color: string
          usage_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tag_name: string
          color?: string
          usage_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tag_name?: string
          color?: string
          usage_count?: number
          created_at?: string
        }
      }
      journal_entry_tags: {
        Row: {
          entry_id: string
          tag_id: string
        }
        Insert: {
          entry_id: string
          tag_id: string
        }
        Update: {
          entry_id?: string
          tag_id?: string
        }
      }
      ai_interactions: {
        Row: {
          id: string
          user_id: string
          entry_id: string | null
          interaction_type: string
          input_data: string | null
          ai_response: string | null
          confidence_score: number | null
          processing_time_ms: number | null
          model_version: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          entry_id?: string | null
          interaction_type: string
          input_data?: string | null
          ai_response?: string | null
          confidence_score?: number | null
          processing_time_ms?: number | null
          model_version?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          entry_id?: string | null
          interaction_type?: string
          input_data?: string | null
          ai_response?: string | null
          confidence_score?: number | null
          processing_time_ms?: number | null
          model_version?: string | null
          created_at?: string
        }
      }
      birthday_celebrations: {
        Row: {
          id: string
          user_id: string
          celebration_year: number
          special_message: string | null
          achievements_summary: string | null
          year_in_review: string | null
          mood_journey_summary: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          celebration_year: number
          special_message?: string | null
          achievements_summary?: string | null
          year_in_review?: string | null
          mood_journey_summary?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          celebration_year?: number
          special_message?: string | null
          achievements_summary?: string | null
          year_in_review?: string | null
          mood_journey_summary?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_birthday_celebration: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}