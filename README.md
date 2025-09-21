# AI Moderation App

A real-time content moderation application that uses AI to detect and flag inappropriate content in text, audio, and images.

## Features

- Text moderation using Perspective API and OpenAI
- Audio transcription and moderation using Whisper
- Image content moderation using OpenAI's vision capabilities
- Real-time alerts and dashboard
- Multiple content thresholds configuration

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and configure your API keys
3. Run `docker-compose up` to start the application
4. Access the frontend at http://localhost:3000

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key
- `PERSPECTIVE_API_KEY`: Google Perspective API key
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Backend server port (default: 3001)# AI-Modulation-App
