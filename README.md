
# Solace Journal  
**Your Personal AI-Powered Journaling Companion**

Solace Journal is a privacy-first AI journaling application designed to support your emotional wellness journey. It enables users to reflect and express themselves through both text and audio entries, with real-time mood detection, voice-to-text transcription, and intuitive mood analytics. With cross-platform compatibility, a minimalist interface, and complete local data storage, Solace Journal ensures a secure and seamless journaling experience.

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

- **🔐 Privacy-First by Design**  
  All entries and user data are stored locally in your browser with zero server retention.

- **📱 Cross-Platform Compatibility**  
  Works seamlessly across desktop, tablet, and mobile devices.

---

## 🧩 Additional Highlights

- **⚡ Seamless Offline Capability**  
  Core features remain available offline for uninterrupted journaling.

- **🎛️ Customizable AI Tone**  
  Choose between calm, motivational, or neutral tones to suit your journaling mood.

- **🏷️ Entry Tagging & Smart Search**  
  Organize and retrieve entries easily using tags and keyword search.

- **🧘 Minimalist, Distraction-Free UI**  
  Clean design helps you focus on expressing yourself without clutter.

- **🚀 Lightweight & Fast**  
  Optimized for performance with low memory usage on any device.

- **🧑‍💻 Developer-Friendly**  
  Modular architecture and fallback support make it ideal for contributors.

- **🛣️ Transparent Roadmap**  
  Upcoming features include encrypted cloud sync, multi-language support, and advanced mood insights.

---

## 🛠️ Installation and Setup

### 🖥️ Requirements

- Python 3.8+
- Node.js 16+
- Google Gemini AI API key

### ⚙️ Configuration

1. **Get API Key**  
   - Visit: [Google AI Studio](https://aistudio.google.com/)
   - Log in and generate your API key

2. **Set Up Environment**  
   ```bash
   git clone <repository-url>
   cd solace-journal
   cp .env.example .env
   # Add your API key
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Install Dependencies**  
   ```bash
   pip install -r requirements.txt
   npm install
   ```

4. **Run Application**  
   ```bash
   npm run dev:full
   ```
   Access at:<br>
     - Frontend: `http://localhost:5173`
     - Backend: `http://localhost:5000`

---

## 🧭 User Guide

### Text Journaling  
Use the text editor to write your thoughts. The AI provides empathetic responses and mood feedback in real time.

### Audio Journaling  
Record your voice. The app transcribes it and analyzes the emotion behind your words.

### Reviewing & Insights  
- Browse previous entries by date, mood, or keywords.  
- View dashboards with emotion charts and analytics.

### Personalization  
Adjust tone, interface layout, and AI sensitivity to fit your preferences.

---

## 🔌 Developer & API Reference

### Commands
```bash
# Start backend only
npm run backend

# Start frontend only
npm run dev
```

### API Endpoints

| Endpoint           | Method | Purpose                              |
|--------------------|--------|--------------------------------------|
| `/health`          | GET    | Check service status                 |
| `/analyze-text`    | POST   | Analyze mood and generate responses |
| `/transcribe-audio`| POST   | Convert voice to text                |
| `/analyze-audio`   | POST   | Full audio analysis pipeline         |

---

## 🧪 Testing & Troubleshooting

- **AI Unavailable?**  
  - Check internet and API key  
  - App uses mock responses when offline

- **Audio Not Working?**  
  - Check mic permissions  
  - Close other apps using mic  
  - Refresh if newly granted

- **Startup Issues?**  
  - Ensure correct Python/Node.js versions  
  - Reinstall with `pip install -r requirements.txt`  
  - Ensure ports 5000 and 5173 are free

---

## 🔐 Privacy and Security

- **Local-Only Storage**  
  No data is sent to external servers.

- **Zero Retention AI**  
  Analysis is done in real-time with no logs.

- **Minimal External Dependencies**  
  App works offline except for API calls.

- **Future Enhancements**  
  Optional encrypted cloud sync with user-owned keys.

---

## 🧱 Technical Stack

### Frontend

- React + TypeScript  
- Tailwind CSS  
- Framer Motion

### Backend

- Python Flask  
- Google Gemini AI  
- Web Audio API

---

## 🤝 Contributing

1. Fork and create a feature branch  
2. Follow code conventions and ensure responsiveness  
3. Test on multiple devices  
4. Submit a clear pull request

### Guidelines

- Follow TypeScript best practices  
- Ensure accessibility and responsiveness  
- Prioritize user privacy

---

## 🙋 Support & Community

- **Report Bugs**: GitHub issues  
- **Request Features**: GitHub discussions  
- **Enterprise Support**: Contact core devs

---

## 📜 License

MIT License. See `LICENSE` for full terms.

---

Solace Journal stands as a commitment to accessible mental health support and strong data privacy. It is a companion in your emotional journey—not a replacement for professional help.
