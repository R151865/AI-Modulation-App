import axios from 'axios'

// For Vercel deployment, API is served from the same domain
// For local development, use environment variable or fallback to localhost:3001
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD ? '' : 'http://localhost:3001')

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Text moderation
export const checkText = async (text) => {
  try {
    const response = await api.post('/api/ingest/text', { 
      text,
      id: `msg_${Date.now()}`,
      timestamp: new Date().toISOString()
    })
    return response.data
  } catch (error) {
    console.error('Error checking text:', error)
    throw error
  }
}

// Send message (for chat)
export const sendMessage = async (message) => {
  try {
    const response = await api.post('/api/ingest/text', {
      text: message,
      id: `msg_${Date.now()}`,
      timestamp: new Date().toISOString()
    })
    return response.data
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
}

// Audio moderation
export const uploadAudio = async (audioFile) => {
  try {
    const formData = new FormData()
    formData.append('audio', audioFile)
    
    const response = await api.post('/api/ingest/audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error uploading audio:', error)
    throw error
  }
}

export const checkAudio = async (audioData) => {
  try {
    const response = await api.post('/api/ingest/audio', audioData)
    return response.data
  } catch (error) {
    console.error('Error checking audio:', error)
    throw error
  }
}

// Image moderation
export const uploadImage = async (imageFile) => {
  try {
    const formData = new FormData()
    formData.append('image', imageFile)
    
    const response = await api.post('/api/ingest/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

export const checkImage = async (imageData) => {
  try {
    const response = await api.post('/api/ingest/image', imageData)
    return response.data
  } catch (error) {
    console.error('Error checking image:', error)
    throw error
  }
}

// Moderator panel functions
export const getIncidents = async () => {
  try {
    const response = await api.get('/api/alerts')
    return response.data
  } catch (error) {
    console.error('Error getting incidents:', error)
    throw error
  }
}

export const getStats = async () => {
  try {
    const response = await api.get('/api/health')
    return response.data
  } catch (error) {
    console.error('Error getting stats:', error)
    throw error
  }
}

export default api