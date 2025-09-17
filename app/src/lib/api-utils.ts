// Global error handler and validation utilities
import { NextRequest, NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export class ApiError extends Error {
  public statusCode: number
  public code?: string

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.name = 'ApiError'
  }
}

export function createApiResponse<T>(
  success: boolean,
  data?: T,
  error?: string,
  message?: string
): ApiResponse<T> {
  return {
    success,
    data,
    error,
    message,
    timestamp: new Date().toISOString()
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)

  if (error instanceof ApiError) {
    return NextResponse.json(
      createApiResponse(false, undefined, error.message),
      { status: error.statusCode }
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      createApiResponse(false, undefined, error.message),
      { status: 500 }
    )
  }

  return NextResponse.json(
    createApiResponse(false, undefined, 'An unexpected error occurred'),
    { status: 500 }
  )
}

// Validation utilities
export function validateRequired(fields: Record<string, any>, required: string[]): string | null {
  for (const field of required) {
    if (!fields[field] || fields[field] === '') {
      return `${field} is required`
    }
  }
  return null
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateUserId(userId: string): boolean {
  return Boolean(userId && userId.length > 0 && userId.startsWith('user_'))
}

// Rate limiting utilities
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minute
): boolean {
  const now = Date.now()
  const current = rateLimitMap.get(identifier)

  if (!current || now > current.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    })
    return true
  }

  if (current.count >= maxRequests) {
    return false
  }

  current.count++
  return true
}

// Middleware wrapper for API routes
export function withErrorHandling(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Apply rate limiting
      const clientIp = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       'unknown'
      if (!rateLimit(clientIp, 100, 60000)) {
        throw new ApiError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED')
      }

      return await handler(request)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

// CORS headers
export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

// Authentication utilities (mock for now)
export function extractUserFromToken(request: NextRequest): string | null {
  const authorization = request.headers.get('authorization')
  const token = authorization?.replace('Bearer ', '')
  
  if (!token) {
    return null
  }

  // Mock JWT validation - replace with real JWT verification
  if (token.startsWith('jwt_token_')) {
    return 'user_pro_001' // Mock user ID
  }

  return null
}

export function requireAuth(request: NextRequest): string {
  const userId = extractUserFromToken(request)
  if (!userId) {
    throw new ApiError('Authentication required', 401, 'AUTH_REQUIRED')
  }
  return userId
}
