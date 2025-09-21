import mongoose from 'mongoose'
import Incident from '../backend/src/models/Incident.js'
import 'dotenv/config'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-moderation'

const demoIncidents = [
  {
    content: "This is a hateful message that should be flagged",
    type: "text",
    severity: "high",
    categories: {
      toxicity: 0.9,
      hate_speech: 0.8,
      insult: 0.7
    },
    scores: {
      toxicity: 0.9,
      hate_speech: 0.8,
      insult: 0.7
    },
    metadata: {
      messageId: "demo-1",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    }
  },
  {
    content: "Moderate inappropriate content detection",
    type: "text",
    severity: "medium",
    categories: {
      toxicity: 0.6,
      sexual_content: 0.5,
      profanity: 0.4
    },
    scores: {
      toxicity: 0.6,
      sexual_content: 0.5,
      profanity: 0.4
    },
    metadata: {
      messageId: "demo-2",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
    }
  }
]

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')
    
    // Clear existing data
    await Incident.deleteMany({})
    console.log('Cleared existing incidents')
    
    // Insert demo data
    await Incident.insertMany(demoIncidents)
    console.log('Inserted demo incidents')
    
    process.exit(0)
  } catch (error) {
    console.error('Error seeding data:', error)
    process.exit(1)
  }
}

seedData()