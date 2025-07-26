'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Target, 
  Calendar, 
  Trash2, 
  Edit,
  Clock
} from 'lucide-react'
import { getCategoryColor, formatDate } from '@/lib/utils'

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChallenges()
  }, [])

  const fetchChallenges = async () => {
    try {
      const response = await fetch('/api/challenges')
      const data = await response.json()
      setChallenges(data)
    } catch (error) {
      console.error('Error fetching challenges:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteChallenge = async (id) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return
    
    try {
      const response = await fetch(`/api/challenges/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setChallenges(challenges.filter(c => c._id !== id))
      }
    } catch (error) {
      console.error('Error deleting challenge:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading challenges...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Challenges</h1>
          <p className="text-muted-foreground">
            Create and manage your self-improvement challenges
          </p>
        </div>
        <Link href="/challenges/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Challenge
          </Button>
        </Link>
      </div>

      {challenges.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Target className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No challenges yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Start your self-improvement journey by creating your first challenge. 
              Break down your goals into daily tasks and track your progress.
            </p>
            <Link href="/challenges/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Challenge
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge) => (
            <Card key={challenge._id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(challenge.category)}`} />
                    <Badge variant="outline" className="text-xs">
                      {challenge.category}
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => deleteChallenge(challenge._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg">{challenge.title}</CardTitle>
                {challenge.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {challenge.description}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <Progress value={challenge.progress} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(challenge.startDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{challenge.dailyTasks?.length || 0} tasks</span>
                  </div>
                </div>
                
                {challenge.dailyTasks && challenge.dailyTasks.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Daily Tasks:</h4>
                    <div className="space-y-1">
                      {challenge.dailyTasks.slice(0, 3).map((task, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                            {task.title}
                          </span>
                        </div>
                      ))}
                      {challenge.dailyTasks.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{challenge.dailyTasks.length - 3} more tasks
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="pt-2">
                  <Link href={`/challenges/${challenge._id}`}>
                    <Button variant="outline" className="w-full" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
