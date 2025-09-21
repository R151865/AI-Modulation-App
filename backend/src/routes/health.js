// backend/src/routes/health.js (add this to your existing file)
import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'AI Moderation API Server',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      textModeration: '/api/moderate/text',
      audioModeration: '/api/moderate/audio',
      imageModeration: '/api/moderate/image',
      alerts: '/api/alerts'
    }
  })
})

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() })
})

export default router