import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  time: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  category: {
    type: String,
    enum: ['health', 'fitness', 'learning', 'productivity', 'mindfulness', 'creativity', 'social', 'career', 'other'],
    default: 'other'
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  }
}, {
  timestamps: true
})

// Index for efficient querying by date
taskSchema.index({ date: 1 })
taskSchema.index({ completed: 1 })

export default mongoose.models.Task || mongoose.model('Task', taskSchema)
