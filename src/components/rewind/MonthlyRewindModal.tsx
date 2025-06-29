import React from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, TrendingUp, Heart, Target, Lightbulb } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import MoodIndicator from '../ui/MoodIndicator';

interface MonthlyRewindData {
  id: string;
  month: number;
  year: number;
  total_entries: number;
  mood_summary: {
    happy: number;
    neutral: number;
    sad: number;
  };
  average_happiness_index: number | null;
  wellness_report: string | null;
  key_insights: string[] | null;
  mood_trends: any;
  personal_growth_notes: string | null;
  challenges_overcome: string[] | null;
  gratitude_highlights: string[] | null;
  goals_for_next_month: string[] | null;
  ai_generated_summary: string | null;
}

interface MonthlyRewindModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewindData: MonthlyRewindData;
}

const MonthlyRewindModal: React.FC<MonthlyRewindModalProps> = ({ 
  isOpen, 
  onClose, 
  rewindData 
}) => {
  if (!isOpen) return null;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthName = monthNames[rewindData.month - 1];
  const totalMoodEntries = rewindData.mood_summary.happy + rewindData.mood_summary.neutral + rewindData.mood_summary.sad;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-t-xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Calendar className="mr-3" size={28} />
                <div>
                  <h2 className="text-2xl font-bold">{monthName} {rewindData.year} Rewind</h2>
                  <p className="text-indigo-100">Your monthly wellness journey</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-indigo-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{rewindData.total_entries}</div>
                <div className="text-sm text-blue-500">Journal Entries</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {rewindData.average_happiness_index?.toFixed(1) || 'N/A'}
                </div>
                <div className="text-sm text-green-500">Avg Happiness Index</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((rewindData.mood_summary.happy / totalMoodEntries) * 100) || 0}%
                </div>
                <div className="text-sm text-purple-500">Happy Moments</div>
              </div>
            </div>

            {/* Mood Distribution */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Heart className="mr-2 text-pink-500" size={20} />
                Mood Distribution
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <MoodIndicator mood="happy" size={32} />
                  <div className="mt-2">
                    <div className="text-xl font-bold text-green-600">{rewindData.mood_summary.happy}</div>
                    <div className="text-sm text-gray-500">Happy</div>
                  </div>
                </div>
                <div className="text-center">
                  <MoodIndicator mood="neutral" size={32} />
                  <div className="mt-2">
                    <div className="text-xl font-bold text-blue-600">{rewindData.mood_summary.neutral}</div>
                    <div className="text-sm text-gray-500">Neutral</div>
                  </div>
                </div>
                <div className="text-center">
                  <MoodIndicator mood="sad" size={32} />
                  <div className="mt-2">
                    <div className="text-xl font-bold text-purple-600">{rewindData.mood_summary.sad}</div>
                    <div className="text-sm text-gray-500">Reflective</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Wellness Report */}
            {rewindData.wellness_report && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <TrendingUp className="mr-2 text-green-500" size={20} />
                  Wellness Report
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{rewindData.wellness_report}</p>
                </div>
              </div>
            )}

            {/* Key Insights */}
            {rewindData.key_insights && rewindData.key_insights.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Lightbulb className="mr-2 text-yellow-500" size={20} />
                  Key Insights
                </h3>
                <div className="space-y-2">
                  {rewindData.key_insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start bg-yellow-50 p-3 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700">{insight}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Challenges Overcome */}
            {rewindData.challenges_overcome && rewindData.challenges_overcome.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Target className="mr-2 text-red-500" size={20} />
                  Challenges Overcome
                </h3>
                <div className="space-y-2">
                  {rewindData.challenges_overcome.map((challenge, index) => (
                    <div key={index} className="bg-red-50 p-3 rounded-lg">
                      <p className="text-gray-700">✓ {challenge}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gratitude Highlights */}
            {rewindData.gratitude_highlights && rewindData.gratitude_highlights.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Heart className="mr-2 text-pink-500" size={20} />
                  Gratitude Highlights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {rewindData.gratitude_highlights.map((highlight, index) => (
                    <div key={index} className="bg-pink-50 p-3 rounded-lg">
                      <p className="text-gray-700">💝 {highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Goals for Next Month */}
            {rewindData.goals_for_next_month && rewindData.goals_for_next_month.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Target className="mr-2 text-blue-500" size={20} />
                  Goals for Next Month
                </h3>
                <div className="space-y-2">
                  {rewindData.goals_for_next_month.map((goal, index) => (
                    <div key={index} className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-gray-700">🎯 {goal}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Generated Summary */}
            {rewindData.ai_generated_summary && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  AI Reflection
                </h3>
                <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
                  <p className="text-gray-700 italic leading-relaxed">
                    "{rewindData.ai_generated_summary}"
                  </p>
                </div>
              </div>
            )}

            {/* Personal Growth Notes */}
            {rewindData.personal_growth_notes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Personal Growth Notes
                </h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{rewindData.personal_growth_notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 rounded-b-xl">
            <div className="flex justify-end">
              <Button onClick={onClose} variant="primary">
                Continue Journey
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default MonthlyRewindModal;