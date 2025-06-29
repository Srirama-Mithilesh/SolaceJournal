import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Mic, Image, Loader, BookOpen, Feather, Heart } from 'lucide-react';
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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 overflow-hidden">
      {/* Diary Header */}
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 border-b border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center mr-3">
              <Feather className="text-amber-700" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-amber-800">Dear Diary...</h2>
              <p className="text-amber-600 text-sm">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <Heart className="text-amber-500" size={24} />
        </div>
        
        <div className="mt-4 p-3 bg-white/60 rounded-lg border border-amber-200">
          <p className="text-amber-700 italic text-sm">
            💭 Today's reflection: "{prompt}"
          </p>
        </div>
      </div>

      <div className="p-6">
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
        <div className="flex mb-6 bg-amber-50 rounded-xl p-1 border border-amber-200">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center flex-1 py-2 px-4 rounded-lg transition-all duration-200 ${
              activeTab === 'text' 
                ? 'bg-white text-amber-700 shadow-sm border border-amber-200' 
                : 'text-amber-600 hover:text-amber-700'
            }`}
          >
            <Pencil size={18} className="mr-2" />
            <span className="font-medium">Write</span>
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`flex items-center flex-1 py-2 px-4 rounded-lg transition-all duration-200 ${
              activeTab === 'audio' 
                ? 'bg-white text-amber-700 shadow-sm border border-amber-200' 
                : 'text-amber-600 hover:text-amber-700'
            }`}
          >
            <Mic size={18} className="mr-2" />
            <span className="font-medium">Speak</span>
          </button>
          <button
            onClick={() => setActiveTab('photo')}
            className={`flex items-center flex-1 py-2 px-4 rounded-lg transition-all duration-200 ${
              activeTab === 'photo' 
                ? 'bg-white text-amber-700 shadow-sm border border-amber-200' 
                : 'text-amber-600 hover:text-amber-700 opacity-50'
            }`}
            disabled
            title="Coming soon"
          >
            <Image size={18} className="mr-2" />
            <span className="font-medium">Capture</span>
          </button>
        </div>
        
        {/* Input Form */}
        {activeTab === 'text' && (
          <form onSubmit={handleSubmitText}>
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Dear diary, today I feel... Pour your heart out, I'm here to listen and understand. ✨"
                className="w-full p-6 border-2 border-amber-200 rounded-xl min-h-[200px] focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-all duration-200 bg-gradient-to-br from-white to-amber-50 placeholder-amber-400 text-amber-900 resize-none"
                disabled={isAnalyzing}
                style={{
                  fontFamily: "'Dancing Script', cursive, sans-serif",
                  fontSize: '16px',
                  lineHeight: '1.6'
                }}
              />
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 text-amber-300">
                <Heart size={20} />
              </div>
              <div className="absolute bottom-4 left-4 text-amber-300">
                <Feather size={16} />
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-amber-600">
                {content.length > 0 && (
                  <span>{content.split(' ').length} words written</span>
                )}
              </div>
              
              <Button 
                type="submit" 
                disabled={!content.trim() || isAnalyzing}
                icon={isAnalyzing ? <Loader className="animate-spin" /> : <BookOpen />}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl shadow-lg"
              >
                {isAnalyzing ? 'Understanding your heart...' : 'Share with my diary'}
              </Button>
            </div>
          </form>
        )}
        
        {activeTab === 'audio' && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
            <AudioRecorder 
              onAudioRecorded={handleSubmitAudio}
              isAnalyzing={isAnalyzing}
            />
          </div>
        )}
        
        {activeTab === 'photo' && (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-amber-300 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50">
            <Image size={48} className="text-amber-400 mb-4" />
            <p className="text-amber-600 text-center font-medium">Photo journaling coming soon</p>
            <p className="text-amber-500 text-sm mt-2 text-center">
              Capture moments and let AI understand your visual stories
            </p>
          </div>
        )}
      </div>

      {/* Add Google Fonts for handwriting effect */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600&display=swap');
      `}</style>
    </div>
  );
};

export default JournalEntryForm;