import React, { useState, useEffect } from 'react';
import MoodCalendar from '../components/dashboard/MoodCalendar';
import MoodStats from '../components/dashboard/MoodStats';
import Card from '../components/ui/Card';
import { getJournalEntries, getMonthlySummaries } from '../utils/storage';
import { JournalEntry, MonthSummary } from '../types';
import { generateMonthlySummary } from '../utils/moodAnalysis';
import { format } from 'date-fns';

const DashboardPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [monthlySummary, setMonthlySummary] = useState<MonthSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load journal entries
    const storedEntries = getJournalEntries();
    setEntries(storedEntries);
    
    // Get current month and year
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Get stored summaries
    const summaries = getMonthlySummaries();
    const existingSummary = summaries.find(
      s => s.month === format(now, 'MMMM') && s.year === currentYear
    );
    
    if (existingSummary) {
      setMonthlySummary(existingSummary);
    } else if (storedEntries.length > 0) {
      // Generate a new summary
      const { moodCounts, reflection } = generateMonthlySummary(
        storedEntries,
        currentMonth,
        currentYear
      );
      
      const newSummary: MonthSummary = {
        month: format(now, 'MMMM'),
        year: currentYear,
        moodCounts,
        reflection
      };
      
      setMonthlySummary(newSummary);
    }
    
    setIsLoading(false);
  }, []);
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mood Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <MoodStats entries={entries} period="month" />
        <MoodStats entries={entries} period="all" />
      </div>
      
      <div className="mb-6">
        <MoodCalendar entries={entries} />
      </div>
      
      {monthlySummary && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {monthlySummary.month} {monthlySummary.year} Summary
          </h2>
          
          <p className="text-gray-700 mb-4">{monthlySummary.reflection}</p>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-50 p-3 rounded-lg">
              <span className="block text-green-700 font-bold text-lg">
                {monthlySummary.moodCounts.happy}
              </span>
              <span className="text-green-600 text-sm">Happy Entries</span>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <span className="block text-blue-700 font-bold text-lg">
                {monthlySummary.moodCounts.neutral}
              </span>
              <span className="text-blue-600 text-sm">Neutral Entries</span>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <span className="block text-purple-700 font-bold text-lg">
                {monthlySummary.moodCounts.sad}
              </span>
              <span className="text-purple-600 text-sm">Sad Entries</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;