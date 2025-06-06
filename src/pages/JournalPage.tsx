import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
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
  
  useEffect(() => {
    // Load journal entries
    const storedEntries = getJournalEntries();
    
    // Sort by date (newest first)
    const sortedEntries = [...storedEntries].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    setEntries(sortedEntries);
    
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
  
  // Get entries to display
  const entriesToShow = showAllEntries ? entries : entries.slice(0, 5);
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <WelcomeGreeting user={user} />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Journal</h1>
      
      <JournalEntryForm prompt={dailyPrompt} onEntrySubmitted={handleNewEntry} />
      
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