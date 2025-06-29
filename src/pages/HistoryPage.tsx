import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import JournalEntryCard from '../components/journal/JournalEntryCard';
import { JournalEntry, Mood, User } from '../types';
import { databaseService } from '../services/databaseService';
import MoodIndicator from '../components/ui/MoodIndicator';

interface HistoryPageProps {
  user: User | null;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ user }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<Mood | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to refresh entries from database
  const refreshEntries = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Load journal entries from database
      const dbEntries = await databaseService.getJournalEntries(user.id);
      
      // Convert database entries to app format and sort by date (newest first)
      const formattedEntries: JournalEntry[] = dbEntries
        .map(entry => ({
          id: entry.id,
          userId: entry.user_id,
          content: entry.content,
          date: new Date(entry.created_at),
          mood: entry.mood as 'happy' | 'neutral' | 'sad',
          aiResponse: entry.ai_response || '',
          summary: entry.summary || '',
          highlights: entry.highlights || []
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    refreshEntries();
  }, [user]);
  
  useEffect(() => {
    // Apply filters
    let result = entries;
    
    // Filter by mood
    if (selectedMood !== 'all') {
      result = result.filter(entry => entry.mood === selectedMood);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(entry => 
        entry.content.toLowerCase().includes(term) || 
        entry.aiResponse.toLowerCase().includes(term)
      );
    }
    
    setFilteredEntries(result);
  }, [entries, selectedMood, searchTerm]);
  
  const handleDeleteEntry = async (id: string) => {
    try {
      await databaseService.deleteJournalEntry(id);
      // Update local state immediately
      setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
      // Refresh from database to ensure consistency
      setTimeout(refreshEntries, 100);
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };
  
  // Group entries by month
  const entriesByMonth: Record<string, JournalEntry[]> = {};
  
  filteredEntries.forEach(entry => {
    const dateObj = new Date(entry.date);
    const monthYearKey = format(dateObj, 'MMMM yyyy');
    
    if (!entriesByMonth[monthYearKey]) {
      entriesByMonth[monthYearKey] = [];
    }
    
    entriesByMonth[monthYearKey].push(entry);
  });
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Journal History</h1>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Filter:</span>
            
            <button
              onClick={() => setSelectedMood('all')}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedMood === 'all' 
                  ? 'bg-gray-200 text-gray-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            
            <button
              onClick={() => setSelectedMood('happy')}
              className={`flex items-center px-2 py-1 rounded-md ${
                selectedMood === 'happy' 
                  ? 'bg-green-100' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <MoodIndicator mood="happy" size={16} />
            </button>
            
            <button
              onClick={() => setSelectedMood('neutral')}
              className={`flex items-center px-2 py-1 rounded-md ${
                selectedMood === 'neutral' 
                  ? 'bg-blue-100' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <MoodIndicator mood="neutral" size={16} />
            </button>
            
            <button
              onClick={() => setSelectedMood('sad')}
              className={`flex items-center px-2 py-1 rounded-md ${
                selectedMood === 'sad' 
                  ? 'bg-purple-100' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <MoodIndicator mood="sad" size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Entries List */}
      <div>
        {Object.keys(entriesByMonth).length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">No journal entries found matching your criteria.</p>
          </div>
        ) : (
          Object.entries(entriesByMonth).map(([monthYear, monthEntries]) => (
            <div key={monthYear} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                {monthYear}
              </h2>
              
              <div className="space-y-4">
                {monthEntries.map(entry => (
                  <JournalEntryCard 
                    key={entry.id} 
                    entry={entry} 
                    onDelete={handleDeleteEntry} 
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPage;