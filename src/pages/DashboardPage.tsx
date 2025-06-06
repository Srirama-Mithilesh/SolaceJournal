import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MoodCalendar from '../components/dashboard/MoodCalendar';
import MoodStats from '../components/dashboard/MoodStats';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getJournalEntries, getMonthlySummaries, getUser } from '../utils/storage';
import { JournalEntry, MonthSummary } from '../types';
import { generateMonthlySummary } from '../utils/moodAnalysis';
import { format } from 'date-fns';

const DashboardPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [monthlySummary, setMonthlySummary] = useState<MonthSummary | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Get current user
    const user = getUser();
    if (!user) {
      setIsLoading(false);
      return;
    }

    // Load journal entries for current user only
    const storedEntries = getJournalEntries(user.id);
    setEntries(storedEntries);
    
    // Get selected month and year
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    
    // Get stored summaries
    const summaries = getMonthlySummaries();
    const existingSummary = summaries.find(
      s => s.month === format(selectedDate, 'MMMM') && s.year === selectedYear
    );
    
    if (existingSummary) {
      setMonthlySummary(existingSummary);
    } else if (storedEntries.length > 0) {
      // Generate a new summary for the selected month
      const { moodCounts, reflection } = generateMonthlySummary(
        storedEntries,
        selectedMonth,
        selectedYear
      );
      
      const newSummary: MonthSummary = {
        month: format(selectedDate, 'MMMM'),
        year: selectedYear,
        moodCounts,
        reflection
      };
      
      setMonthlySummary(newSummary);
    } else {
      setMonthlySummary(null);
    }
    
    setIsLoading(false);
  }, [selectedDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return selectedDate.getMonth() === now.getMonth() && 
           selectedDate.getFullYear() === now.getFullYear();
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mood Dashboard</h1>
      
      {/* Current Month Stats */}
      <div className="mb-6">
        <MoodStats entries={entries} period="month" />
      </div>
      
      {/* Month Navigation */}
      <div className="mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              icon={<ChevronLeft size={16} />}
              onClick={() => navigateMonth('prev')}
            >
              Previous
            </Button>
            
            <h2 className="text-lg font-semibold text-gray-800">
              {format(selectedDate, 'MMMM yyyy')}
              {isCurrentMonth() && <span className="text-sm text-indigo-600 ml-2">(Current)</span>}
            </h2>
            
            <Button
              variant="outline"
              size="sm"
              icon={<ChevronRight size={16} />}
              onClick={() => navigateMonth('next')}
              disabled={selectedDate >= new Date()}
            >
              Next
            </Button>
          </div>
        </Card>
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