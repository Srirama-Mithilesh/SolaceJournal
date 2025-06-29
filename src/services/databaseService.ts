import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { JournalEntry, User, Mood } from '../types';

type Tables = Database['public']['Tables'];
type ProfileRow = Tables['profiles']['Row'];
type JournalEntryRow = Tables['journal_entries']['Row'];
type MoodAnalyticsRow = Tables['mood_analytics']['Row'];
type MonthlyRewindRow = Tables['monthly_rewinds']['Row'];
type BirthdayCelebrationRow = Tables['birthday_celebrations']['Row'];

export class DatabaseService {
  // Profile Management
  async createProfile(userId: string, profileData: Partial<ProfileRow>) {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        ...profileData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getProfile(userId: string): Promise<ProfileRow | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateProfile(userId: string, updates: Partial<ProfileRow>) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // User Preferences
  async getUserPreferences(userId: string) {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateUserPreferences(userId: string, preferences: any) {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Journal Entries
  async createJournalEntry(entryData: Partial<JournalEntryRow>) {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert(entryData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getJournalEntries(userId: string, limit?: number): Promise<JournalEntryRow[]> {
    let query = supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getJournalEntry(entryId: string): Promise<JournalEntryRow | null> {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', entryId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateJournalEntry(entryId: string, updates: Partial<JournalEntryRow>) {
    const { data, error } = await supabase
      .from('journal_entries')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', entryId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteJournalEntry(entryId: string) {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryId);

    if (error) throw error;
  }

  // Mood Analytics
  async getMoodAnalytics(userId: string, startDate?: string, endDate?: string): Promise<MoodAnalyticsRow[]> {
    let query = supabase
      .from('mood_analytics')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getHappinessIndex(userId: string, days: number = 30): Promise<number> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('mood_analytics')
      .select('happiness_index')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])
      .not('happiness_index', 'is', null);

    if (error) throw error;
    
    if (!data || data.length === 0) return 5; // Default neutral score

    const average = data.reduce((sum, item) => sum + (item.happiness_index || 0), 0) / data.length;
    return Math.round(average * 100) / 100;
  }

  // Monthly Rewinds
  async getMonthlyRewind(userId: string, month: number, year: number): Promise<MonthlyRewindRow | null> {
    const { data, error } = await supabase
      .from('monthly_rewinds')
      .select('*')
      .eq('user_id', userId)
      .eq('month', month)
      .eq('year', year)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createMonthlyRewind(rewindData: Partial<MonthlyRewindRow>) {
    const { data, error } = await supabase
      .from('monthly_rewinds')
      .insert(rewindData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async generateMonthlyRewind(userId: string, month: number, year: number) {
    // Get all entries for the month
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const entries = await this.getJournalEntries(userId);
    const monthEntries = entries.filter(entry => {
      const entryDate = entry.created_at.split('T')[0];
      return entryDate >= startDate && entryDate <= endDate;
    });

    // Calculate mood summary
    const moodSummary = monthEntries.reduce(
      (acc, entry) => {
        acc[entry.mood as keyof typeof acc]++;
        return acc;
      },
      { happy: 0, neutral: 0, sad: 0 }
    );

    // Calculate average happiness index
    const happinessScores = monthEntries
      .filter(entry => entry.happiness_score)
      .map(entry => entry.happiness_score!);
    
    const averageHappiness = happinessScores.length > 0
      ? happinessScores.reduce((sum, score) => sum + score, 0) / happinessScores.length
      : null;

    // Generate wellness report
    const wellnessReport = this.generateWellnessReport(monthEntries, moodSummary);

    // Extract key insights
    const keyInsights = this.extractKeyInsights(monthEntries);

    const rewindData = {
      user_id: userId,
      month,
      year,
      total_entries: monthEntries.length,
      mood_summary: moodSummary,
      average_happiness_index: averageHappiness,
      wellness_report: wellnessReport,
      key_insights: keyInsights
    };

    return this.createMonthlyRewind(rewindData);
  }

  private generateWellnessReport(entries: JournalEntryRow[], moodSummary: any): string {
    const totalEntries = entries.length;
    const dominantMood = Object.entries(moodSummary).reduce((a, b) => 
      (moodSummary as any)[a[0]] > (moodSummary as any)[b[0]] ? a : b
    )[0];

    if (totalEntries === 0) {
      return "No journal entries were recorded this month. Consider establishing a regular journaling routine to track your emotional wellness.";
    }

    let report = `This month you made ${totalEntries} journal ${totalEntries === 1 ? 'entry' : 'entries'}. `;

    if (dominantMood === 'happy') {
      report += "Your emotional state was predominantly positive, with many happy moments recorded. This suggests good emotional wellness and life satisfaction.";
    } else if (dominantMood === 'sad') {
      report += "You experienced more challenging emotions this month. Remember that difficult periods are temporary and part of personal growth.";
    } else {
      report += "You maintained emotional balance this month, experiencing a healthy mix of different emotions.";
    }

    return report;
  }

  private extractKeyInsights(entries: JournalEntryRow[]): string[] {
    const insights: string[] = [];
    
    if (entries.length === 0) return insights;

    // Analyze patterns
    const wordCounts = entries.map(e => e.word_count || 0);
    const avgWordCount = wordCounts.reduce((sum, count) => sum + count, 0) / wordCounts.length;
    
    if (avgWordCount > 100) {
      insights.push("You've been expressing yourself in detail, showing deep self-reflection");
    }

    // Analyze mood patterns
    const moodChanges = entries.map(e => e.mood);
    const uniqueMoods = new Set(moodChanges).size;
    
    if (uniqueMoods === 1) {
      insights.push("Your emotional state was consistent throughout the month");
    } else if (uniqueMoods === 3) {
      insights.push("You experienced a full range of emotions, showing emotional awareness");
    }

    return insights;
  }

  // Birthday Celebrations
  async checkBirthdayToday(userId: string): Promise<BirthdayCelebrationRow | null> {
    const today = new Date();
    const currentYear = today.getFullYear();

    // First check if user has a birthday today
    const profile = await this.getProfile(userId);
    if (!profile) return null;

    const birthDate = new Date(profile.date_of_birth);
    const isBirthdayToday = 
      birthDate.getMonth() === today.getMonth() && 
      birthDate.getDate() === today.getDate();

    if (!isBirthdayToday) return null;

    // Check if celebration already exists for this year using limit(1) instead of single()
    const { data, error } = await supabase
      .from('birthday_celebrations')
      .select('*')
      .eq('user_id', userId)
      .eq('celebration_year', currentYear)
      .limit(1);

    if (error) throw error;

    // If celebration exists, return it
    if (data && data.length > 0) {
      return data[0];
    }

    // If no celebration exists, create one with proper error handling
    const celebrationData = {
      user_id: userId,
      celebration_year: currentYear,
      special_message: `Happy Birthday, ${profile.full_name}! 🎉 Another year of growth, reflection, and beautiful moments captured in your journal.`,
      achievements_summary: await this.generateAchievementsSummary(userId),
      year_in_review: await this.generateYearInReview(userId),
      mood_journey_summary: await this.generateMoodJourneySummary(userId)
    };

    try {
      const { data: newCelebration, error: createError } = await supabase
        .from('birthday_celebrations')
        .insert(celebrationData)
        .select()
        .single();

      if (createError) throw createError;
      return newCelebration;
    } catch (insertError: any) {
      // Handle race condition - if duplicate key error occurs, fetch the existing record
      if (insertError.code === '23505') {
        const { data: existingData, error: fetchError } = await supabase
          .from('birthday_celebrations')
          .select('*')
          .eq('user_id', userId)
          .eq('celebration_year', currentYear)
          .limit(1);

        if (fetchError) throw fetchError;
        return existingData && existingData.length > 0 ? existingData[0] : null;
      }
      
      // Re-throw other errors
      throw insertError;
    }
  }

  private async generateAchievementsSummary(userId: string): Promise<string> {
    const entries = await this.getJournalEntries(userId);
    const totalEntries = entries.length;
    const happyEntries = entries.filter(e => e.mood === 'happy').length;
    
    return `You've written ${totalEntries} journal entries and captured ${happyEntries} happy moments this year!`;
  }

  private async generateYearInReview(userId: string): Promise<string> {
    const currentYear = new Date().getFullYear();
    const startOfYear = `${currentYear}-01-01`;
    
    const entries = await this.getJournalEntries(userId);
    const yearEntries = entries.filter(entry => 
      entry.created_at >= startOfYear
    );

    if (yearEntries.length === 0) {
      return "This year marks the beginning of your journaling journey with Solace.";
    }

    const moodCounts = yearEntries.reduce(
      (acc, entry) => {
        acc[entry.mood as keyof typeof acc]++;
        return acc;
      },
      { happy: 0, neutral: 0, sad: 0 }
    );

    return `This year you've shared ${yearEntries.length} entries with ${moodCounts.happy} happy moments, ${moodCounts.neutral} reflective times, and ${moodCounts.sad} challenging periods that helped you grow.`;
  }

  private async generateMoodJourneySummary(userId: string): Promise<string> {
    const analytics = await this.getMoodAnalytics(userId);
    
    if (analytics.length === 0) {
      return "Your mood journey is just beginning. Here's to many more insights ahead!";
    }

    const avgHappiness = analytics
      .filter(a => a.happiness_index)
      .reduce((sum, a) => sum + (a.happiness_index || 0), 0) / analytics.length;

    return `Your happiness index averages ${avgHappiness.toFixed(1)}/10, showing your resilience and capacity for joy throughout your journey.`;
  }

  // Daily Prompts
  async getDailyPrompts(limit: number = 10) {
    const { data, error } = await supabase
      .from('daily_prompts')
      .select('*')
      .eq('is_active', true)
      .order('usage_count', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async getRandomDailyPrompt() {
    const prompts = await this.getDailyPrompts(50);
    if (prompts.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * prompts.length);
    const selectedPrompt = prompts[randomIndex];

    // Update usage count
    await supabase
      .from('daily_prompts')
      .update({ usage_count: selectedPrompt.usage_count + 1 })
      .eq('id', selectedPrompt.id);

    return selectedPrompt;
  }

  // AI Interactions
  async logAIInteraction(interactionData: {
    user_id: string;
    entry_id?: string;
    interaction_type: string;
    input_data?: string;
    ai_response?: string;
    confidence_score?: number;
    processing_time_ms?: number;
    model_version?: string;
  }) {
    const { data, error } = await supabase
      .from('ai_interactions')
      .insert(interactionData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Wellness Metrics
  async updateWellnessMetrics(userId: string, date: string, metrics: any) {
    const { data, error } = await supabase
      .from('wellness_metrics')
      .upsert({
        user_id: userId,
        date,
        ...metrics
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getWellnessMetrics(userId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('wellness_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Entry Tags
  async createTag(userId: string, tagName: string, color: string = '#6366f1') {
    const { data, error } = await supabase
      .from('entry_tags')
      .insert({
        user_id: userId,
        tag_name: tagName,
        color
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserTags(userId: string) {
    const { data, error } = await supabase
      .from('entry_tags')
      .select('*')
      .eq('user_id', userId)
      .order('usage_count', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async addTagToEntry(entryId: string, tagId: string) {
    const { error } = await supabase
      .from('journal_entry_tags')
      .insert({
        entry_id: entryId,
        tag_id: tagId
      });

    if (error) throw error;

    // Update tag usage count
    await supabase.rpc('increment_tag_usage', { tag_id: tagId });
  }
}

export const databaseService = new DatabaseService();