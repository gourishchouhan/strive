'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardStats, { ActiveChallenges, TodaySchedule } from '@/components/Dashboard'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
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
    if (status === 'loading') return // Still loading
    if (!session) {
      router.push('/auth') // Redirect to auth if not authenticated
      return
    }
    fetchDashboardData()
  }, [session, status, router])

  const fetchDashboardData = async () => {
    if (!session?.user?.id) return
    
    try {
      // Fetch dashboard stats
      const statsResponse = await fetch('/api/dashboard')
      const statsData = await statsResponse.json()
      setStats(statsData)

      // Fetch active challenges
      const challengesResponse = await fetch('/api/challenges')
      const challengesData = await challengesResponse.json()
      setChallenges(challengesData.filter(c => c.isActive).slice(0, 3))

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

  const toggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t._id === taskId)
      const updatedTask = { ...task, completed: !task.completed }

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
      })

      if (response.ok) {
        setTasks(tasks.map(t => t._id === taskId ? updatedTask : t))
        fetchDashboardData() // Refresh stats
      }
    } catch (error) {
      console.error('Error toggling task:', error)
    }
  }

  const toggleChallengeTask = async (challengeId, taskIndex) => {
    try {
      const challenge = challenges.find(c => c._id === challengeId)
      const updatedChallenge = { ...challenge }
      updatedChallenge.dailyTasks[taskIndex].completed = !updatedChallenge.dailyTasks[taskIndex].completed

      const response = await fetch(`/api/challenges/${challengeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedChallenge)
      })

      if (response.ok) {
        setChallenges(challenges.map(c => c._id === challengeId ? updatedChallenge : c))
        fetchDashboardData() // Refresh stats
      }
    } catch (error) {
      console.error('Error toggling challenge task:', error)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to auth
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {session.user.name}!</h1>
        <p className="text-muted-foreground">
          Here&apos;s your progress overview.
        </p>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid gap-8 lg:grid-cols-2">
        <ActiveChallenges 
          challenges={challenges} 
          onToggleTask={toggleChallengeTask}
        />
        <TodaySchedule 
          tasks={tasks} 
          onToggleTask={toggleTask}
        />
      </div>
    </div>
  )
}
