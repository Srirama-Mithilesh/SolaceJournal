import { Mood, JournalEntry } from '../types';
import { aiService, AIAnalysisResult } from './aiService';
import { getUser } from './storage';

// Enhanced mood analysis using real AI service
export const analyzeMood = async (text: string): Promise<{
  mood: Mood;
  response: string;
  summary: string;
  highlights: string[];
}> => {
  try {
    // Get user preferences for AI tone
    const user = getUser();
    const tone = user?.preferences?.aiTone || 'calm';

    // Check if AI service is available
    const health = await aiService.checkHealth();
    
    if (!health.gemini_available) {
      console.warn('Gemini AI service not available, falling back to mock analysis');
      return await mockAnalyzeMood(text);
    }

    // Use real AI service
    const result: AIAnalysisResult = await aiService.analyzeText(text, tone);
    
    if (result.error) {
      console.error('AI Analysis Error:', result.error);
      return await mockAnalyzeMood(text);
    }

    return {
      mood: result.mood,
      response: result.response,
      summary: result.summary,
      highlights: result.highlights || []
    };
  } catch (error) {
    console.error('Error in mood analysis:', error);
    // Fallback to mock analysis
    return await mockAnalyzeMood(text);
  }
};

// Enhanced audio analysis
export const analyzeAudio = async (audioBlob: Blob): Promise<{
  mood: Mood;
  response: string;
  summary: string;
  highlights: string[];
  transcription: string;
}> => {
  try {
    // Get user preferences for AI tone
    const user = getUser();
    const tone = user?.preferences?.aiTone || 'calm';

    // Convert blob to base64
    const audioBase64 = await blobToBase64(audioBlob);
    const mimeType = audioBlob.type || 'audio/mpeg';

    // Check if AI service is available
    const health = await aiService.checkHealth();
    
    if (!health.gemini_available) {
      throw new Error('AI service not available for audio analysis');
    }

    // Use real AI service for audio analysis
    const result: AIAnalysisResult = await aiService.analyzeAudio(audioBase64, mimeType, tone);
    
    if (result.error) {
      throw new Error(result.error);
    }

    return {
      mood: result.mood,
      response: result.response,
      summary: result.summary,
      highlights: result.highlights || [],
      transcription: result.transcription || ''
    };
  } catch (error) {
    console.error('Error in audio analysis:', error);
    throw error;
  }
};

// Helper function to convert blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove the data URL prefix (e.g., "data:audio/mpeg;base64,")
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Keep the original mock function as fallback
const mockAnalyzeMood = async (text: string): Promise<{
  mood: Mood;
  response: string;
  summary: string;
  highlights: string[];
}> => {
  // Simple keyword-based analysis for demonstration
  const lowerText = text.toLowerCase();
  
  // Very basic sentiment analysis logic
  const happyWords = ['happy', 'joy', 'excited', 'great', 'wonderful', 'love', 'awesome', 'good', 'smile'];
  const sadWords = ['sad', 'upset', 'depressed', 'unhappy', 'terrible', 'bad', 'worried', 'anxious', 'stress'];
  
  let happyScore = 0;
  let sadScore = 0;
  
  happyWords.forEach(word => {
    if (lowerText.includes(word)) happyScore++;
  });
  
  sadWords.forEach(word => {
    if (lowerText.includes(word)) sadScore++;
  });
  
  let mood: Mood = 'neutral';
  let response = '';
  
  if (happyScore > sadScore) {
    mood = 'happy';
    response = "I'm glad to see you're in good spirits! It's wonderful that you're experiencing positive moments. Remember to savor these feelings and the little joys that brought them about. Is there something specific from today you'd like to celebrate?";
  } else if (sadScore > happyScore) {
    mood = 'sad';
    response = "I notice you might be feeling down. That's completely okay - all emotions are valid and temporary. Remember to be gentle with yourself during difficult moments. Would it help to focus on one small positive thing, however tiny, from today?";
  } else {
    mood = 'neutral';
    response = "Thanks for sharing your thoughts. It sounds like you're having a balanced day. Taking time to reflect like this is a healthy practice. Is there anything specific you'd like to explore about how you're feeling?";
  }
  
  // Create a simple summary
  const words = text.split(' ');
  const summary = words.length > 15 
    ? words.slice(0, 15).join(' ') + '...' 
    : text;
  
  // Extract highlights (simple implementation)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const highlights = sentences.length > 2 
    ? [sentences[0], sentences[sentences.length - 1]] 
    : sentences;
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    mood,
    response,
    summary,
    highlights
  };
};

export const getRandomDailyPrompt = (prompts: { id: string; text: string }[]): string => {
  const randomIndex = Math.floor(Math.random() * prompts.length);
  return prompts[randomIndex].text;
};

export const generateMonthlySummary = (entries: JournalEntry[], month: number, year: number): {
  moodCounts: { happy: number; neutral: number; sad: number };
  reflection: string;
} => {
  // Filter entries for the specified month and year
  const monthEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate.getMonth() === month && entryDate.getFullYear() === year;
  });
  
  // Count moods
  const moodCounts = {
    happy: 0,
    neutral: 0,
    sad: 0
  };
  
  monthEntries.forEach(entry => {
    moodCounts[entry.mood]++;
  });
  
  // Generate a simple reflection
  let reflection = '';
  const totalEntries = monthEntries.length;
  
  if (totalEntries === 0) {
    reflection = "You didn't make any journal entries this month. Would you like to start a journaling habit?";
  } else {
    const dominantMood = Object.entries(moodCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    
    if (dominantMood === 'happy') {
      reflection = `This was a positive month for you! You logged ${totalEntries} entries, with happiness being your most frequent emotion. The good moments outweighed the challenging ones.`;
    } else if (dominantMood === 'sad') {
      reflection = `This month had its challenges. You logged ${totalEntries} entries, with more difficult emotions appearing frequently. Remember that it's okay to have tough periods - they're part of the journey.`;
    } else {
      reflection = `This was a balanced month. You logged ${totalEntries} entries with a mix of emotions. Finding equilibrium is an achievement worth noting.`;
    }
  }
  
  return {
    moodCounts,
    reflection
  };
};