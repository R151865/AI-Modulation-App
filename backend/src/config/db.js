import mongoose from 'mongoose'
import config from './env.js'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    if (process.env.VERCEL) {
      throw error // Let Vercel handle the error in serverless environment
    } else {
      process.exit(1) // Only exit in local development
    }
  }
}

export default connectDB