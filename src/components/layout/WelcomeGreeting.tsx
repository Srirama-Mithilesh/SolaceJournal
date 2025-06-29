import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, BookOpen, Feather } from 'lucide-react';
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

  const getPersonalMessage = (): string => {
    const messages = [
      "Your thoughts are precious gems waiting to be discovered.",
      "Every word you write is a step toward understanding yourself better.",
      "In the quiet moments of reflection, wisdom blooms.",
      "Your diary is a safe haven for your heart's deepest truths.",
      "Today's feelings are tomorrow's insights - let them flow freely.",
      "Your emotional journey deserves to be honored and remembered.",
      "In writing, we find clarity; in sharing, we find healing.",
      "Your story matters, and every chapter begins with a single word.",
      "Let your heart speak through your pen - I'm here to listen.",
      "Your vulnerability is your strength, your words are your power."
    ];
    
    // Use date to ensure same message for the day
    const today = new Date().toDateString();
    const index = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % messages.length;
    return messages[index];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-r from-white/80 to-amber-50/80 backdrop-blur-sm border-2 border-amber-200 rounded-2xl p-6 mb-8 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center mb-3"
          >
            <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center mr-3">
              <Heart className="h-5 w-5 text-amber-700" />
            </div>
            <h2 className="text-xl font-semibold text-amber-800">
              {user ? `${getTimeBasedGreeting()}, ${user.name.split(' ')[0]}` : 'Welcome to your sanctuary'}
            </h2>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-amber-700 leading-relaxed"
          >
            {getPersonalMessage()}
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.6, type: "spring", damping: 15 }}
          className="flex space-x-2"
        >
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-amber-600" />
          </div>
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-orange-600" />
          </div>
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <Feather className="h-4 w-4 text-yellow-600" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WelcomeGreeting;