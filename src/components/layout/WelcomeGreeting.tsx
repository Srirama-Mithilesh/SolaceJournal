import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { User } from '../../types';

interface WelcomeGreetingProps {
  user: User | null;
}

const WelcomeGreeting: React.FC<WelcomeGreetingProps> = ({ user }) => {
  const getTimeBasedGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getMottoOfTheDay = (): string => {
    const mottos = [
      "Every thought matters, every feeling is valid.",
      "Your journey of self-discovery starts with a single word.",
      "In the quiet moments, we find our truest selves.",
      "Today's reflections become tomorrow's wisdom.",
      "Your story is worth telling, your voice worth hearing.",
      "Small moments of mindfulness create lasting change.",
      "Every entry is a step toward understanding yourself better.",
      "Your thoughts are the seeds of your personal growth.",
      "In writing, we find clarity; in reflection, we find peace.",
      "Today is a new page in your story of self-discovery."
    ];
    
    // Use date to ensure same motto for the day
    const today = new Date().toDateString();
    const index = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % mottos.length;
    return mottos[index];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-6 mb-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center mb-2"
          >
            <Heart className="h-5 w-5 text-indigo-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">
              {user ? `${getTimeBasedGreeting()}, ${user.name.split(' ')[0]}` : 'Welcome to Solace'}
            </h2>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 italic"
          >
            {getMottoOfTheDay()}
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
        >
          <Sparkles className="h-8 w-8 text-indigo-400" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WelcomeGreeting;