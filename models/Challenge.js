import mongoose from 'mongoose'

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['health', 'fitness', 'learning', 'productivity', 'mindfulness', 'creativity', 'social', 'career', 'other']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  dailyTasks: [{
    title: String,
    description: String,
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  completedDates: [{
    type: Date
  }],
  streak: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Calculate progress before saving
challengeSchema.pre('save', function(next) {
  if (this.dailyTasks && this.dailyTasks.length > 0) {
    const completedTasks = this.dailyTasks.filter(task => task.completed).length
    this.progress = Math.round((completedTasks / this.dailyTasks.length) * 100)
  }
  next()
})

export default mongoose.models.Challenge || mongoose.model('Challenge', challengeSchema)
