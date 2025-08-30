import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@/generated/prisma'

export interface ApiError extends Error {
  statusCode?: number
  code?: string
  meta?: any
}

export class AppError extends Error implements ApiError {
  statusCode: number
  code?: string
  meta?: any

  constructor(message: string, statusCode: number, code?: string, meta?: any) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.meta = meta
    this.name = 'AppError'
  }
}

export function handlePrismaError(error: any): ApiError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return new AppError(
          'A unique constraint would be violated. A record with this data already exists.',
          409,
          'UNIQUE_VIOLATION',
          error.meta
        )
      case 'P2003':
        return new AppError(
          'Foreign key constraint failed.',
          400,
          'FOREIGN_KEY_VIOLATION',
          error.meta
        )
      case 'P2025':
        return new AppError(
          'Record not found.',
          404,
          'NOT_FOUND',
          error.meta
        )
      case 'P2014':
        return new AppError(
          'The change you are trying to make would violate a required relation.',
          400,
          'RELATION_VIOLATION',
          error.meta
        )
      default:
        return new AppError(
          `Database error: ${error.message}`,
          400,
          error.code,
          error.meta
        )
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new AppError(
      'Invalid data provided to the database operation.',
      400,
      'VALIDATION_ERROR'
    )
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new AppError(
      'Failed to initialize database connection.',
      500,
      'DB_CONNECTION_ERROR'
    )
  }

  return error
}

export function errorResponse(error: any): NextResponse {
  // Handle known errors
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        meta: error.meta
      },
      { status: error.statusCode }
    )
  }

  // Handle Prisma errors
  const prismaError = handlePrismaError(error)
  if (prismaError !== error) {
    return errorResponse(prismaError)
  }

  // Log unexpected errors
  console.error('Unexpected error:', error)

  // Return generic error for unknown errors
  return NextResponse.json(
    {
      success: false,
      error: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR'
    },
    { status: 500 }
  )
}

// Async error handler wrapper for API routes
export function asyncHandler(fn: Function) {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      return await fn(req, ...args)
    } catch (error) {
      return errorResponse(error)
    }
  }
}
