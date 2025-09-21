import axios from 'axios'
import config from '../config/env.js'
import FormData from 'form-data'

const WHISPER_API_URL = 'https://api.openai.com/v1/audio/transcriptions'

export const transcribeAudio = async (audioBuffer) => {
  if (!config.openaiApiKey) {
    console.warn('OpenAI API key not configured, using mock transcription')
    return mockTranscription()
  }

  try {
    const formData = new FormData()
    formData.append('file', audioBuffer, {
      filename: 'audio.webm',
      contentType: 'audio/webm'
    })
    formData.append('model', 'whisper-1')
    formData.append('response_format', 'json')

    const response = await axios.post(WHISPER_API_URL, formData, {
      headers: {
        'Authorization': `Bearer ${config.openaiApiKey}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data.text
  } catch (error) {
    console.error('Whisper API error:', error.response?.data || error.message)
    return mockTranscription()
  }
}

function mockTranscription() {
  // Mock transcription for development
  const mockTranscripts = [
    "This is a sample transcription of audio content.",
    "Hello there, how are you doing today?",
    "I think this is a wonderful application for content moderation.",
    "Please don't say bad words or hateful things to other people."
  ]
  
  return mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)]
}