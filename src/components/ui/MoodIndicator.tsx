import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Mood } from '../../types';

interface MoodIndicatorProps {
  mood: Mood;
  size?: number;
  withLabel?: boolean;
  className?: string;
}

const MoodIndicator: React.FC<MoodIndicatorProps> = ({
  mood,
  size = 24,
  withLabel = false,
  className = ''
}) => {
  const moodConfig = {
    happy: {
      icon: Smile,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      label: 'Happy'
    },
    neutral: {
      icon: Meh,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      label: 'Neutral'
    },
    sad: {
      icon: Frown,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
      label: 'Sad'
    }
  };

  const { icon: Icon, color, bgColor, label } = moodConfig[mood];

  return (
    <motion.div 
      className={`inline-flex items-center ${withLabel ? 'px-3 py-1.5' : 'p-1.5'} rounded-full ${bgColor} ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Icon size={size} className={color} />
      {withLabel && <span className={`ml-1.5 font-medium ${color}`}>{label}</span>}
    </motion.div>
  );
};

export default MoodIndicator;