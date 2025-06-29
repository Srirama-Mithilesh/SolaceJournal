import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MoodCalendar from '../components/dashboard/MoodCalendar';
import MoodStats from '../components/dashboard/MoodStats';
import HappinessCalendar from '../components/enhanced/HappinessCalendar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { JournalEntry, User } from '../types';
import { databaseService } from '../services/databaseService';
import { getHappinessIndexForCalendar } from '../utils/enhancedMoodAnalysis';
import { format } from 'date-fns';

interface DashboardPageProps {
  user: User | null;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [happinessData, setHappinessData] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadDashboardData();
  }, [user, selectedDate]);

  const loadDashboardData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Load journal entries from database
      const dbEntries = await databaseService.getJournalEntries(user.id);
      
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

      // Load happiness index data for calendar
      const happinessCalendarData = await getHappinessIndexForCalendar(user.id, 90);
      setHappinessData(happinessCalendarData);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      
      {/* Mood Calendar */}
      <div className="mb-6">
        <MoodCalendar entries={entries} />
      </div>

      {/* Happiness Index Calendar */}
      {happinessData.length > 0 && (
        <div className="mb-6">
          <HappinessCalendar data={happinessData} />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;