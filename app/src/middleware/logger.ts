import { NextRequest } from 'next/server'

export interface LogContext {
  userId?: string
  method: string
  path: string
  query?: any
  body?: any
  duration?: number
  error?: any
  statusCode?: number
}

export class Logger {
  private static instance: Logger
  private isDevelopment = process.env.NODE_ENV === 'development'

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private formatLog(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const baseLog = `[${timestamp}] ${level}: ${message}`
    
    if (!context) return baseLog
    
    const contextStr = Object.entries(context)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        if (key === 'body' && typeof value === 'object') {
          // Sanitize sensitive data
          const sanitized = { ...value }
          if (sanitized.password) sanitized.password = '[REDACTED]'
          if (sanitized.token) sanitized.token = '[REDACTED]'
          if (sanitized.refreshToken) sanitized.refreshToken = '[REDACTED]'
          return `${key}=${JSON.stringify(sanitized)}`
        }
        return `${key}=${typeof value === 'object' ? JSON.stringify(value) : value}`
      })
      .join(' ')
    
    return `${baseLog} ${contextStr}`
  }

  info(message: string, context?: LogContext): void {
    if (this.isDevelopment || context?.error) {
      console.log(this.formatLog('INFO', message, context))
    }
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatLog('WARN', message, context))
  }

  error(message: string, context?: LogContext): void {
    console.error(this.formatLog('ERROR', message, context))
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(this.formatLog('DEBUG', message, context))
    }
  }

  // Log API request
  logRequest(req: NextRequest, userId?: string): void {
    const url = new URL(req.url)
    this.info('API Request', {
      userId,
      method: req.method,
      path: url.pathname,
      query: Object.fromEntries(url.searchParams)
    })
  }

  // Log API response
  logResponse(req: NextRequest, statusCode: number, duration: number, userId?: string): void {
    const url = new URL(req.url)
    const level = statusCode >= 500 ? 'ERROR' : statusCode >= 400 ? 'WARN' : 'INFO'
    
    const logMethod = level === 'ERROR' ? this.error : level === 'WARN' ? this.warn : this.info
    
    logMethod.call(this, 'API Response', {
      userId,
      method: req.method,
      path: url.pathname,
      statusCode,
      duration
    })
  }

  // Log database query (for debugging)
  logQuery(operation: string, model: string, duration: number, userId?: string): void {
    if (this.isDevelopment) {
      this.debug('Database Query', {
        userId,
        method: operation,
        path: model,
        duration
      })
    }
  }
}

// Export singleton instance
export const logger = Logger.getInstance()

// Middleware to log requests and responses
export function loggingMiddleware(handler: Function) {
  return async (req: NextRequest, ...args: any[]) => {
    const startTime = Date.now()
    const userId = req.headers.get('x-user-id') || undefined
    
    // Log request
    logger.logRequest(req, userId)
    
    try {
      // Execute handler
      const response = await handler(req, ...args)
      
      // Log response
      const duration = Date.now() - startTime
      logger.logResponse(req, response.status, duration, userId)
      
      return response
    } catch (error) {
      // Log error
      const duration = Date.now() - startTime
      logger.error('Request failed', {
        userId,
        method: req.method,
        path: new URL(req.url).pathname,
        error: error instanceof Error ? error.message : String(error),
        duration
      })
      throw error
    }
  }
}
