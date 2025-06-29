import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Sun, Moon, Coffee } from 'lucide-react';
import { User } from '../../types';

interface WelcomeGreetingProps {
  user: User | null;
}

const WelcomeGreeting: React.FC<WelcomeGreetingProps> = ({ user }) => {
  const getTimeBasedGreeting = (): { text: string; icon: React.ReactNode; gradient: string } => {
    const hour = new Date().getHours();
    
    if (hour < 6) {
      return {
        text: 'Good night',
        icon: <Moon className="h-5 w-5 text-indigo-500 mr-2" />,
        gradient: 'from-indigo-50 to-purple-50'
      };
    } else if (hour < 12) {
      return {
        text: 'Good morning',
        icon: <Sun className="h-5 w-5 text-yellow-500 mr-2" />,
        gradient: 'from-yellow-50 to-orange-50'
      };
    } else if (hour < 17) {
      return {
        text: 'Good afternoon',
        icon: <Coffee className="h-5 w-5 text-amber-500 mr-2" />,
        gradient: 'from-amber-50 to-yellow-50'
      };
    } else {
      return {
        text: 'Good evening',
        icon: <Heart className="h-5 w-5 text-pink-500 mr-2" />,
        gradient: 'from-pink-50 to-rose-50'
      };
    }
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
      "Today is a new page in your story of self-discovery.",
      "Embrace your emotions - they are your inner compass.",
      "Growth happens in the space between thoughts and words.",
      "Your vulnerability is your strength, your honesty is your power.",
      "Each moment of reflection is a gift to your future self.",
      "In the garden of your mind, tend to thoughts with kindness."
    ];
    
    // Use date to ensure same motto for the day
    const today = new Date().toDateString();
    const index = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % mottos.length;
    return mottos[index];
  };

  const greeting = getTimeBasedGreeting();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-gradient-to-r ${greeting.gradient} border border-gray-100 rounded-xl p-6 mb-8 shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center mb-2"
          >
            {greeting.icon}
            <h2 className="text-lg font-semibold text-gray-800">
              {user ? `${greeting.text}, ${user.name.split(' ')[0]}` : 'Welcome to Solace'}
            </h2>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 italic leading-relaxed"
          >
            {getMottoOfTheDay()}
          </motion.p>
          
          {user && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-gray-500 mt-2"
            >
              Ready to continue your wellness journey?
            </motion.p>
          )}
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="ml-4"
        >
          <Sparkles className="h-8 w-8 text-indigo-400" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WelcomeGreeting;