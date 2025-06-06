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
  date: Date;
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
    const dateKey = new Date(entry.date).toDateString();
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
      date: new Date(dateKey),
      mood: dominantMood,
      count: dayEntries.length
    });
  });
  
  // Get mood emoji based on mood
  const getMoodEmoji = (mood: Mood): string => {
    switch (mood) {
      case 'happy':
        return '😊';
      case 'neutral':
        return '😐';
      case 'sad':
        return '😢';
      default:
        return '😐';
    }
  };
  
  // Custom cell renderer with emojis
  const renderCell = (value: CalendarData | null, index: number) => {
    if (!value) {
      return (
        <rect
          key={index}
          width="11"
          height="11"
          fill="#ebedf0"
          rx="2"
          ry="2"
        />
      );
    }
    
    const emoji = getMoodEmoji(value.mood);
    
    return (
      <g key={index}>
        <rect
          width="11"
          height="11"
          fill="transparent"
          stroke="#d1d5db"
          strokeWidth="0.5"
          rx="2"
          ry="2"
        />
        <text
          x="5.5"
          y="8"
          textAnchor="middle"
          fontSize="8"
          fill="black"
        >
          {emoji}
        </text>
      </g>
    );
  };
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Mood Calendar</h2>
      
      <div className="mb-4 flex items-center space-x-6">
        <div className="flex items-center">
          <span className="mr-2 text-lg">😊</span>
          <span className="text-sm text-gray-600">Happy</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-lg">😐</span>
          <span className="text-sm text-gray-600">Neutral</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-lg">😢</span>
          <span className="text-sm text-gray-600">Sad</span>
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
            return `${date.toDateString()}: ${mood} (${count} ${count === 1 ? 'entry' : 'entries'})`;
          }}
          transformDayElement={(element, value, index) => {
            return renderCell(value, index);
          }}
        />
      </div>
      
      <style jsx>{`
        .mood-calendar {
          width: 100%;
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