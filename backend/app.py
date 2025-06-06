import google.generativeai as genai
import os
from dotenv import load_dotenv
import mimetypes
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile
import base64

app = Flask(__name__)
CORS(app)

class GeminiService:
    def __init__(self):
        load_dotenv()
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")

        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('models/gemini-2.0-flash')

    def transcribe_audio(self, audio_data, mime_type='audio/mpeg'):
        """Transcribe an audio file using Gemini multimodal input."""
        try:
            prompt = "Please transcribe the attached audio file accurately. Only return the transcribed text, nothing else."

            response = self.model.generate_content(
                contents=[{
                    "role": "user",
                    "parts": [
                        {"text": prompt},
                        {"inline_data": {"mime_type": mime_type, "data": audio_data}}
                    ]
                }]
            )

            return response.text.strip() if response and hasattr(response, "text") else "Transcription failed."

        except Exception as e:
            return f"Error during transcription: {str(e)}"

    def analyze_text(self, user_input, user_tone_preference="calm"):
        """Analyze mood and generate a friendly, emotionally aware response."""
        try:
            tone_instructions = {
                "calm": "Use a soothing, gentle tone that brings peace and comfort.",
                "cheerful": "Use an upbeat, positive tone that spreads joy and optimism.",
                "thoughtful": "Use a reflective, insightful tone that encourages deep thinking."
            }
            
            tone_instruction = tone_instructions.get(user_tone_preference, tone_instructions["calm"])
            
            system_prompt = (
                "You are an emotionally intelligent AI journaling assistant called Solace. "
                "Your job is to analyze user-submitted content and provide emotional support. "
                f"{tone_instruction}\n\n"
                "Based on the content, assess the user's mood as one of: happy, neutral, or sad.\n\n"
                "If the user's mood appears sad, respond compassionately and offer comforting, encouraging words to uplift their mood. "
                "If the user is happy or neutral, be friendly and engaging — maintain or elevate their emotional state.\n\n"
                "Always aim to make the user feel heard, understood, and better than before. Use a warm, conversational tone and never judge the content. "
                "Keep responses concise but meaningful, emotionally aware, and human-like in tone. Do not ask probing or invasive questions."
            )

            mood_prompt = (
                "Analyze the following user input and return the result in the following JSON format:\n"
                "{\n"
                '  "summary": "A concise 2-3 sentence summary of the submission, capturing key points.",\n'
                '  "mood": "Based on the text classify the user\'s mood as either: happy, neutral, or sad",\n'
                '  "response": "Your empathetic response to help improve or maintain the user\'s emotional state",\n'
                '  "highlights": [\n'
                '    "Key moment or insight 1",\n'
                '    "Key moment or insight 2"\n'
                "  ]\n"
                "}\n\n"
                f"User input:\n{user_input}"
            )

            response = self.model.generate_content(
                contents=[
                    {"role": "user", "parts": [{"text": system_prompt}]},
                    {"role": "user", "parts": [{"text": mood_prompt}]}
                ]
            )

            if response and hasattr(response, "text"):
                raw_text = response.text.strip()

                # Clean up markdown formatting
                if raw_text.startswith("```") and raw_text.endswith("```"):
                    raw_text = raw_text.strip("```").strip()
                    if raw_text.startswith("json"):
                        raw_text = raw_text[4:].strip()

                try:
                    json_start = raw_text.find('{')
                    if json_start != -1:
                        json_data = raw_text[json_start:]
                        return json.loads(json_data)
                    else:
                        return json.loads(raw_text)
                except json.JSONDecodeError as e:
                    return {"error": f"JSON parsing failed: {str(e)}", "raw_response": raw_text}

            return {"error": "No response text received from Gemini."}

        except Exception as e:
            return {"error": str(e)}

# Initialize service
try:
    gemini_service = GeminiService()
    print("✅ Gemini service initialized successfully")
except Exception as e:
    print(f"❌ Failed to initialize Gemini service: {e}")
    gemini_service = None

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "gemini_available": gemini_service is not None})

@app.route('/analyze-text', methods=['POST'])
def analyze_text():
    if not gemini_service:
        return jsonify({"error": "Gemini service not available. Please check your API key."}), 500
    
    data = request.get_json()
    text = data.get('text', '')
    tone = data.get('tone', 'calm')
    
    if not text.strip():
        return jsonify({"error": "Text content is required"}), 400
    
    try:
        result = gemini_service.analyze_text(text, tone)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/transcribe-audio', methods=['POST'])
def transcribe_audio():
    if not gemini_service:
        return jsonify({"error": "Gemini service not available. Please check your API key."}), 500
    
    data = request.get_json()
    audio_base64 = data.get('audio', '')
    mime_type = data.get('mimeType', 'audio/mpeg')
    
    if not audio_base64:
        return jsonify({"error": "Audio data is required"}), 400
    
    try:
        # Decode base64 audio data
        audio_data = base64.b64decode(audio_base64)
        
        # Transcribe the audio
        transcription = gemini_service.transcribe_audio(audio_data, mime_type)
        
        return jsonify({"transcription": transcription})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analyze-audio', methods=['POST'])
def analyze_audio():
    if not gemini_service:
        return jsonify({"error": "Gemini service not available. Please check your API key."}), 500
    
    data = request.get_json()
    audio_base64 = data.get('audio', '')
    mime_type = data.get('mimeType', 'audio/mpeg')
    tone = data.get('tone', 'calm')
    
    if not audio_base64:
        return jsonify({"error": "Audio data is required"}), 400
    
    try:
        # Decode base64 audio data
        audio_data = base64.b64decode(audio_base64)
        
        # Transcribe the audio first
        transcription = gemini_service.transcribe_audio(audio_data, mime_type)
        
        if transcription.startswith("Error"):
            return jsonify({"error": transcription}), 500
        
        # Analyze the transcribed text
        analysis = gemini_service.analyze_text(transcription, tone)
        
        # Add transcription to the response
        if 'error' not in analysis:
            analysis['transcription'] = transcription
        
        return jsonify(analysis)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)