import dotenv from 'dotenv'

dotenv.config()

export default {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3001,
  openaiApiKey: process.env.OPENAI_API_KEY,
  perspectiveApiKey: process.env.PERSPECTIVE_API_KEY,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-moderation'
}