import { NextRequest, NextResponse } from 'next/server'
import { withAuth, getUserFromRequest } from './auth'
import { errorResponse, asyncHandler } from './error-handler'
import { loggingMiddleware } from './logger'
import { validationMiddleware } from './validation'

// Rate limiting store (in-memory for now, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limiting middleware
export function rateLimitMiddleware(
  limit: number = 100,
  windowMs: number = 60000 // 1 minute
) {
  return (handler: Function) => {
    return async (req: NextRequest, ...args: any[]) => {
      const userId = req.headers.get('x-user-id') || req.headers.get('x-forwarded-for') || 'anonymous'
      const key = `${userId}:${req.url}`
      const now = Date.now()
      
      const record = rateLimitStore.get(key)
      
      if (!record || record.resetTime < now) {
        rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
      } else if (record.count >= limit) {
        return NextResponse.json(
          {
            success: false,
            error: 'Too many requests',
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: Math.ceil((record.resetTime - now) / 1000)
          },
          { 
            status: 429,
            headers: {
              'Retry-After': Math.ceil((record.resetTime - now) / 1000).toString()
            }
          }
        )
      } else {
        record.count++
      }
      
      return handler(req, ...args)
    }
  }
}

// CORS middleware
export function corsMiddleware(
  options: {
    origin?: string | string[] | ((origin: string) => boolean)
    methods?: string[]
    headers?: string[]
    credentials?: boolean
  } = {}
) {
  const {
    origin = '*',
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    headers = ['Content-Type', 'Authorization'],
    credentials = true
  } = options

  return (handler: Function) => {
    return async (req: NextRequest, ...args: any[]) => {
      const response = await handler(req, ...args)
      
      // Set CORS headers
      const requestOrigin = req.headers.get('origin') || ''
      
      if (origin === '*') {
        response.headers.set('Access-Control-Allow-Origin', '*')
      } else if (typeof origin === 'string') {
        response.headers.set('Access-Control-Allow-Origin', origin)
      } else if (Array.isArray(origin) && origin.includes(requestOrigin)) {
        response.headers.set('Access-Control-Allow-Origin', requestOrigin)
      } else if (typeof origin === 'function' && origin(requestOrigin)) {
        response.headers.set('Access-Control-Allow-Origin', requestOrigin)
      }
      
      response.headers.set('Access-Control-Allow-Methods', methods.join(', '))
      response.headers.set('Access-Control-Allow-Headers', headers.join(', '))
      
      if (credentials) {
        response.headers.set('Access-Control-Allow-Credentials', 'true')
      }
      
      return response
    }
  }
}

// Compose multiple middleware
export function compose(...middlewares: Function[]) {
  return (handler: Function) => {
    return middlewares.reduceRight((acc, middleware) => {
      return middleware(acc)
    }, handler)
  }
}

// Main middleware configuration for API routes
export const apiMiddleware = (
  options: {
    auth?: boolean
    rateLimit?: { limit?: number; windowMs?: number }
    validation?: Parameters<typeof validationMiddleware>[0]
    cors?: Parameters<typeof corsMiddleware>[0]
  } = {}
) => {
  const middlewares: Function[] = []
  
  // Add CORS middleware
  if (options.cors !== false) {
    middlewares.push(corsMiddleware(options.cors || {}))
  }
  
  // Add rate limiting
  if (options.rateLimit !== false) {
    const { limit, windowMs } = options.rateLimit || {}
    middlewares.push(rateLimitMiddleware(limit, windowMs))
  }
  
  // Add logging
  middlewares.push(loggingMiddleware)
  
  // Add validation if schemas provided
  if (options.validation) {
    middlewares.push(validationMiddleware(options.validation))
  }
  
  // Add authentication if required
  if (options.auth) {
    middlewares.push(withAuth)
  }
  
  // Add error handling
  middlewares.push(asyncHandler)
  
  return compose(...middlewares)
}

// Export all middleware utilities
export {
  withAuth,
  getUserFromRequest,
  errorResponse,
  asyncHandler,
  loggingMiddleware,
  validationMiddleware
}

// Predefined middleware combinations
export const publicApiMiddleware = apiMiddleware({
  auth: false,
  rateLimit: { limit: 100, windowMs: 60000 }
})

export const protectedApiMiddleware = apiMiddleware({
  auth: true,
  rateLimit: { limit: 100, windowMs: 60000 }
})

export const adminApiMiddleware = apiMiddleware({
  auth: true,
  rateLimit: { limit: 1000, windowMs: 60000 }
})
