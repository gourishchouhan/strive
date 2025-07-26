'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Plus, 
  Calendar, 
  Clock, 
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { formatDate, formatTime, getPriorityColor } from '@/lib/utils'

export default function SchedulePage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    fetchTasks()
  }, [currentDate])

  const fetchTasks = async () => {
    try {
      const dateString = currentDate.toISOString().split('T')[0]
      const response = await fetch(`/api/tasks?date=${dateString}`)
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
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
        setTasks(tasks.map(t => 
          t._id === taskId 
            ? { ...t, completed: !t.completed }
            : t
        ))
      }
    } catch (error) {
      console.error('Error toggling task:', error)
    }
  }

  const deleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setTasks(tasks.filter(t => t._id !== taskId))
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + direction)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const sortedTasks = tasks.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    return a.time.localeCompare(b.time)
  })

  const completedTasks = tasks.filter(t => t.completed).length
  const totalTasks = tasks.length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading schedule...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Daily Schedule</h1>
          <p className="text-muted-foreground">
            Manage your daily tasks and time slots
          </p>
        </div>
        <Link href="/schedule/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </Link>
      </div>

      {/* Date Navigation */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => navigateDate(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-semibold">{formatDate(currentDate)}</h2>
              </div>
              
              <Button variant="ghost" size="icon" onClick={() => navigateDate(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              {totalTasks > 0 && (
                <div className="text-sm text-muted-foreground">
                  {completedTasks} of {totalTasks} completed
                </div>
              )}
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      {sortedTasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Clock className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No tasks scheduled</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Add your first task for {formatDate(currentDate)} to get organized and stay productive.
            </p>
            <Link href="/schedule/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Task
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedTasks.map((task) => (
            <Card key={task._id} className={`transition-all ${task.completed ? 'opacity-60' : ''}`}>
              <CardContent className="py-4">
                <div className="flex items-center space-x-4">
                  <Checkbox 
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task._id)}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </h3>
                      <Badge className={getPriorityColor(task.priority)} variant="outline">
                        {task.priority}
                      </Badge>
                      {task.category && (
                        <Badge variant="outline" className="text-xs">
                          {task.category}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(task.time)}</span>
                      </div>
                      {task.description && (
                        <span className="truncate">{task.description}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => deleteTask(task._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
