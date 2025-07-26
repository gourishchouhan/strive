import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatTime(time) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(`2000-01-01T${time}`))
}

export function calculateProgress(completed, total) {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

export function getStreakCount(completedDates) {
  if (!completedDates || completedDates.length === 0) return 0
  
  const sortedDates = completedDates.sort((a, b) => new Date(b) - new Date(a))
  let streak = 0
  let currentDate = new Date()
  
  for (let i = 0; i < sortedDates.length; i++) {
    const date = new Date(sortedDates[i])
    const expectedDate = new Date(currentDate)
    expectedDate.setDate(expectedDate.getDate() - i)
    
    if (date.toDateString() === expectedDate.toDateString()) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}

export function getCategoryColor(category) {
  const colors = {
    health: 'bg-green-500',
    fitness: 'bg-blue-500',
    learning: 'bg-purple-500',
    productivity: 'bg-orange-500',
    mindfulness: 'bg-pink-500',
    creativity: 'bg-yellow-500',
    social: 'bg-red-500',
    career: 'bg-indigo-500',
    other: 'bg-gray-500'
  }
  return colors[category] || colors.other
}

export function getPriorityColor(priority) {
  const colors = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-red-100 text-red-800 border-red-300'
  }
  return colors[priority] || colors.medium
}
