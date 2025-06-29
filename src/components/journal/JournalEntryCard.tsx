import React, { useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ChevronDown, ChevronUp, Trash, Heart, Sparkles, BookOpen } from 'lucide-react';
import Card from '../ui/Card';
import MoodIndicator from '../ui/MoodIndicator';
import Button from '../ui/Button';
import { JournalEntry } from '../../types';
import { deleteJournalEntry } from '../../utils/storage';

interface JournalEntryCardProps {
  entry: JournalEntry;
  onDelete: (id: string) => void;
}

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({ entry, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to remove this diary entry?')) {
      deleteJournalEntry(entry.id);
      onDelete(entry.id);
    }
  };
  
  const formattedDate = format(new Date(entry.date), 'EEEE, MMMM d, yyyy');
  const formattedTime = format(new Date(entry.date), 'h:mm a');
  
  // Create a preview of the content
  const contentPreview = entry.content.length > 200 
    ? `${entry.content.substring(0, 200)}...` 
    : entry.content;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200 overflow-hidden hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      {/* Entry Header */}
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 border-b border-amber-200">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center mr-3">
              <BookOpen className="text-amber-700" size={16} />
            </div>
            <div>
              <p className="text-amber-800 font-medium">{formattedDate}</p>
              <p className="text-amber-600 text-sm">{formattedTime}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <MoodIndicator mood={entry.mood} withLabel />
            
            <AnimatePresence>
              {showDelete && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleDelete}
                    icon={<Trash size={16} />}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Entry Content */}
      <div className="p-6">
        <div className="mb-4">
          <p 
            className="text-gray-800 leading-relaxed"
            style={{
              fontFamily: "'Dancing Script', cursive, sans-serif",
              fontSize: '16px',
              lineHeight: '1.7'
            }}
          >
            {expanded ? entry.content : contentPreview}
          </p>
          
          {entry.content.length > 200 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-amber-600 text-sm mt-3 flex items-center hover:text-amber-700 transition-colors duration-200"
            >
              {expanded ? (
                <>
                  <ChevronUp size={16} className="mr-1" /> Show less
                </>
              ) : (
                <>
                  <ChevronDown size={16} className="mr-1" /> Continue reading
                </>
              )}
            </button>
          )}
        </div>
        
        {/* AI Response Section */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center mr-2">
              <Heart size={14} className="text-indigo-600" />
            </div>
            <h4 className="font-medium text-indigo-700">Solace's gentle response</h4>
            <Sparkles size={16} className="text-indigo-400 ml-2" />
          </div>
          <p className="text-indigo-800 leading-relaxed italic">
            "{entry.aiResponse}"
          </p>
        </div>
        
        {/* Highlights */}
        {entry.highlights && entry.highlights.length > 0 && (
          <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <h4 className="font-medium text-amber-800 mb-3 flex items-center">
              <Sparkles size={16} className="mr-2" />
              Key moments from this entry
            </h4>
            <ul className="space-y-2">
              {entry.highlights.map((highlight, index) => (
                <li key={index} className="text-amber-700 flex items-start">
                  <span className="text-amber-500 mr-2">✨</span>
                  <span className="text-sm">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Add Google Fonts for handwriting effect */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600&display=swap');
      `}</style>
    </motion.div>
  );
};

export default JournalEntryCard;