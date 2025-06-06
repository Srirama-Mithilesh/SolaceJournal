import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Loader, Play, Trash } from 'lucide-react';
import Button from '../ui/Button';

interface AudioRecorderProps {
  onAudioRecorded: (audioBlob: Blob) => void;
  isAnalyzing: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioRecorded, isAnalyzing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const submitAudio = () => {
    if (audioBlob) {
      onAudioRecorded(audioBlob);
    }
  };

  const clearAudio = () => {
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingTime(0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {!isRecording && !audioBlob && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-8"
          >
            <Button
              onClick={startRecording}
              disabled={isAnalyzing}
              variant="primary"
              size="lg"
              icon={<Mic size={24} />}
              className="bg-red-500 hover:bg-red-600"
            >
              Start Recording
            </Button>
            <p className="text-gray-500 text-sm mt-3">
              Tap to start recording your voice journal entry
            </p>
          </motion.div>
        )}

        {isRecording && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-8"
          >
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center"
              >
                <Mic size={28} className="text-white" />
              </motion.div>
              
              <div className="text-2xl font-mono text-red-600">
                {formatTime(recordingTime)}
              </div>
              
              <Button
                onClick={stopRecording}
                variant="outline"
                icon={<Square size={20} />}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Stop Recording
              </Button>
            </div>
          </motion.div>
        )}

        {audioBlob && !isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-50 p-6 rounded-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Mic size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-medium">Audio Recording</p>
                  <p className="text-sm text-gray-500">Duration: {formatTime(recordingTime)}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={playAudio}
                  variant="ghost"
                  size="sm"
                  icon={<Play size={16} />}
                >
                  Play
                </Button>
                <Button
                  onClick={clearAudio}
                  variant="ghost"
                  size="sm"
                  icon={<Trash size={16} />}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </div>

            <Button
              onClick={submitAudio}
              disabled={isAnalyzing}
              icon={isAnalyzing ? <Loader className="animate-spin\" size={18} /> : undefined}
              className="w-full"
            >
              {isAnalyzing ? 'Analyzing Audio...' : 'Analyze Audio Entry'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioRecorder;