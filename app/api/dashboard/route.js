import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Challenge from '@/models/Challenge'
import Task from '@/models/Task'

export async function GET() {
  try {
    await dbConnect()
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    // Get active challenges
    const activeChallenges = await Challenge.countDocuments({ isActive: true })
    
    // Get challenges created this week
    const challengesThisWeek = await Challenge.countDocuments({
      createdAt: { $gte: weekAgo },
      isActive: true
    })
    
    // Get today's tasks
    const todayTasks = await Task.countDocuments({
      date: { $gte: today, $lt: tomorrow }
    })
    
    // Get completed tasks today
    const completedTasks = await Task.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      completed: true
    })
    
    // Calculate completion rate for this week
    const weekTasks = await Task.find({
      date: { $gte: weekAgo, $lt: tomorrow }
    })
    
    const weekCompleted = weekTasks.filter(task => task.completed).length
    const completionRate = weekTasks.length > 0 ? Math.round((weekCompleted / weekTasks.length) * 100) : 0
    
    // Calculate current streak (simplified - based on consecutive days with completed tasks)
    const recentTasks = await Task.find({
      completed: true,
      date: { $gte: weekAgo }
    }).sort({ date: -1 })
    
    let currentStreak = 0
    const completedDates = new Set()
    recentTasks.forEach(task => {
      completedDates.add(task.date.toDateString())
    })
    
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      
      if (completedDates.has(checkDate.toDateString())) {
        currentStreak++
      } else {
        break
      }
    }
    
    const stats = {
      activeChallenges,
      challengesThisWeek,
      todayTasks,
      completedTasks,
      completionRate,
      currentStreak
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
