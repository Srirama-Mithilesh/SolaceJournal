import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Sparkles, Heart, BookOpen } from 'lucide-react';
import JournalEntryForm from '../components/journal/JournalEntryForm';
import JournalEntryCard from '../components/journal/JournalEntryCard';
import WelcomeGreeting from '../components/layout/WelcomeGreeting';
import MoodIndicator from '../components/ui/MoodIndicator';
import Button from '../components/ui/Button';
import { JournalEntry, User } from '../types';
import { databaseService } from '../services/databaseService';

interface JournalPageProps {
  user: User | null;
}

const JournalPage: React.FC<JournalPageProps> = ({ user }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [dailyPrompt, setDailyPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAllEntries, setShowAllEntries] = useState(false);
  const [showMoodResponse, setShowMoodResponse] = useState(false);
  const [moodResponse, setMoodResponse] = useState('');
  const [responseType, setResponseType] = useState<'happy' | 'neutral' | 'sad'>('neutral');
  
  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Load journal entries from database
      const dbEntries = await databaseService.getJournalEntries(user.id, 50);
      
      // Convert database entries to app format
      const formattedEntries: JournalEntry[] = dbEntries.map(entry => ({
        id: entry.id,
        userId: entry.user_id,
        content: entry.content,
        date: new Date(entry.created_at),
        mood: entry.mood as 'happy' | 'neutral' | 'sad',
        aiResponse: entry.ai_response || '',
        summary: entry.summary || '',
        highlights: entry.highlights || []
      }));

      setEntries(formattedEntries);

      // Get daily prompt
      const prompt = await databaseService.getRandomDailyPrompt();
      setDailyPrompt(prompt?.prompt_text || 'How are you feeling today?');

      // Load user preferences
      const preferences = await databaseService.getUserPreferences(user.id);
      if (preferences?.show_all_entries) {
        setShowAllEntries(true);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNewEntry = (entry: JournalEntry) => {
    setEntries(prevEntries => [entry, ...prevEntries]);
    
    // Show gentle mood response
    setMoodResponse(entry.aiResponse);
    setResponseType(entry.mood);
    setShowMoodResponse(true);
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
      setShowMoodResponse(false);
    }, 8000);
  };
  
  const handleDeleteEntry = async (id: string) => {
    try {
      await databaseService.deleteJournalEntry(id);
      setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const toggleShowAllEntries = async () => {
    const newValue = !showAllEntries;
    setShowAllEntries(newValue);
    
    // Save preference to database
    if (user) {
      try {
        await databaseService.updateUserPreferences(user.id, {
          show_all_entries: newValue
        });
      } catch (error) {
        console.error('Error updating preferences:', error);
      }
    }
  };

  const closeMoodResponse = () => {
    setShowMoodResponse(false);
  };
  
  // Get entries to display
  const entriesToShow = showAllEntries ? entries : entries.slice(0, 3);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Solace Journal...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      {/* Gentle Mood Response Overlay */}
      <AnimatePresence>
        {showMoodResponse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-4"
            onClick={closeMoodResponse}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`max-w-md w-full p-6 rounded-2xl shadow-2xl backdrop-blur-sm border-2 ${
                responseType === 'happy' 
                  ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-200' 
                  : responseType === 'sad'
                  ? 'bg-gradient-to-br from-purple-100 to-indigo-100 border-purple-200'
                  : 'bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                    responseType === 'happy' 
                      ? 'bg-green-200' 
                      : responseType === 'sad'
                      ? 'bg-purple-200'
                      : 'bg-blue-200'
                  }`}
                >
                  {responseType === 'happy' ? (
                    <Sparkles className="text-green-600" size={28} />
                  ) : responseType === 'sad' ? (
                    <Heart className="text-purple-600" size={28} />
                  ) : (
                    <BookOpen className="text-blue-600" size={28} />
                  )}
                </motion.div>
                
                {/* Show mood indicator */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="mb-3"
                >
                  <MoodIndicator mood={responseType} withLabel size={20} />
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`text-lg font-semibold mb-2 ${
                    responseType === 'happy' 
                      ? 'text-green-800' 
                      : responseType === 'sad'
                      ? 'text-purple-800'
                      : 'text-blue-800'
                  }`}
                >
                  {responseType === 'happy' 
                    ? 'Your joy shines through! ✨' 
                    : responseType === 'sad'
                    ? 'I hear you, and you\'re not alone 💜'
                    : 'Thank you for sharing 🌟'
                  }
                </motion.h3>
              </div>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`text-center leading-relaxed ${
                  responseType === 'happy' 
                    ? 'text-green-700' 
                    : responseType === 'sad'
                    ? 'text-purple-700'
                    : 'text-blue-700'
                }`}
              >
                {moodResponse}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center mt-6"
              >
                <button
                  onClick={closeMoodResponse}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    responseType === 'happy' 
                      ? 'bg-green-200 text-green-800 hover:bg-green-300' 
                      : responseType === 'sad'
                      ? 'bg-purple-200 text-purple-800 hover:bg-purple-300'
                      : 'bg-blue-200 text-blue-800 hover:bg-blue-300'
                  }`}
                >
                  Continue Writing
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <WelcomeGreeting user={user} />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Journal</h1>
      
      <JournalEntryForm prompt={dailyPrompt} user={user} onEntrySubmitted={handleNewEntry} />
      
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {showAllEntries ? 'All Entries' : 'Recent Entries'}
          </h2>
          
          {entries.length > 5 && (
            <Button
              onClick={toggleShowAllEntries}
              variant="outline"
              size="sm"
              icon={showAllEntries ? <EyeOff size={16} /> : <Eye size={16} />}
            >
              {showAllEntries ? 'Show Recent Only' : 'Show All Entries'}
            </Button>
          )}
        </div>
        
        {entriesToShow.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">No journal entries yet. Start by adding your first entry above!</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {entriesToShow.map(entry => (
              <JournalEntryCard 
                key={entry.id} 
                entry={entry} 
                onDelete={handleDeleteEntry} 
              />
            ))}
            
            {!showAllEntries && entries.length > 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-6"
              >
                <p className="text-gray-500 text-sm mb-3">
                  Showing {entriesToShow.length} of {entries.length} entries
                </p>
                <Button
                  onClick={toggleShowAllEntries}
                  variant="outline"
                  icon={<Eye size={16} />}
                >
                  View All {entries.length} Entries
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JournalPage;