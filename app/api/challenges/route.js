import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Challenge from '@/models/Challenge'

export async function GET() {
  try {
    await dbConnect()
    
    const challenges = await Challenge.find({ isActive: true })
      .sort({ createdAt: -1 })
    
    return NextResponse.json(challenges)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const { title, description, category, startDate, endDate, dailyTasks } = body
    
    const challenge = new Challenge({
      title,
      description,
      category,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      dailyTasks: dailyTasks || []
    })
    
    await challenge.save()
    
    return NextResponse.json(challenge, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    )
  }
}
