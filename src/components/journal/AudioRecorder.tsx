import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Loader, Play, Trash, Volume2, Pause } from 'lucide-react';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (timerRef.current) clearInterval(timerRef.current);
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
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
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Create audio element to get duration
        const audio = new Audio(url);
        audio.onloadedmetadata = () => {
          setDuration(audio.duration);
        };
        
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
      alert('Could not access microphone. Please check your permissions and try again.');
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
    if (audioUrl && !isPlaying) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
        setPlaybackTime(0);
        if (playbackTimerRef.current) {
          clearInterval(playbackTimerRef.current);
          playbackTimerRef.current = null;
        }
      };
      
      audio.play();
      setIsPlaying(true);
      setPlaybackTime(0);
      
      // Update playback time
      playbackTimerRef.current = setInterval(() => {
        if (audio.currentTime) {
          setPlaybackTime(audio.currentTime);
        }
      }, 100);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
        playbackTimerRef.current = null;
      }
    }
  };

  const submitAudio = () => {
    if (audioBlob) {
      onAudioRecorded(audioBlob);
    }
  };

  const clearAudio = () => {
    if (isPlaying) {
      pauseAudio();
    }
    
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingTime(0);
    setPlaybackTime(0);
    setDuration(0);
    audioRef.current = null;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
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
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={startRecording}
                disabled={isAnalyzing}
                variant="primary"
                size="lg"
                icon={<Mic size={24} />}
                className="bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Recording
              </Button>
            </motion.div>
            <p className="text-gray-500 text-sm mt-3">
              Tap to start recording your voice journal entry
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Make sure your microphone is enabled
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
                animate={{ 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(239, 68, 68, 0.7)',
                    '0 0 0 10px rgba(239, 68, 68, 0)',
                    '0 0 0 0 rgba(239, 68, 68, 0)'
                  ]
                }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Mic size={32} className="text-white" />
              </motion.div>
              
              <div className="text-3xl font-mono text-red-600 font-bold">
                {formatTime(recordingTime)}
              </div>
              
              <div className="flex items-center space-x-2 text-red-600">
                <Volume2 size={16} />
                <span className="text-sm">Recording...</span>
              </div>
              
              <Button
                onClick={stopRecording}
                variant="outline"
                icon={<Square size={20} />}
                className="border-red-300 text-red-600 hover:bg-red-50 shadow-md"
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
            className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Mic size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Audio Recording</p>
                  <p className="text-sm text-gray-500">
                    Duration: {formatTime(recordingTime)} • Quality: High
                  </p>
                </div>
              </div>
            </div>

            {/* Audio Playback Controls */}
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-2">
                <Button
                  onClick={isPlaying ? pauseAudio : playAudio}
                  variant="ghost"
                  size="sm"
                  icon={isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  className="text-blue-600 hover:bg-blue-100"
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                
                <div className="flex-1 text-sm text-gray-600">
                  {formatTime(playbackTime)} / {formatTime(duration)}
                </div>
                
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
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  className="bg-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: duration > 0 ? `${(playbackTime / duration) * 100}%` : 0 }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>

            <Button
              onClick={submitAudio}
              disabled={isAnalyzing}
              icon={isAnalyzing ? <Loader className="animate-spin" size={18} /> : <Mic size={18} />}
              className="w-full bg-blue-600 hover:bg-blue-700 shadow-md"
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