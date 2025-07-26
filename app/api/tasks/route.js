import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Task from '@/models/Task'

export async function GET(request) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    
    let query = {}
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      
      query.date = {
        $gte: startDate,
        $lt: endDate
      }
    }
    
    const tasks = await Task.find(query)
      .populate('challengeId')
      .sort({ time: 1 })
    
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const { title, description, time, priority, date, category, challengeId } = body
    
    const task = new Task({
      title,
      description,
      time,
      priority,
      date: new Date(date),
      category,
      challengeId: challengeId || undefined
    })
    
    await task.save()
    
    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
