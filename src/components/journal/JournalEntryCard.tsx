import React, { useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ChevronDown, ChevronUp, Trash, Star, StarOff, Clock, Hash } from 'lucide-react';
import Card from '../ui/Card';
import MoodIndicator from '../ui/MoodIndicator';
import Button from '../ui/Button';
import { JournalEntry } from '../../types';

interface JournalEntryCardProps {
  entry: JournalEntry;
  onDelete: (id: string) => void;
}

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({ entry, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this journal entry?')) {
      onDelete(entry.id);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Update favorite status in database
  };
  
  const formattedDate = format(new Date(entry.date), 'MMM d, yyyy');
  const formattedTime = format(new Date(entry.date), 'h:mm a');
  
  // Create a preview of the content
  const contentPreview = entry.content.length > 200 
    ? `${entry.content.substring(0, 200)}...` 
    : entry.content;

  // Calculate reading time (average 200 words per minute)
  const wordCount = entry.content.split(' ').length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  
  return (
    <Card 
      className="mb-4 transition-all duration-200 hover:shadow-md" 
      hover={false}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-3">
            <MoodIndicator mood={entry.mood} withLabel />
            <div className="text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <span>{formattedDate}</span>
                <span>•</span>
                <span>{formattedTime}</span>
                <span>•</span>
                <div className="flex items-center">
                  <Clock size={12} className="mr-1" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-2"
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleFavorite}
                  icon={isFavorite ? <Star size={16} className="fill-current" /> : <StarOff size={16} />}
                  className={`${isFavorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-500'}`}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDelete}
                  icon={<Trash size={16} />}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  title="Delete entry"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Content */}
        <div className="mb-4">
          <motion.div
            initial={false}
            animate={{ height: expanded ? 'auto' : 'auto' }}
            className="overflow-hidden"
          >
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {expanded ? entry.content : contentPreview}
            </p>
          </motion.div>
          
          {entry.content.length > 200 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-indigo-600 text-sm mt-2 flex items-center hover:underline transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp size={16} className="mr-1" /> Show less
                </>
              ) : (
                <>
                  <ChevronDown size={16} className="mr-1" /> Read more
                </>
              )}
            </button>
          )}
        </div>
        
        {/* AI Response Section */}
        {entry.aiResponse && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100"
          >
            <div className="flex items-center mb-2">
              <MessageSquare size={18} className="text-indigo-500 mr-2" />
              <h4 className="font-medium text-indigo-700">Solace Response</h4>
            </div>
            <p className="text-gray-700 leading-relaxed">{entry.aiResponse}</p>
          </motion.div>
        )}
        
        {/* Highlights */}
        {entry.highlights && entry.highlights.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4"
          >
            <div className="flex items-center mb-2">
              <Hash size={16} className="text-gray-500 mr-2" />
              <h4 className="font-medium text-gray-700">Key moments</h4>
            </div>
            <div className="space-y-2">
              {entry.highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start"
                >
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-600 text-sm leading-relaxed">{highlight}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Summary */}
        {entry.summary && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-gray-300"
          >
            <h4 className="font-medium text-gray-700 mb-1 text-sm">Summary</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{entry.summary}</p>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

export default JournalEntryCard;