import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Task from '@/models/Task'

export async function PUT(request, { params }) {
  try {
    await dbConnect()
    
    const body = await request.json()
    
    // If marking as completed, add completedAt timestamp
    if (body.completed && !body.completedAt) {
      body.completedAt = new Date()
    } else if (!body.completed) {
      body.completedAt = null
    }
    
    const task = await Task.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect()
    
    const task = await Task.findByIdAndDelete(params.id)
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
