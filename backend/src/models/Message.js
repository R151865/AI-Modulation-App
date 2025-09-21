import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  moderated: {
    type: Boolean,
    default: false
  },
  moderationResult: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
})

export default mongoose.model('Message', messageSchema)