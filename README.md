# Solace Journal

A privacy-first AI journaling app that helps users express their thoughts through text and audio, with intelligent mood detection and empathetic responses.

## Features

- **Multi-Modal Journaling**: Express yourself through text or audio entries
- **AI Mood Analysis**: Real-time emotional analysis using Google's Gemini AI
- **Audio Transcription**: Automatic speech-to-text conversion
- **Mood Tracking**: Visual calendar and statistics of your emotional journey
- **Privacy-First**: All data stored locally by default
- **Responsive Design**: Beautiful UI that works on all devices

## Setup Instructions

### 1. Environment Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Get your Gemini API key:
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Create an account and generate an API key
   - Add your API key to the `.env` file:
     ```
     GEMINI_API_KEY=your_actual_api_key_here
     ```

### 2. Python Backend Setup

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### 3. Frontend Setup

1. Install Node.js dependencies:
   ```bash
   npm install
   ```

### 4. Running the Application

You can run both the backend and frontend together:

```bash
npm run dev:full
```

Or run them separately:

**Backend only:**
```bash
npm run backend
```

**Frontend only:**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Usage

1. **Text Journaling**: Click on the "Text" tab and write your thoughts
2. **Audio Journaling**: Click on the "Audio" tab, record your voice, and let AI transcribe and analyze it
3. **View Dashboard**: Check your mood trends and statistics
4. **Browse History**: Review past entries with filtering options
5. **Customize Settings**: Adjust AI tone preferences and other settings

## API Endpoints

- `GET /health` - Check service health
- `POST /analyze-text` - Analyze text for mood and generate response
- `POST /transcribe-audio` - Transcribe audio to text
- `POST /analyze-audio` - Full audio analysis (transcription + mood analysis)

## Privacy & Security

- All journal entries are stored locally in your browser
- AI analysis is performed in real-time without storing your data
- Your personal information never leaves your device
- Optional cloud backup coming in future updates

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Python, Flask, Google Gemini AI
- **Storage**: Local Storage (browser)
- **Audio**: Web Audio API, MediaRecorder API

## Development

The app includes both mock and real AI analysis. If the Gemini service is unavailable, it automatically falls back to mock responses to ensure the app remains functional during development.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.