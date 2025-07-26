'use client'

import { useState, useEffect } from 'react'
import DashboardStats, { ActiveChallenges, TodaySchedule } from '@/components/Dashboard'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    activeChallenges: 0,
    challengesThisWeek: 0,
    todayTasks: 0,
    completedTasks: 0,
    completionRate: 0,
    currentStreak: 0
  })
  const [challenges, setChallenges] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard stats
      const statsResponse = await fetch('/api/dashboard')
      const statsData = await statsResponse.json()
      setStats(statsData)

      // Fetch active challenges
      const challengesResponse = await fetch('/api/challenges')
      const challengesData = await challengesResponse.json()
      setChallenges(challengesData)

      // Fetch today's tasks
      const today = new Date().toISOString().split('T')[0]
      const tasksResponse = await fetch(`/api/tasks?date=${today}`)
      const tasksData = await tasksResponse.json()
      setTasks(tasksData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t._id === taskId)
      const updatedTask = { ...task, completed: !task.completed }
      
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
      })

      if (response.ok) {
        setTasks(tasks.map(t => 
          t._id === taskId 
            ? { ...t, completed: !t.completed }
            : t
        ))
        // Refresh stats after task completion
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Error toggling task:', error)
    }
  }

  const handleToggleChallengeTask = async (challengeId, taskIndex) => {
    try {
      const challenge = challenges.find(c => c._id === challengeId)
      const updatedTasks = [...challenge.dailyTasks]
      updatedTasks[taskIndex].completed = !updatedTasks[taskIndex].completed
      
      if (updatedTasks[taskIndex].completed) {
        updatedTasks[taskIndex].completedAt = new Date()
      } else {
        updatedTasks[taskIndex].completedAt = null
      }

      const response = await fetch(`/api/challenges/${challengeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dailyTasks: updatedTasks })
      })

      if (response.ok) {
        setChallenges(challenges.map(c => 
          c._id === challengeId 
            ? { ...c, dailyTasks: updatedTasks }
            : c
        ))
        // Refresh stats after challenge task completion
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Error toggling challenge task:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your progress overview.
        </p>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid gap-8 lg:grid-cols-2">
        <ActiveChallenges 
          challenges={challenges} 
          onToggleTask={handleToggleChallengeTask}
        />
        <TodaySchedule 
          tasks={tasks} 
          onToggleTask={handleToggleTask}
        />
      </div>
    </div>
  )
}
