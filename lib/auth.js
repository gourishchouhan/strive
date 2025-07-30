import { getServerSession } from "next-auth/next"
import { NextResponse } from 'next/server'

export async function getAuthenticatedUser() {
  try {
    const session = await getServerSession()
    if (!session || !session.user?.id) {
      return null
    }
    return session.user
  } catch (error) {
    console.error('Error getting authenticated user:', error)
    return null
  }
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized. Please sign in.' },
    { status: 401 }
  )
}
