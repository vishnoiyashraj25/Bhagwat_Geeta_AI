# 📖 Bhagavad Gita AI Companion App

An AI-powered mobile application that helps users find guidance, stories, and mantras from the **Bhagavad Gita** based on their emotions and life situations.  
Built with **React Native**, **Node.js**, and **OpenAI LLM**.

---

## 🌟 Features
- 🎙️ **Speech-to-Text** – Users can speak their problems, which gets converted into text.
- 🤖 **AI-Powered Tagging** – The app detects the context (e.g., stress, self-doubt, job loss) and generates tags.
- 📚 **Personalized Content** – Based on tags, the app suggests:
  - Relevant Bhagavad Gita shlokas
  - Motivational stories
  - Mantras
  - Short explanations
- 🔊 **Text-to-Speech** – Converts the solution back into voice.
- 🌍 **Multi-language Support** – English & Hindi using i18n.
- 🔐 **Secure Authentication** – JWT-based login with optional OTP verification.

---


## 🚀 How It Works
1. User speaks or types their problem.  
2. AI generates tags from the input.  
3. System fetches relevant mantras, shlokas, or stories from DB.  
4. Response is customized and sent back to user.  
5. User can listen via Text-to-Speech.
