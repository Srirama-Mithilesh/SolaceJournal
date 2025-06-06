import React from 'react';
import { motion } from 'framer-motion';
import { JournalEntry } from '../../types';
import Card from '../ui/Card';
import MoodIndicator from '../ui/MoodIndicator';

interface MoodStatsProps {
  entries: JournalEntry[];
  period?: 'week' | 'month' | 'all';
}

const MoodStats: React.FC<MoodStatsProps> = ({ entries, period = 'all' }) => {
  // Filter entries based on period
  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    const now = new Date();
    
    if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return entryDate >= weekAgo;
    }
    
    if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      return entryDate >= monthAgo;
    }
    
    return true; // 'all' period
  });
  
  // Count moods
  const moodCounts = {
    happy: 0,
    neutral: 0,
    sad: 0
  };
  
  filteredEntries.forEach(entry => {
    moodCounts[entry.mood]++;
  });
  
  const totalEntries = filteredEntries.length;
  
  // Calculate percentages
  const moodPercentages = {
    happy: totalEntries ? Math.round((moodCounts.happy / totalEntries) * 100) : 0,
    neutral: totalEntries ? Math.round((moodCounts.neutral / totalEntries) * 100) : 0,
    sad: totalEntries ? Math.round((moodCounts.sad / totalEntries) * 100) : 0
  };
  
  // Determine dominant mood
  let dominantMood = 'neutral';
  let maxCount = 0;
  
  Object.entries(moodCounts).forEach(([mood, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominantMood = mood;
    }
  });
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Mood Distribution</h2>
      
      {totalEntries === 0 ? (
        <div className="text-gray-500 text-center py-6">
          No journal entries to analyze yet. Start journaling to see your mood stats!
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-500">
              Based on {totalEntries} {totalEntries === 1 ? 'entry' : 'entries'}
            </div>
            
            {dominantMood && (
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Most frequent:</span>
                <MoodIndicator mood={dominantMood as any} withLabel />
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {/* Happy Mood Bar */}
            <div>
              <div className="flex justify-between mb-1">
                <div className="flex items-center">
                  <MoodIndicator mood="happy" size={16} />
                  <span className="ml-2 text-sm font-medium text-gray-700">Happy</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{moodPercentages.happy}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <motion.div 
                  className="bg-green-500 h-2.5 rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: `${moodPercentages.happy}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
            
            {/* Neutral Mood Bar */}
            <div>
              <div className="flex justify-between mb-1">
                <div className="flex items-center">
                  <MoodIndicator mood="neutral" size={16} />
                  <span className="ml-2 text-sm font-medium text-gray-700">Neutral</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{moodPercentages.neutral}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <motion.div 
                  className="bg-blue-500 h-2.5 rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: `${moodPercentages.neutral}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
            
            {/* Sad Mood Bar */}
            <div>
              <div className="flex justify-between mb-1">
                <div className="flex items-center">
                  <MoodIndicator mood="sad" size={16} />
                  <span className="ml-2 text-sm font-medium text-gray-700">Sad</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{moodPercentages.sad}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <motion.div 
                  className="bg-purple-500 h-2.5 rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: `${moodPercentages.sad}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default MoodStats;