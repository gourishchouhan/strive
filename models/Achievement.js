import mongoose from 'mongoose'

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['streak', 'completion', 'challenge', 'task_count', 'category'],
    required: true
  },
  requirement: {
    type: Number,
    required: true
  },
  category: {
    type: String
  },
  unlockedAt: {
    type: Date
  },
  isUnlocked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export default mongoose.models.Achievement || mongoose.model('Achievement', achievementSchema)
