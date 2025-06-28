import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subDays } from 'date-fns';
import Card from '../ui/Card';

interface HappinessCalendarProps {
  data: Array<{
    date: Date;
    mood: string | null;
    happiness_index: number | null;
    entry_count: number;
  }>;
}

const HappinessCalendar: React.FC<HappinessCalendarProps> = ({ data }) => {
  const today = new Date();
  const startDate = subDays(today, 90);
  const endDate = today;

  // Transform data for calendar
  const calendarData = data.map(item => ({
    date: item.date,
    count: item.happiness_index || 0,
    mood: item.mood,
    entries: item.entry_count
  }));

  const getColorForValue = (value: any) => {
    if (!value || value.count === 0) return '#ebedf0';
    
    const happiness = value.count;
    if (happiness >= 8) return '#22c55e'; // Green for high happiness
    if (happiness >= 6) return '#84cc16'; // Light green
    if (happiness >= 4) return '#eab308'; // Yellow for neutral
    if (happiness >= 2) return '#f97316'; // Orange for low
    return '#ef4444'; // Red for very low
  };

  const renderTooltip = (value: any) => {
    if (!value) return 'No entries';
    
    const { date, count, mood, entries } = value;
    return `${date.toDateString()}: Happiness ${count.toFixed(1)}/10 (${entries} ${entries === 1 ? 'entry' : 'entries'})`;
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Happiness Index Calendar</h2>
      
      <div className="mb-4 flex items-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-400 rounded mr-2"></div>
          <span className="text-gray-600">Low (1-2)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-orange-400 rounded mr-2"></div>
          <span className="text-gray-600">Fair (3-4)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-400 rounded mr-2"></div>
          <span className="text-gray-600">Good (5-6)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-lime-400 rounded mr-2"></div>
          <span className="text-gray-600">Great (7-8)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
          <span className="text-gray-600">Excellent (9-10)</span>
        </div>
      </div>
      
      <div className="happiness-calendar">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={calendarData}
          titleForValue={renderTooltip}
          classForValue={(value) => {
            if (!value) return 'color-empty';
            const happiness = value.count;
            if (happiness >= 8) return 'color-scale-9';
            if (happiness >= 6) return 'color-scale-7';
            if (happiness >= 4) return 'color-scale-5';
            if (happiness >= 2) return 'color-scale-3';
            return 'color-scale-1';
          }}
        />
      </div>
      
      <style jsx>{`
        .happiness-calendar .react-calendar-heatmap .color-empty {
          fill: #ebedf0;
        }
        .happiness-calendar .react-calendar-heatmap .color-scale-1 {
          fill: #ef4444;
        }
        .happiness-calendar .react-calendar-heatmap .color-scale-3 {
          fill: #f97316;
        }
        .happiness-calendar .react-calendar-heatmap .color-scale-5 {
          fill: #eab308;
        }
        .happiness-calendar .react-calendar-heatmap .color-scale-7 {
          fill: #84cc16;
        }
        .happiness-calendar .react-calendar-heatmap .color-scale-9 {
          fill: #22c55e;
        }
        .happiness-calendar .react-calendar-heatmap rect:hover {
          stroke: #555;
          stroke-width: 1px;
        }
      `}</style>
    </Card>
  );
};

export default HappinessCalendar;