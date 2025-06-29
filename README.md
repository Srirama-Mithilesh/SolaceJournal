# Solace Journal  
**Your Personal AI-Powered Journaling Companion**

Solace Journal is a privacy-first AI journaling application designed to support your emotional wellness journey. It enables users to reflect and express themselves through both text and audio entries, with real-time mood detection, voice-to-text transcription, and intuitive mood analytics.

---

## 🌟 Core Features

- **📝 Multi-Modal Journaling**  
  Write using a rich text editor or speak using the audio recorder—switch effortlessly between modes.

- **💡 Intelligent Mood Analysis**  
  AI-powered emotional detection offers real-time insights into your mental state and patterns.

- **🎙️ Voice-to-Text Transcription**  
  High-accuracy transcription turns your voice entries into searchable text.

- **📊 Mood Tracking & Insights**  
  Visual calendar and analytics show emotional trends over time for better self-reflection.

- **🎉 Birthday Celebrations**  
  Special sparkle effects and personalized messages on your birthday.

- **📅 Monthly Rewinds**  
  AI-generated monthly wellness reports with insights and growth tracking.

- **🔐 Secure Database Storage**  
  All data stored securely in Supabase with row-level security.

---

## 🛠️ Installation and Setup

### 📋 Prerequisites

- Node.js 16+
- Python 3.8+ (for AI backend)
- Supabase account
- Google Gemini AI API key

### ⚙️ Database Setup (Supabase)

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to be ready

2. **Get Your Supabase Credentials**
   - Go to Project Settings → API
   - Copy your Project URL and anon/public key

3. **Run Database Migration**
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase/migrations/20250628180517_black_rain.sql`
   - Run the migration to create all tables and security policies

### 🔑 Environment Setup

1. **Copy Environment File**
   ```bash
   cp .env.example .env
   ```

2. **Add Your Credentials**
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

   # Gemini AI Configuration
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Get Gemini AI API Key**
   - Visit: [Google AI Studio](https://aistudio.google.com/)
   - Log in and generate your API key
   - Add it to your `.env` file

### 🚀 Installation

1. **Install Dependencies**
   ```bash
   npm install
   pip install -r requirements.txt
   ```

2. **Start the Application**
   ```bash
   npm run dev:full
   ```

   This starts both:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

---

## 🧭 User Guide

### Getting Started
1. **Create Account** - Sign up with your email and personal details
2. **Start Journaling** - Write or record your thoughts and feelings
3. **View Analytics** - Check your mood dashboard and calendar
4. **Explore Features** - Birthday celebrations and monthly rewinds

### Text Journaling  
Use the text editor to write your thoughts. The AI provides empathetic responses and mood feedback in real time.

### Audio Journaling  
Record your voice. The app transcribes it and analyzes the emotion behind your words.

### Dashboard & Analytics
- Browse previous entries by date, mood, or keywords
- View mood distribution charts and happiness index
- See your emotional journey on the calendar heatmap

### Special Features
- **Birthday Sparkles** - Automatic celebration on your birthday
- **Monthly Rewinds** - Comprehensive monthly wellness reports
- **Mood Calendar** - Visual representation of your emotional journey

---

## 🔐 Privacy and Security

- **Row-Level Security** - Users can only access their own data
- **Encrypted Storage** - All data encrypted at rest and in transit
- **No Data Sharing** - Your personal information is never shared
- **Secure Authentication** - Powered by Supabase Auth

---

## 🧱 Technical Architecture

### Frontend
- React + TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Supabase client for database operations

### Backend
- Python Flask for AI processing
- Google Gemini AI for mood analysis
- Supabase for database and authentication

### Database
- PostgreSQL (via Supabase)
- Comprehensive schema with 12+ tables
- Automatic triggers for mood analytics
- Row-level security policies

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow TypeScript and React best practices
4. Ensure responsive design
5. Test on multiple devices
6. Submit a pull request

---

## 🆘 Troubleshooting

### Database Connection Issues
- Verify your Supabase URL and API key in `.env`
- Check that the migration has been run in Supabase SQL Editor
- Ensure your Supabase project is active

### AI Not Working
- Check your Gemini API key in `.env`
- Verify internet connection
- App will use fallback responses if AI is unavailable

### Audio Recording Issues
- Check microphone permissions in browser
- Ensure no other apps are using the microphone
- Refresh the page if permissions were recently granted

---

## 📜 License

MIT License. See `LICENSE` for full terms.

---

**Solace Journal** - Your companion in emotional wellness and self-discovery. 💜