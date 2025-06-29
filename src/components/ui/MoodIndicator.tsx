import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Mood } from '../../types';

interface MoodIndicatorProps {
  mood: Mood;
  size?: number;
  withLabel?: boolean;
  className?: string;
  animated?: boolean;
}

const MoodIndicator: React.FC<MoodIndicatorProps> = ({
  mood,
  size = 24,
  withLabel = false,
  className = '',
  animated = true
}) => {
  const moodConfig = {
    happy: {
      icon: Smile,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200',
      label: 'Happy',
      emoji: '😊'
    },
    neutral: {
      icon: Meh,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200',
      label: 'Neutral',
      emoji: '😐'
    },
    sad: {
      icon: Frown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-200',
      label: 'Reflective',
      emoji: '😔'
    }
  };

  const { icon: Icon, color, bgColor, borderColor, label, emoji } = moodConfig[mood];

  const MotionWrapper = animated ? motion.div : 'div';
  const motionProps = animated ? {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.3, type: "spring" },
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  } : {};

  return (
    <MotionWrapper 
      className={`inline-flex items-center ${withLabel ? 'px-3 py-1.5' : 'p-2'} rounded-full border ${bgColor} ${borderColor} ${className}`}
      {...motionProps}
    >
      <div className="flex items-center">
        <span className="text-lg mr-1">{emoji}</span>
        <Icon size={size} className={color} />
      </div>
      {withLabel && (
        <span className={`ml-2 font-medium text-sm ${color}`}>
          {label}
        </span>
      )}
    </MotionWrapper>
  );
};

export default MoodIndicator;