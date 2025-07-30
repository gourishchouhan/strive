import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  provider: {
    type: String,
    default: 'google',
  },
  providerId: {
    type: String,
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  preferences: {
    theme: {
      type: String,
      default: 'light',
    },
    notifications: {
      type: Boolean,
      default: true,
    },
  },
}, { timestamps: true })

// Create unique compound index for provider and providerId
userSchema.index({ provider: 1, providerId: 1 }, { unique: true })

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User
