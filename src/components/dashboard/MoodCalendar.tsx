import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subDays } from 'date-fns';
import { JournalEntry, Mood } from '../../types';
import Card from '../ui/Card';
import MoodIndicator from '../ui/MoodIndicator';

interface MoodCalendarProps {
  entries: JournalEntry[];
}

interface CalendarData {
  date: string;
  mood: Mood;
  count: number;
}

const MoodCalendar: React.FC<MoodCalendarProps> = ({ entries }) => {
  const today = new Date();
  const startDate = subDays(today, 90); // Show last 3 months
  const endDate = today;
  
  // Group entries by day and get the dominant mood
  const calendarData: CalendarData[] = [];
  
  // Create a map to group entries by date
  const entriesByDate = new Map<string, JournalEntry[]>();
  
  entries.forEach(entry => {
    const dateKey = new Date(entry.date).toISOString().split('T')[0];
    if (!entriesByDate.has(dateKey)) {
      entriesByDate.set(dateKey, []);
    }
    entriesByDate.get(dateKey)?.push(entry);
  });
  
  // Determine dominant mood for each day
  entriesByDate.forEach((dayEntries, dateKey) => {
    const moodCounts = { happy: 0, neutral: 0, sad: 0 };
    
    dayEntries.forEach(entry => {
      moodCounts[entry.mood]++;
    });
    
    // Find dominant mood
    let dominantMood: Mood = 'neutral';
    let maxCount = 0;
    
    (Object.entries(moodCounts) as [Mood, number][]).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantMood = mood;
      }
    });
    
    calendarData.push({
      date: dateKey,
      mood: dominantMood,
      count: dayEntries.length
    });
  });
  
  // Get class name based on mood
  const getClassForValue = (value: CalendarData | null) => {
    if (!value) return 'color-empty';
    
    switch (value.mood) {
      case 'happy':
        return 'color-scale-4';
      case 'neutral':
        return 'color-scale-2';
      case 'sad':
        return 'color-scale-1';
      default:
        return 'color-empty';
    }
  };
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Mood Calendar</h2>
      
      <div className="mb-4 flex items-center space-x-6">
        <div className="flex items-center">
          <MoodIndicator mood="happy" size={16} />
          <span className="ml-2 text-sm text-gray-600">Happy</span>
        </div>
        <div className="flex items-center">
          <MoodIndicator mood="neutral" size={16} />
          <span className="ml-2 text-sm text-gray-600">Neutral</span>
        </div>
        <div className="flex items-center">
          <MoodIndicator mood="sad" size={16} />
          <span className="ml-2 text-sm text-gray-600">Sad</span>
        </div>
      </div>
      
      <div className="mood-calendar">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={calendarData}
          titleForValue={(value) => {
            if (!value) return 'No entries';
            const { date, mood, count } = value;
            const formattedDate = new Date(date).toDateString();
            return `${formattedDate}: ${mood} (${count} ${count === 1 ? 'entry' : 'entries'})`;
          }}
          classForValue={getClassForValue}
        />
      </div>
      
      <style jsx>{`
        .mood-calendar .react-calendar-heatmap .color-empty {
          fill: #ebedf0;
        }
        .mood-calendar .react-calendar-heatmap .color-scale-1 {
          fill: #c084fc;
        }
        .mood-calendar .react-calendar-heatmap .color-scale-2 {
          fill: #60a5fa;
        }
        .mood-calendar .react-calendar-heatmap .color-scale-4 {
          fill: #4ade80;
        }
        .mood-calendar .react-calendar-heatmap text {
          font-size: 10px;
          fill: #aaa;
        }
        .mood-calendar .react-calendar-heatmap .react-calendar-heatmap-small-text {
          font-size: 5px;
        }
        .mood-calendar .react-calendar-heatmap rect:hover {
          stroke: #555;
          stroke-width: 1px;
        }
      `}</style>
    </Card>
  );
};

export default MoodCalendar;