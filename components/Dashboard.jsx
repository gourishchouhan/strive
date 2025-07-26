'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Calendar, 
  Target, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Plus,
  MoreHorizontal
} from 'lucide-react'
import Link from 'next/link'
import { getCategoryColor, getPriorityColor, formatTime } from '@/lib/utils'

export default function DashboardStats({ stats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Challenges</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeChallenges}</div>
          <p className="text-xs text-muted-foreground">
            {stats.challengesThisWeek} new this week
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.todayTasks}</div>
          <p className="text-xs text-muted-foreground">
            {stats.completedTasks} completed
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.currentStreak}</div>
          <p className="text-xs text-muted-foreground">
            days in a row
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completionRate}%</div>
          <p className="text-xs text-muted-foreground">
            this week
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export function ActiveChallenges({ challenges, onToggleTask }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active Challenges</CardTitle>
        <Link href="/challenges">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenges.length === 0 ? (
          <div className="text-center py-8">
            <Target className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No active challenges</h3>
            <p className="text-muted-foreground">Create your first challenge to get started.</p>
            <Link href="/challenges/new">
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Challenge
              </Button>
            </Link>
          </div>
        ) : (
          challenges.slice(0, 3).map((challenge) => (
            <div key={challenge._id} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getCategoryColor(challenge.category)}`} />
                  <h4 className="font-medium">{challenge.title}</h4>
                </div>
                <Badge variant="outline">{challenge.category}</Badge>
              </div>
              
              <Progress value={challenge.progress} className="h-2" />
              
              <div className="text-sm text-muted-foreground">
                {challenge.progress}% complete • {challenge.dailyTasks?.filter(t => !t.completed).length || 0} tasks remaining
              </div>
              
              {challenge.dailyTasks?.slice(0, 2).map((task, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox 
                    checked={task.completed}
                    onCheckedChange={() => onToggleTask(challenge._id, index)}
                  />
                  <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

export function TodaySchedule({ tasks, onToggleTask }) {
  const sortedTasks = tasks.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    return a.time.localeCompare(b.time)
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Today's Schedule</CardTitle>
        <Link href="/schedule">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No tasks scheduled</h3>
            <p className="text-muted-foreground">Add your first task to get organized.</p>
            <Link href="/schedule/new">
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </Link>
          </div>
        ) : (
          sortedTasks.slice(0, 5).map((task) => (
            <div key={task._id} className="flex items-center space-x-3 p-3 border rounded-lg">
              <Checkbox 
                checked={task.completed}
                onCheckedChange={() => onToggleTask(task._id)}
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </h4>
                  <Badge className={getPriorityColor(task.priority)} variant="outline">
                    {task.priority}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(task.time)}</span>
                  {task.category && (
                    <>
                      <span>•</span>
                      <span>{task.category}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
