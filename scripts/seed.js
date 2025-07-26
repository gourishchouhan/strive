const mongoose = require('mongoose')

// Define schemas directly since this is a standalone script
const challengeSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  startDate: Date,
  endDate: Date,
  dailyTasks: [{
    title: String,
    description: String,
    completed: { type: Boolean, default: false },
    completedAt: Date
  }],
  progress: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  completedDates: [Date],
  streak: { type: Number, default: 0 }
}, { timestamps: true })

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  time: String,
  priority: String,
  completed: { type: Boolean, default: false },
  completedAt: Date,
  date: Date,
  category: String,
  challengeId: mongoose.Schema.Types.ObjectId
}, { timestamps: true })

const Challenge = mongoose.model('Challenge', challengeSchema)
const Task = mongoose.model('Task', taskSchema)

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    
    console.log('Connected to MongoDB')
    
    // Clear existing data
    await Challenge.deleteMany({})
    await Task.deleteMany({})
    
    console.log('Cleared existing data')
    
    // Sample challenges
    const sampleChallenges = [
      {
        title: "30-Day Fitness Challenge",
        description: "Get in shape with daily workouts and healthy habits",
        category: "fitness",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        dailyTasks: [
          { title: "30-minute workout", completed: false },
          { title: "Drink 8 glasses of water", completed: false },
          { title: "10,000 steps", completed: false }
        ]
      },
      {
        title: "Learn Programming",
        description: "Dedicate 1 hour daily to learning new programming concepts",
        category: "learning",
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        dailyTasks: [
          { title: "1 hour coding practice", completed: false },
          { title: "Read tech articles", completed: false },
          { title: "Work on side project", completed: false }
        ]
      },
      {
        title: "Mindfulness Journey",
        description: "Develop a daily meditation and mindfulness practice",
        category: "mindfulness",
        startDate: new Date(),
        endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        dailyTasks: [
          { title: "10-minute meditation", completed: false },
          { title: "Gratitude journaling", completed: false },
          { title: "Mindful breathing exercise", completed: false }
        ]
      }
    ]
    
    const createdChallenges = await Challenge.insertMany(sampleChallenges)
    console.log(`Created ${createdChallenges.length} sample challenges`)
    
    // Sample tasks for today
    const today = new Date()
    const sampleTasks = [
      {
        title: "Morning workout",
        description: "30 minutes of cardio and strength training",
        time: "07:00",
        priority: "high",
        date: today,
        category: "fitness",
        challengeId: createdChallenges[0]._id
      },
      {
        title: "Check emails",
        description: "Review and respond to important emails",
        time: "09:00",
        priority: "medium",
        date: today,
        category: "productivity"
      },
      {
        title: "Team meeting",
        description: "Weekly team sync and project updates",
        time: "10:30",
        priority: "high",
        date: today,
        category: "career"
      },
      {
        title: "Lunch break",
        description: "Healthy lunch and short walk",
        time: "12:30",
        priority: "low",
        date: today,
        category: "health"
      },
      {
        title: "Programming practice",
        description: "Work on React components and hooks",
        time: "15:00",
        priority: "high",
        date: today,
        category: "learning",
        challengeId: createdChallenges[1]._id
      },
      {
        title: "Evening meditation",
        description: "10 minutes of mindfulness meditation",
        time: "19:00",
        priority: "medium",
        date: today,
        category: "mindfulness",
        challengeId: createdChallenges[2]._id
      }
    ]
    
    const createdTasks = await Task.insertMany(sampleTasks)
    console.log(`Created ${createdTasks.length} sample tasks`)
    
    console.log('Sample data seeded successfully!')
    
  } catch (error) {
    console.error('Error seeding data:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Load environment variables if .env.local exists
try {
  const fs = require('fs')
  const path = require('path')
  const envPath = path.join(__dirname, '..', '.env.local')
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=')
      if (key && value) {
        process.env[key.trim()] = value.trim()
      }
    })
  }
} catch (error) {
  console.log('No .env.local file found, using default MongoDB URI')
}

seedData()
