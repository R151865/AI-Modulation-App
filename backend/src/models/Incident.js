import mongoose from 'mongoose'

const incidentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'audio', 'image'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  categories: {
    type: Map,
    of: Number,
    required: true
  },
  scores: {
    type: Map,
    of: Number,
    required: true
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

// Index for faster queries
incidentSchema.index({ timestamp: -1 })
incidentSchema.index({ severity: 1 })
incidentSchema.index({ type: 1 })

export default mongoose.model('Incident', incidentSchema)