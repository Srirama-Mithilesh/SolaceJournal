import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Sparkles, Heart, BookOpen } from 'lucide-react';
import JournalEntryForm from '../components/journal/JournalEntryForm';
import JournalEntryCard from '../components/journal/JournalEntryCard';
import WelcomeGreeting from '../components/layout/WelcomeGreeting';
import Button from '../components/ui/Button';
import { JournalEntry, User } from '../types';
import { getJournalEntries, getDailyPrompts, getUser, saveUser } from '../utils/storage';
import { getRandomDailyPrompt } from '../utils/moodAnalysis';

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
    // Load journal entries for the current user only
    if (user) {
      const storedEntries = getJournalEntries(user.id);
      
      // Sort by date (newest first)
      const sortedEntries = [...storedEntries].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      
      setEntries(sortedEntries);
    }
    
    // Set random daily prompt
    const prompts = getDailyPrompts();
    setDailyPrompt(getRandomDailyPrompt(prompts));
    
    // Load user preference for showing all entries
    if (user?.preferences?.showAllEntries) {
      setShowAllEntries(true);
    }
    
    setIsLoading(false);
  }, [user]);
  
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
  
  const handleDeleteEntry = (id: string) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
  };

  const toggleShowAllEntries = () => {
    const newValue = !showAllEntries;
    setShowAllEntries(newValue);
    
    // Save preference to user settings
    if (user) {
      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          showAllEntries: newValue
        }
      };
      saveUser(updatedUser);
    }
  };

  const closeMoodResponse = () => {
    setShowMoodResponse(false);
  };
  
  // Get entries to display
  const entriesToShow = showAllEntries ? entries : entries.slice(0, 3);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-700 font-medium">Opening your diary...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <WelcomeGreeting user={user} />
        
        {/* Diary Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-amber-200">
            <BookOpen className="text-amber-600 mr-3" size={28} />
            <h1 className="text-2xl font-bold text-amber-800">My Personal Diary</h1>
          </div>
          <p className="text-amber-700 mt-3 italic">
            "Every page holds a piece of your heart, every word a step in your journey"
          </p>
        </motion.div>

        {/* Journal Entry Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <JournalEntryForm prompt={dailyPrompt} user={user} onEntrySubmitted={handleNewEntry} />
        </motion.div>

        {/* Recent Entries Section */}
        {entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center mr-3">
                  <BookOpen className="text-amber-700" size={18} />
                </div>
                <h2 className="text-xl font-semibold text-amber-800">
                  {showAllEntries ? 'All My Entries' : 'Recent Pages'}
                </h2>
              </div>
              
              {entries.length > 3 && (
                <Button
                  onClick={toggleShowAllEntries}
                  variant="outline"
                  size="sm"
                  icon={showAllEntries ? <EyeOff size={16} /> : <Eye size={16} />}
                  className="border-amber-300 text-amber-700 hover:bg-amber-100"
                >
                  {showAllEntries ? 'Show Recent Only' : 'Show All Entries'}
                </Button>
              )}
            </div>
            
            <div className="space-y-4">
              {entriesToShow.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <JournalEntryCard 
                    entry={entry} 
                    onDelete={handleDeleteEntry} 
                  />
                </motion.div>
              ))}
            </div>
            
            {!showAllEntries && entries.length > 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-8"
              >
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-amber-200">
                  <p className="text-amber-700 text-sm mb-3">
                    Showing {entriesToShow.length} of {entries.length} diary entries
                  </p>
                  <Button
                    onClick={toggleShowAllEntries}
                    variant="outline"
                    icon={<Eye size={16} />}
                    className="border-amber-300 text-amber-700 hover:bg-amber-100"
                  >
                    Read All {entries.length} Entries
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {entries.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center py-12"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-amber-200 max-w-md mx-auto">
              <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-amber-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                Your diary awaits your first entry
              </h3>
              <p className="text-amber-600 text-sm">
                Every great story begins with a single word. What's yours today?
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JournalPage;