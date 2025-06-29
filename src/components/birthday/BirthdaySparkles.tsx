import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, Heart, Star } from 'lucide-react';

interface BirthdaySparklesProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const BirthdaySparkles: React.FC<BirthdaySparklesProps> = ({ isVisible, onComplete }) => {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (isVisible) {
      // Generate random sparkle positions
      const newSparkles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2
      }));
      setSparkles(newSparkles);

      // Auto-complete after animation
      const timer = setTimeout(() => {
        onComplete?.();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Background overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500"
      />

      {/* Floating sparkles */}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ 
              opacity: 0, 
              scale: 0, 
              x: `${sparkle.x}vw`, 
              y: `${sparkle.y}vh`,
              rotate: 0
            }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              scale: [0, 1.5, 1, 0],
              y: `${sparkle.y - 20}vh`,
              rotate: 360
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 3,
              delay: sparkle.delay,
              ease: "easeOut"
            }}
            className="absolute"
          >
            <Sparkles 
              size={Math.random() * 20 + 10} 
              className="text-yellow-300 drop-shadow-lg" 
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Confetti effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={`confetti-${i}`}
            initial={{ 
              opacity: 0,
              x: Math.random() * window.innerWidth,
              y: -20,
              rotate: 0
            }}
            animate={{ 
              opacity: [0, 1, 0],
              y: window.innerHeight + 20,
              rotate: Math.random() * 720
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              delay: Math.random() * 2,
              ease: "easeOut"
            }}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][Math.floor(Math.random() * 6)]
            }}
          />
        ))}
      </div>

      {/* Central celebration icons */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: [0, 1.2, 1], rotate: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex space-x-4"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              delay: 0
            }}
          >
            <Gift size={40} className="text-pink-400 drop-shadow-lg" />
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              delay: 0.3
            }}
          >
            <Heart size={45} className="text-red-400 drop-shadow-lg" />
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              delay: 0.6
            }}
          >
            <Star size={40} className="text-yellow-400 drop-shadow-lg" />
          </motion.div>
        </motion.div>
      </div>

      {/* Floating text */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-2">
          🎉 Happy Birthday! 🎉
        </h1>
        <p className="text-xl md:text-2xl text-white drop-shadow-md">
          Another year of beautiful moments!
        </p>
      </motion.div>
    </div>
  );
};

export default BirthdaySparkles;