// API service for communicating with the Python backend
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export interface AIAnalysisResult {
  summary: string;
  mood: 'happy' | 'neutral' | 'sad';
  response: string;
  highlights: string[];
  transcription?: string;
  error?: string;
}

export interface AudioTranscriptionResult {
  transcription: string;
  error?: string;
}

class AIService {
  private async makeRequest(endpoint: string, data: any): Promise<any> {
    try {
      console.log(`Making request to: ${API_BASE_URL}${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the AI service. Please ensure the backend server is running on port 5000.');
      }
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async analyzeText(text: string, tone: string = 'calm'): Promise<AIAnalysisResult> {
    return this.makeRequest('/analyze-text', { text, tone });
  }

  async transcribeAudio(audioBase64: string, mimeType: string = 'audio/mpeg'): Promise<AudioTranscriptionResult> {
    return this.makeRequest('/transcribe-audio', { audio: audioBase64, mimeType });
  }

  async analyzeAudio(audioBase64: string, mimeType: string = 'audio/mpeg', tone: string = 'calm'): Promise<AIAnalysisResult> {
    return this.makeRequest('/analyze-audio', { audio: audioBase64, mimeType, tone });
  }

  async checkHealth(): Promise<{ status: string; gemini_available: boolean }> {
    try {
      console.log(`Checking health at: ${API_BASE_URL}/health`);
      const response = await fetch(`${API_BASE_URL}/health`);
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error', gemini_available: false };
    }
  }
}

export const aiService = new AIService();