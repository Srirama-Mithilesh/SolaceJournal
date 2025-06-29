import { aiService } from './aiService';
import { databaseService } from '../services/databaseService';
import { getCurrentUser } from '../lib/supabase';

export const analyzeAndSaveEntry = async (content: string, entryType: 'text' | 'audio' = 'text', audioBlob?: Blob) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Get user preferences
    const preferences = await databaseService.getUserPreferences(user.id);
    const tone = preferences?.ai_tone || 'calm';

    let analysisResult;
    let transcription = '';

    if (entryType === 'audio' && audioBlob) {
      // Analyze audio
      const audioBase64 = await blobToBase64(audioBlob);
      analysisResult = await aiService.analyzeAudio(audioBase64, audioBlob.type, tone);
      transcription = analysisResult.transcription || '';
      content = transcription; // Use transcription as content
    } else {
      // Analyze text
      analysisResult = await aiService.analyzeText(content, tone);
    }

    // Create journal entry in database
    const entryData = {
      user_id: user.id,
      content,
      mood: analysisResult.mood,
      ai_response: analysisResult.response,
      summary: analysisResult.summary,
      highlights: analysisResult.highlights,
      entry_type: entryType,
      transcription: transcription || null
    };

    const savedEntry = await databaseService.createJournalEntry(entryData);

    // Log AI interaction
    await databaseService.logAIInteraction({
      user_id: user.id,
      entry_id: savedEntry.id,
      interaction_type: entryType === 'audio' ? 'audio_transcription' : 'mood_analysis',
      input_data: content,
      ai_response: analysisResult.response,
      model_version: 'gemini-2.0-flash'
    });

    return {
      entry: savedEntry,
      analysis: analysisResult
    };

  } catch (error) {
    console.error('Error analyzing and saving entry:', error);
    throw error;
  }
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const getHappinessIndexForCalendar = async (userId: string, days: number = 90) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const analytics = await databaseService.getMoodAnalytics(
      userId,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    // Transform to calendar format
    return analytics.map(day => ({
      date: new Date(day.date),
      mood: day.dominant_mood,
      happiness_index: day.happiness_index,
      entry_count: day.entry_count
    }));

  } catch (error) {
    console.error('Error getting happiness index for calendar:', error);
    return [];
  }
};

export const updateWellnessMetrics = async (metrics: {
  meditation_minutes?: number;
  exercise_minutes?: number;
  social_time_minutes?: number;
  outdoor_time_minutes?: number;
  screen_time_minutes?: number;
  water_intake_glasses?: number;
  sleep_hours?: number;
  gratitude_count?: number;
  stress_triggers?: string[];
  coping_strategies_used?: string[];
  achievements?: string[];
}) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const today = new Date().toISOString().split('T')[0];
    
    return await databaseService.updateWellnessMetrics(user.id, today, metrics);
  } catch (error) {
    console.error('Error updating wellness metrics:', error);
    throw error;
  }
};