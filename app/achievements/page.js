'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Trophy, 
  Medal, 
  Star, 
  Target, 
  Zap, 
  Calendar,
  CheckCircle,
  Lock,
  Unlock
} from 'lucide-react'

const achievementTemplates = [
  {
    id: 'first_task',
    title: 'Getting Started',
    description: 'Complete your first task',
    icon: 'CheckCircle',
    type: 'task_count',
    requirement: 1,
    category: 'milestone'
  },
  {
    id: 'task_master_10',
    title: 'Task Master',
    description: 'Complete 10 tasks',
    icon: 'Target',
    type: 'task_count',
    requirement: 10,
    category: 'milestone'
  },
  {
    id: 'task_master_50',
    title: 'Task Champion',
    description: 'Complete 50 tasks',
    icon: 'Medal',
    type: 'task_count',
    requirement: 50,
    category: 'milestone'
  },
  {
    id: 'task_master_100',
    title: 'Task Legend',
    description: 'Complete 100 tasks',
    icon: 'Trophy',
    type: 'task_count',
    requirement: 100,
    category: 'milestone'
  },
  {
    id: 'streak_3',
    title: 'Consistency Starter',
    description: 'Maintain a 3-day streak',
    icon: 'Zap',
    type: 'streak',
    requirement: 3,
    category: 'streak'
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'Star',
    type: 'streak',
    requirement: 7,
    category: 'streak'
  },
  {
    id: 'streak_30',
    title: 'Month Master',
    description: 'Maintain a 30-day streak',
    icon: 'Trophy',
    type: 'streak',
    requirement: 30,
    category: 'streak'
  },
  {
    id: 'first_challenge',
    title: 'Challenge Accepted',
    description: 'Create your first challenge',
    icon: 'Target',
    type: 'challenge',
    requirement: 1,
    category: 'milestone'
  },
  {
    id: 'challenge_complete',
    title: 'Goal Achiever',
    description: 'Complete your first challenge',
    icon: 'Medal',
    type: 'completion',
    requirement: 1,
    category: 'milestone'
  },
  {
    id: 'health_enthusiast',
    title: 'Health Enthusiast',
    description: 'Complete 10 health-related tasks',
    icon: 'Star',
    type: 'category',
    requirement: 10,
    category: 'health'
  },
  {
    id: 'fitness_guru',
    title: 'Fitness Guru',
    description: 'Complete 10 fitness tasks',
    icon: 'Zap',
    type: 'category',
    requirement: 10,
    category: 'fitness'
  },
  {
    id: 'learning_lover',
    title: 'Learning Lover',
    description: 'Complete 10 learning tasks',
    icon: 'Star',
    type: 'category',
    requirement: 10,
    category: 'learning'
  }
]

const getIconComponent = (iconName) => {
  const icons = {
    CheckCircle,
    Target,
    Medal,
    Trophy,
    Zap,
    Star,
    Calendar,
    Lock,
    Unlock
  }
  return icons[iconName] || Trophy
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([])
  const [userStats, setUserStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    currentStreak: 0,
    totalChallenges: 0,
    completedChallenges: 0,
    categoryStats: {}
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const fetchData = useCallback(async () => {
    try {
      const [tasksRes, challengesRes, dashboardRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/challenges'),
        fetch('/api/dashboard')
      ])

      const tasks = await tasksRes.json()
      const challenges = await challengesRes.json()
      const dashboard = await dashboardRes.json()

      // Calculate category stats
      const categoryStats = {}
      tasks.forEach(task => {
        if (task.category && task.completed) {
          categoryStats[task.category] = (categoryStats[task.category] || 0) + 1
        }
      })

      const stats = {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.completed).length,
        currentStreak: dashboard.currentStreak,
        totalChallenges: challenges.length,
        completedChallenges: challenges.filter(c => c.progress === 100).length,
        categoryStats
      }

      setUserStats(stats)
      
      // Calculate achievement progress
      const processedAchievements = achievementTemplates.map(template => {
        const progress = calculateProgress(template, stats)
        return {
          ...template,
          progress,
          isUnlocked: progress >= 100,
          unlockedAt: progress >= 100 ? new Date() : null
        }
      })

      setAchievements(processedAchievements)
    } catch (error) {
      console.error('Error fetching achievements data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const calculateProgress = (achievement, stats) => {
    switch (achievement.type) {
      case 'task_count':
        return Math.min(100, Math.round((stats.completedTasks / achievement.requirement) * 100))
      
      case 'streak':
        return Math.min(100, Math.round((stats.currentStreak / achievement.requirement) * 100))
      
      case 'challenge':
        return Math.min(100, Math.round((stats.totalChallenges / achievement.requirement) * 100))
      
      case 'completion':
        return Math.min(100, Math.round((stats.completedChallenges / achievement.requirement) * 100))
      
      case 'category':
        const categoryCount = stats.categoryStats[achievement.category] || 0
        return Math.min(100, Math.round((categoryCount / achievement.requirement) * 100))
      
      default:
        return 0
    }
  }

  const unlockedAchievements = achievements.filter(a => a.isUnlocked)
  const lockedAchievements = achievements.filter(a => !a.isUnlocked)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading achievements...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Achievements</h1>
        <p className="text-muted-foreground">
          Unlock badges and celebrate your progress milestones
        </p>
      </div>

      {/* Achievement Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unlocked</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{unlockedAchievements.length}</div>
            <p className="text-xs text-muted-foreground">
              of {achievements.length} achievements
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              total tasks
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Zap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">
              days in a row
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Challenges Done</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.completedChallenges}</div>
            <p className="text-xs text-muted-foreground">
              completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
            Unlocked Achievements
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {unlockedAchievements.map((achievement) => {
              const IconComponent = getIconComponent(achievement.icon)
              return (
                <Card key={achievement.id} className="border-yellow-200 bg-yellow-50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-yellow-100 rounded-full">
                        <IconComponent className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-yellow-800">{achievement.title}</h3>
                        <p className="text-sm text-yellow-600">{achievement.description}</p>
                        <Badge className="mt-2 bg-yellow-500 text-white">
                          Unlocked!
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Lock className="mr-2 h-6 w-6 text-muted-foreground" />
            In Progress
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lockedAchievements.map((achievement) => {
              const IconComponent = getIconComponent(achievement.icon)
              return (
                <Card key={achievement.id} className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="p-3 bg-gray-100 rounded-full">
                        <IconComponent className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-700">{achievement.title}</h3>
                        <p className="text-sm text-gray-500">{achievement.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {achievements.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Trophy className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No achievements yet</h3>
            <p className="text-muted-foreground text-center">
              Start completing tasks and challenges to unlock your first achievements!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
