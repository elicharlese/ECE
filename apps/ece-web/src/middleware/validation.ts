import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AppError } from './error-handler'

// Common validation schemas
export const schemas = {
  // Pagination
  pagination: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10)
  }),

  // User ID
  userId: z.string().min(1, 'User ID is required'),

  // Order creation
  createOrder: z.object({
    userId: z.string().min(1),
    projectType: z.string().min(1),
    title: z.string().min(1).max(200),
    description: z.string().min(1).max(5000),
    requirements: z.record(z.any()).optional(),
    timeline: z.enum(['RUSH_2_WEEKS', 'STANDARD_1_MONTH'])
  }),

  // Transaction creation
  createTransaction: z.object({
    userId: z.string().min(1),
    type: z.enum(['DEPOSIT', 'WITHDRAWAL', 'TRADE', 'PURCHASE']),
    amount: z.number().positive(),
    currency: z.string().default('ECE'),
    description: z.string().optional(),
    relatedId: z.string().optional()
  }),

  // Card creation
  createCard: z.object({
    userId: z.string().min(1),
    name: z.string().min(1).max(100),
    description: z.string().min(1).max(1000),
    imageUrl: z.string().url(),
    rarity: z.enum(['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY']),
    category: z.string().min(1),
    price: z.number().positive(),
    quantity: z.number().int().positive().default(1)
  }),

  // Trade offer creation
  createTradeOffer: z.object({
    fromUserId: z.string().min(1),
    toUserId: z.string().min(1),
    offeredCards: z.array(z.object({
      cardId: z.string().min(1),
      quantity: z.number().int().positive()
    })),
    requestedCards: z.array(z.object({
      cardId: z.string().min(1),
      quantity: z.number().int().positive()
    })),
    message: z.string().optional()
  }),

  // Authentication
  login: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  }),

  register: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6)
  })
}

// Validation middleware factory
export function validateBody<T>(schema: z.ZodSchema<T>) {
  return async (req: NextRequest) => {
    try {
      const body = await req.json()
      const validated = schema.parse(body)
      return validated
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError(
          'Validation failed',
          400,
          'VALIDATION_ERROR',
          error.errors
        )
      }
      throw error
    }
  }
}

export function validateQuery<T>(schema: z.ZodSchema<T>) {
  return (req: NextRequest) => {
    try {
      const url = new URL(req.url)
      const query = Object.fromEntries(url.searchParams)
      const validated = schema.parse(query)
      return validated
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError(
          'Query validation failed',
          400,
          'VALIDATION_ERROR',
          error.errors
        )
      }
      throw error
    }
  }
}

export function validateParams<T>(schema: z.ZodSchema<T>) {
  return (params: any) => {
    try {
      const validated = schema.parse(params)
      return validated
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError(
          'Parameter validation failed',
          400,
          'VALIDATION_ERROR',
          error.errors
        )
      }
      throw error
    }
  }
}

// Combined validation middleware
export function validationMiddleware(
  options: {
    body?: z.ZodSchema<any>
    query?: z.ZodSchema<any>
    params?: z.ZodSchema<any>
  } = {}
) {
  return async (handler: Function) => {
    return async (req: NextRequest, context?: any) => {
      try {
        const validated: any = {}

        // Validate body if schema provided
        if (options.body) {
          validated.body = await validateBody(options.body)(req)
        }

        // Validate query if schema provided
        if (options.query) {
          validated.query = validateQuery(options.query)(req)
        }

        // Validate params if schema provided
        if (options.params && context?.params) {
          validated.params = validateParams(options.params)(context.params)
        }

        // Add validated data to request
        const modifiedReq = req as any
        modifiedReq.validated = validated

        return handler(req, context)
      } catch (error) {
        if (error instanceof AppError) {
          return NextResponse.json(
            {
              success: false,
              error: error.message,
              code: error.code,
              details: error.meta
            },
            { status: error.statusCode }
          )
        }
        throw error
      }
    }
  }
}
