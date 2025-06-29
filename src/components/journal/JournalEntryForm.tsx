import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Mic, Image, Loader, BookOpen, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import AudioRecorder from './AudioRecorder';
import { analyzeAndSaveEntry } from '../../utils/enhancedMoodAnalysis';
import { JournalEntry, User } from '../../types';

interface JournalEntryFormProps {
  prompt: string;
  user: User | null;
  onEntrySubmitted: (entry: JournalEntry) => void;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ prompt, user, onEntrySubmitted }) => {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'audio' | 'photo'>('text');
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmitText = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !user) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await analyzeAndSaveEntry(content, 'text');
      
      // Convert database entry to app format
      const newEntry: JournalEntry = {
        id: result.entry.id,
        userId: result.entry.user_id,
        content: result.entry.content,
        date: new Date(result.entry.created_at),
        mood: result.entry.mood as 'happy' | 'neutral' | 'sad',
        aiResponse: result.entry.ai_response || '',
        summary: result.entry.summary || '',
        highlights: result.entry.highlights || []
      };
      
      // Notify parent component
      onEntrySubmitted(newEntry);
      
      // Reset form
      setContent('');
    } catch (error) {
      console.error('Error analyzing mood:', error);
      
      let errorMessage = 'Failed to analyze your entry. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Unable to connect to the AI service')) {
          errorMessage = 'Cannot connect to the AI service. Please make sure the backend server is running by executing "npm run dev:full" in your terminal.';
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Network connection failed. Please check if the backend server is running on port 5000.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitAudio = async (audioBlob: Blob) => {
    if (!user) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await analyzeAndSaveEntry('', 'audio', audioBlob);
      
      // Convert database entry to app format
      const newEntry: JournalEntry = {
        id: result.entry.id,
        userId: result.entry.user_id,
        content: result.entry.content,
        date: new Date(result.entry.created_at),
        mood: result.entry.mood as 'happy' | 'neutral' | 'sad',
        aiResponse: result.entry.ai_response || '',
        summary: result.entry.summary || '',
        highlights: result.entry.highlights || []
      };
      
      // Notify parent component
      onEntrySubmitted(newEntry);
      
    } catch (error) {
      console.error('Error analyzing audio:', error);
      
      let errorMessage = 'Failed to analyze your audio entry. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Unable to connect to the AI service')) {
          errorMessage = 'Cannot connect to the AI service. Please make sure the backend server is running by executing "npm run dev:full" in your terminal.';
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Network connection failed. Please check if the backend server is running on port 5000.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Personal Diary</h2>
      <p className="text-gray-500 mb-6 italic">{prompt}</p>
      
      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4 flex items-start space-x-3"
        >
          <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Connection Error</p>
            <p className="text-sm mt-1">{error}</p>
            {error.includes('backend server') && (
              <p className="text-xs mt-2 text-red-600">
                💡 Tip: Run <code className="bg-red-100 px-1 rounded">npm run dev:full</code> to start both frontend and backend servers.
              </p>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Input Type Tabs */}
      <div className="flex mb-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex items-center pb-2 px-4 ${
            activeTab === 'text' 
              ? 'border-b-2 border-indigo-500 text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Pencil size={18} className="mr-2" />
          <span>Write</span>
        </button>
        <button
          onClick={() => setActiveTab('audio')}
          className={`flex items-center pb-2 px-4 ${
            activeTab === 'audio' 
              ? 'border-b-2 border-indigo-500 text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Mic size={18} className="mr-2" />
          <span>Speak</span>
        </button>
        <button
          onClick={() => setActiveTab('photo')}
          className={`flex items-center pb-2 px-4 ${
            activeTab === 'photo' 
              ? 'border-b-2 border-indigo-500 text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          disabled
          title="Coming soon"
        >
          <Image size={18} className="mr-2" />
          <span>Capture</span>
        </button>
      </div>
      
      {/* Input Form */}
      {activeTab === 'text' && (
        <form onSubmit={handleSubmitText}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Dear diary, today I feel... Share whatever's on your mind, I'm here to listen."
            className="w-full p-4 border border-gray-300 rounded-lg min-h-[150px] focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            disabled={isAnalyzing}
          />
          
          <div className="flex justify-end mt-4">
            <Button 
              type="submit" 
              disabled={!content.trim() || isAnalyzing}
              icon={isAnalyzing ? <Loader className="animate-spin" /> : <BookOpen />}
            >
              {isAnalyzing ? 'Understanding your thoughts...' : 'Add to my diary'}
            </Button>
          </div>
        </form>
      )}
      
      {activeTab === 'audio' && (
        <AudioRecorder 
          onAudioRecorded={handleSubmitAudio}
          isAnalyzing={isAnalyzing}
        />
      )}
      
      {activeTab === 'photo' && (
        <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <Image size={48} className="text-gray-400 mb-4" />
          <p className="text-gray-500 text-center">Photo journaling coming soon</p>
          <p className="text-gray-400 text-sm mt-2">Capture moments and let AI understand your visual stories</p>
        </div>
      )}
    </Card>
  );
};

export default JournalEntryForm;