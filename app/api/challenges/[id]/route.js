import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Challenge from '@/models/Challenge'

export async function GET(request, { params }) {
  try {
    await dbConnect()
    
    const challenge = await Challenge.findById(params.id)
    
    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(challenge)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch challenge' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect()
    
    const body = await request.json()
    
    const challenge = await Challenge.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )
    
    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(challenge)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update challenge' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect()
    
    const challenge = await Challenge.findByIdAndDelete(params.id)
    
    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Challenge deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete challenge' },
      { status: 500 }
    )
  }
}
