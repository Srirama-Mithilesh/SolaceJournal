import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}
      whileHover={hover ? { y: -2, boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.1)' } : {}}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  );
};

export default Card;