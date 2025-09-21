import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'

import './config/env.js'
import connectDB from './config/db.js'
import errorHandler from './middleware/errorHandler.js'

// Route imports
import ingestRoutes from './routes/ingest.js'
import textModerationRoutes from './routes/moderateText.js'
import audioModerationRoutes from './routes/moderateAudio.js'
import imageModerationRoutes from './routes/moderateImage.js'
import alertsRoutes from './routes/alerts.js'
import healthRoutes from './routes/health.js'

// Socket handler
import { setupSocketHandlers } from './sockets/incidentSocket.js'

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL 
      : "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/ingest', ingestRoutes)
app.use('/api/moderate/text', textModerationRoutes)
app.use('/api/moderate/audio', audioModerationRoutes)
app.use('/api/moderate/image', imageModerationRoutes)
app.use('/api/alerts', alertsRoutes)
app.use('/api/health', healthRoutes)

// Error handling
app.use(errorHandler)

// Socket setup
setupSocketHandlers(io)

// Connect to database
connectDB()

const PORT = process.env.PORT || 3001

// For local development only
if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...')
    await mongoose.connection.close()
    process.exit(0)
  })
}

// Export for Vercel deployment
export default app