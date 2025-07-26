'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const categories = [
  { value: 'health', label: 'Health & Wellness' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'learning', label: 'Learning' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'mindfulness', label: 'Mindfulness' },
  { value: 'creativity', label: 'Creativity' },
  { value: 'social', label: 'Social' },
  { value: 'career', label: 'Career' },
  { value: 'other', label: 'Other' }
]

export default function NewChallengePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    dailyTasks: ['']
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }))
  }

  const addTask = () => {
    setFormData(prev => ({
      ...prev,
      dailyTasks: [...prev.dailyTasks, '']
    }))
  }

  const removeTask = (index) => {
    setFormData(prev => ({
      ...prev,
      dailyTasks: prev.dailyTasks.filter((_, i) => i !== index)
    }))
  }

  const updateTask = (index, value) => {
    setFormData(prev => ({
      ...prev,
      dailyTasks: prev.dailyTasks.map((task, i) => i === index ? value : task)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dailyTasks = formData.dailyTasks
        .filter(task => task.trim() !== '')
        .map(title => ({ title: title.trim(), completed: false }))

      const challengeData = {
        ...formData,
        dailyTasks
      }

      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(challengeData)
      })

      if (response.ok) {
        router.push('/challenges')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create challenge')
      }
    } catch (error) {
      console.error('Error creating challenge:', error)
      alert('Failed to create challenge')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center space-x-4">
        <Link href="/challenges">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create New Challenge</h1>
          <p className="text-muted-foreground">
            Set up a new self-improvement challenge with daily tasks
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Challenge Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Challenge Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., 30-Day Morning Routine"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={handleCategoryChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-input rounded-md text-sm resize-none"
                rows={3}
                placeholder="Describe your challenge and what you hope to achieve..."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Daily Tasks</Label>
                <Button type="button" variant="outline" size="sm" onClick={addTask}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Task
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.dailyTasks.map((task, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={task}
                      onChange={(e) => updateTask(index, e.target.value)}
                      placeholder={`Daily task ${index + 1}...`}
                      className="flex-1"
                    />
                    {formData.dailyTasks.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTask(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Creating...' : 'Create Challenge'}
              </Button>
              <Link href="/challenges">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
