import React, { useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ChevronDown, ChevronUp, Trash } from 'lucide-react';
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
    if (confirm('Are you sure you want to delete this journal entry?')) {
      deleteJournalEntry(entry.id);
      onDelete(entry.id);
    }
  };
  
  const formattedDate = format(new Date(entry.date), 'MMM d, yyyy - h:mm a');
  
  // Create a preview of the content
  const contentPreview = entry.content.length > 150 
    ? `${entry.content.substring(0, 150)}...` 
    : entry.content;
  
  return (
    <Card 
      className="mb-4" 
      hover={false}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <MoodIndicator mood={entry.mood} withLabel />
            <span className="ml-3 text-sm text-gray-500">{formattedDate}</span>
          </div>
          
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
                  Delete
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="mt-3">
          <p className="text-gray-800">
            {expanded ? entry.content : contentPreview}
          </p>
          
          {entry.content.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-indigo-600 text-sm mt-2 flex items-center hover:underline"
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
        <div className="mt-4 bg-indigo-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <MessageSquare size={18} className="text-indigo-500 mr-2" />
            <h4 className="font-medium text-indigo-700">Solace Response</h4>
          </div>
          <p className="text-gray-700">{entry.aiResponse}</p>
        </div>
        
        {/* Highlights */}
        {entry.highlights && entry.highlights.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">Key moments</h4>
            <ul className="list-disc pl-5 space-y-1">
              {entry.highlights.map((highlight, index) => (
                <li key={index} className="text-gray-600">{highlight}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

export default JournalEntryCard;