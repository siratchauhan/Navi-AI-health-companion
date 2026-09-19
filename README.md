# 🌙 Navi - Your Safe Space for Growing Up

**An anonymous, AI-powered health companion designed specifically for adolescents navigating puberty, mental health, and growing up.**

> **Hackathon Track:** Adolescent Health & AI Navigation

Teens often have sensitive questions about their changing bodies and emotions, but feel too embarrassed to ask adults. Googling often leads to misinformation, anxiety-inducing results, or toxic social media trends. **Navi** is the solution: a safe, empathetic, and medically-informed AI that acts like a supportive older sibling.

## ✨ Features

- **🔒 100% Anonymous & Private:** No databases, no logins, no tracking. 
- **👻 Ghost Mode:** Press the `Escape` key at any time to instantly wipe the screen and erase the chat history. Perfect for shared computers or if someone walks into the room.
- **🛡️ Strict AI Guardrails:** Powered by Gemini, Navi is heavily prompted to *never* give medical diagnoses, and it will strictly refuse to answer off-topic questions (e.g., coding, politics). It exists purely for health education.
- **🎙️ Voice Search (Speech-to-Text):** Built-in Google-style microphone allows teens to ask questions using their voice (Zero latency, powered by native Web Speech API).
- **🔊 Read Aloud (Text-to-Speech):** Navi can read its answers out loud, making it accessible for teens with reading difficulties or those who prefer listening.

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, Vanilla CSS
- **AI Integration:** Google Gemini API (with OpenAI GPT-4o-mini fallback)
- **Accessibility:** Native Browser Web Speech API (`SpeechRecognition` & `speechSynthesis`)
- **Deployment:** Vercel

## 🚀 Getting Started Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/siratchauhan/Navi-AI-health-companion.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your API keys:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser (Chrome/Edge recommended for Voice Search).

## ⚠️ Disclaimer
Navi is an AI educational assistant, not a medical professional. For emergencies, always contact a trusted adult or local emergency services.
