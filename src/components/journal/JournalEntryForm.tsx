import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Mic, Image, Loader, BookOpen } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import AudioRecorder from './AudioRecorder';
import { analyzeMood, analyzeAudio } from '../../utils/moodAnalysis';
import { saveJournalEntry } from '../../utils/storage';
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
      // Analyze mood with our real AI function
      const analysis = await analyzeMood(content);
      
      // Create new journal entry
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        userId: user.id, // Associate entry with user
        content,
        date: new Date(),
        mood: analysis.mood,
        aiResponse: analysis.response,
        summary: analysis.summary,
        highlights: analysis.highlights
      };
      
      // Save to local storage
      saveJournalEntry(newEntry);
      
      // Notify parent component
      onEntrySubmitted(newEntry);
      
      // Reset form
      setContent('');
    } catch (error) {
      console.error('Error analyzing mood:', error);
      setError('Failed to analyze your entry. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitAudio = async (audioBlob: Blob) => {
    if (!user) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Analyze audio with our real AI function
      const analysis = await analyzeAudio(audioBlob);
      
      // Create new journal entry
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        userId: user.id, // Associate entry with user
        content: analysis.transcription,
        date: new Date(),
        mood: analysis.mood,
        aiResponse: analysis.response,
        summary: analysis.summary,
        highlights: analysis.highlights
      };
      
      // Save to local storage
      saveJournalEntry(newEntry);
      
      // Notify parent component
      onEntrySubmitted(newEntry);
      
    } catch (error) {
      console.error('Error analyzing audio:', error);
      setError('Failed to analyze your audio entry. Please try again.');
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
          className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4"
        >
          {error}
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