export type Mood = 'happy' | 'neutral' | 'sad';

export interface JournalEntry {
  id: string;
  userId: string; // Added userId to associate entries with users
  content: string;
  date: Date;
  mood: Mood;
  aiResponse: string;
  summary?: string;
  highlights?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  occupation: string;
  location?: string;
  interests?: string[];
  recoveryEmail?: string; // Added recovery email
  recoveryPhone?: string; // Added recovery phone
  createdAt: Date;
  preferences: {
    aiTone: 'calm' | 'cheerful' | 'thoughtful';
    notifications: boolean;
    darkMode: boolean;
    showAllEntries: boolean;
  };
}

export interface DailyPrompt {
  id: string;
  text: string;
}

export interface MoodCount {
  happy: number;
  neutral: number;
  sad: number;
}

export interface MonthSummary {
  month: string;
  year: number;
  moodCounts: MoodCount;
  reflection: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}