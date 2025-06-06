import { JournalEntry, DailyPrompt, User, MonthSummary } from '../types';

// Local storage keys
const ENTRIES_KEY = 'solace_journal_entries';
const USER_KEY = 'solace_journal_user';
const PROMPTS_KEY = 'solace_journal_prompts';
const SUMMARIES_KEY = 'solace_journal_summaries';

// Journal entries
export const getJournalEntries = (): JournalEntry[] => {
  const entries = localStorage.getItem(ENTRIES_KEY);
  return entries ? JSON.parse(entries) : [];
};

export const saveJournalEntry = (entry: JournalEntry): void => {
  const entries = getJournalEntries();
  entries.push(entry);
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
};

export const deleteJournalEntry = (id: string): void => {
  const entries = getJournalEntries();
  const updatedEntries = entries.filter(entry => entry.id !== id);
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(updatedEntries));
};

// User data
export const getUser = (): User | null => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const saveUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Daily prompts
export const getDailyPrompts = (): DailyPrompt[] => {
  const prompts = localStorage.getItem(PROMPTS_KEY);
  return prompts ? JSON.parse(prompts) : getDefaultPrompts();
};

export const getDefaultPrompts = (): DailyPrompt[] => [
  { id: '1', text: 'What made you smile today?' },
  { id: '2', text: 'Describe a moment that brought you peace.' },
  { id: '3', text: 'What are you grateful for right now?' },
  { id: '4', text: 'What was challenging about today and how did you handle it?' },
  { id: '5', text: 'If you could change one thing about today, what would it be?' },
  { id: '6', text: 'What are you looking forward to tomorrow?' },
  { id: '7', text: 'What did you learn about yourself today?' },
  { id: '8', text: 'How did you take care of yourself today?' },
  { id: '9', text: 'What emotions did you experience most strongly today?' },
  { id: '10', text: 'What would you tell your past self about today?' }
];

// Monthly summaries
export const getMonthlySummaries = (): MonthSummary[] => {
  const summaries = localStorage.getItem(SUMMARIES_KEY);
  return summaries ? JSON.parse(summaries) : [];
};

export const saveMonthSummary = (summary: MonthSummary): void => {
  const summaries = getMonthlySummaries();
  const existingIndex = summaries.findIndex(
    s => s.month === summary.month && s.year === summary.year
  );
  
  if (existingIndex >= 0) {
    summaries[existingIndex] = summary;
  } else {
    summaries.push(summary);
  }
  
  localStorage.setItem(SUMMARIES_KEY, JSON.stringify(summaries));
};