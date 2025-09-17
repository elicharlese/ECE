import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/jwt'

export async function withAuth(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const payload = auth.verifyToken(token)
    
    // Add user info to headers for downstream use
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-user-id', payload.userId)
    requestHeaders.set('x-user-email', payload.email)
    requestHeaders.set('x-user-role', payload.role)
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    )
  }
}

// Helper to extract user from request
export function getUserFromRequest(req: NextRequest) {
  return {
    userId: req.headers.get('x-user-id'),
    email: req.headers.get('x-user-email'),
    role: req.headers.get('x-user-role'),
  }
}
