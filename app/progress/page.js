'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  CheckCircle,
  Activity,
  Award
} from 'lucide-react'
import { getCategoryColor } from '@/lib/utils'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0']

export default function ProgressPage() {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState({
    weeklyProgress: [],
    categoryStats: [],
    challengeProgress: [],
    overallStats: {
      totalTasks: 0,
      completedTasks: 0,
      activeChallenges: 0,
      completionRate: 0,
      currentStreak: 0,
      totalStreak: 0
    }
  })

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const fetchAnalytics = useCallback(async () => {
    try {
      // Fetch all data needed for analytics
      const [tasksRes, challengesRes, dashboardRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/challenges'),
        fetch('/api/dashboard')
      ])

      const tasks = await tasksRes.json()
      const challenges = await challengesRes.json()
      const dashboard = await dashboardRes.json()

      // Process weekly progress
      const weeklyData = getWeeklyProgress(tasks)
      
      // Process category statistics
      const categoryData = getCategoryStats(tasks, challenges)
      
      // Process challenge progress
      const challengeData = challenges.filter(c => c.isActive).map(challenge => ({
        name: challenge.title,
        progress: challenge.progress,
        category: challenge.category
      }))

      setAnalytics({
        weeklyProgress: weeklyData,
        categoryStats: categoryData,
        challengeProgress: challengeData,
        overallStats: {
          totalTasks: tasks.length,
          completedTasks: tasks.filter(t => t.completed).length,
          activeChallenges: challenges.filter(c => c.isActive).length,
          completionRate: dashboard.completionRate,
          currentStreak: dashboard.currentStreak,
          totalStreak: dashboard.currentStreak // Simplified for demo
        }
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const getWeeklyProgress = (tasks) => {
    const last7Days = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.date)
        return taskDate.toDateString() === date.toDateString()
      })
      
      const completed = dayTasks.filter(t => t.completed).length
      const total = dayTasks.length
      
      last7Days.push({
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
      })
    }
    
    return last7Days
  }

  const getCategoryStats = (tasks, challenges) => {
    const categories = {}
    
    // Count tasks by category
    tasks.forEach(task => {
      if (task.category) {
        if (!categories[task.category]) {
          categories[task.category] = { total: 0, completed: 0 }
        }
        categories[task.category].total++
        if (task.completed) {
          categories[task.category].completed++
        }
      }
    })
    
    // Count challenges by category
    challenges.forEach(challenge => {
      if (!categories[challenge.category]) {
        categories[challenge.category] = { total: 0, completed: 0, challenges: 0 }
      }
      if (!categories[challenge.category].challenges) {
        categories[challenge.category].challenges = 0
      }
      categories[challenge.category].challenges++
    })
    
    return Object.entries(categories).map(([category, data]) => ({
      category,
      ...data,
      completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading progress analytics...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Progress & Analytics</h1>
        <p className="text-muted-foreground">
          Track your achievements and analyze your growth patterns
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overallStats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.overallStats.completedTasks} completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Challenges</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overallStats.activeChallenges}</div>
            <p className="text-xs text-muted-foreground">
              in progress
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overallStats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overallStats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">
              days in a row
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#8884d8" name="Completed" />
              <Bar dataKey="total" fill="#82ca9d" name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Challenge Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Challenge Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.challengeProgress.length === 0 ? (
              <div className="text-center py-8">
                <Target className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground mt-2">No active challenges</p>
              </div>
            ) : (
              analytics.challengeProgress.map((challenge, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{challenge.name}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {challenge.category}
                      </Badge>
                      <span className="text-sm">{challenge.progress}%</span>
                    </div>
                  </div>
                  <Progress value={challenge.progress} className="h-2" />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Category Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.categoryStats.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground mt-2">No category data available</p>
              </div>
            ) : (
              analytics.categoryStats.map((category, index) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getCategoryColor(category.category)}`} />
                      <span className="text-sm font-medium capitalize">{category.category}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {category.completed}/{category.total} tasks
                      {category.challenges && ` • ${category.challenges} challenges`}
                    </div>
                  </div>
                  <Progress value={category.completionRate} className="h-2" />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
