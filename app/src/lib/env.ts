import { z } from 'zod'

// Environment variable schema
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  
  // Authentication
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  PORT: z.string().default('3000'),
  
  // External Services (optional)
  REDIS_URL: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),
  
  // Email (optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  
  // Analytics (optional)
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  SENTRY_DSN: z.string().optional()
})

// Parsed environment variables
type Env = z.infer<typeof envSchema>

class EnvConfig {
  private static instance: EnvConfig
  private env: Env | null = null
  private errors: z.ZodError | null = null

  private constructor() {
    this.validate()
  }

  static getInstance(): EnvConfig {
    if (!EnvConfig.instance) {
      EnvConfig.instance = new EnvConfig()
    }
    return EnvConfig.instance
  }

  private validate(): void {
    try {
      this.env = envSchema.parse(process.env)
      console.log('✅ Environment variables validated successfully')
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.errors = error
        console.error('❌ Environment variable validation failed:')
        error.errors.forEach(err => {
          console.error(`  - ${err.path.join('.')}: ${err.message}`)
        })
        
        // In production, throw error to prevent startup
        if (process.env.NODE_ENV === 'production') {
          throw new Error('Environment variable validation failed')
        }
      } else {
        throw error
      }
    }
  }

  get(): Env {
    if (!this.env) {
      throw new Error('Environment variables not properly initialized')
    }
    return this.env
  }

  getErrors(): z.ZodError | null {
    return this.errors
  }

  isValid(): boolean {
    return this.env !== null && this.errors === null
  }

  // Utility methods for common env vars
  isDevelopment(): boolean {
    return this.env?.NODE_ENV === 'development'
  }

  isProduction(): boolean {
    return this.env?.NODE_ENV === 'production'
  }

  isTest(): boolean {
    return this.env?.NODE_ENV === 'test'
  }

  getDatabaseUrl(): string {
    return this.env?.DATABASE_URL || ''
  }

  getJwtSecret(): string {
    return this.env?.JWT_SECRET || ''
  }

  getAppUrl(): string {
    return this.env?.NEXT_PUBLIC_APP_URL || `http://localhost:${this.env?.PORT || '3000'}`
  }

  // Check if external services are configured
  hasRedis(): boolean {
    return !!this.env?.REDIS_URL
  }

  hasStripe(): boolean {
    return !!this.env?.STRIPE_SECRET_KEY
  }

  hasAWS(): boolean {
    return !!this.env?.AWS_ACCESS_KEY_ID && !!this.env?.AWS_SECRET_ACCESS_KEY
  }

  hasEmail(): boolean {
    return !!this.env?.SMTP_HOST && !!this.env?.SMTP_USER
  }

  hasAnalytics(): boolean {
    return !!this.env?.GOOGLE_ANALYTICS_ID || !!this.env?.SENTRY_DSN
  }
}

// Export singleton instance
export const envConfig = EnvConfig.getInstance()

// Export for direct use
export const env = envConfig.get()

// Health check endpoint data
export function getEnvHealth() {
  const config = envConfig
  const isValid = config.isValid()
  const errors = config.getErrors()
  
  return {
    status: isValid ? 'healthy' : 'degraded',
    environment: process.env.NODE_ENV || 'unknown',
    checks: {
      database: !!process.env.DATABASE_URL,
      authentication: !!process.env.JWT_SECRET,
      redis: config.hasRedis(),
      stripe: config.hasStripe(),
      aws: config.hasAWS(),
      email: config.hasEmail(),
      analytics: config.hasAnalytics()
    },
    errors: errors?.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    })) || []
  }
}

// Initialize on import (will validate env vars)
if (typeof window === 'undefined') {
  // Only run on server
  const health = getEnvHealth()
  
  if (health.status === 'degraded') {
    console.warn('⚠️  Application running with missing environment variables')
    console.warn('Missing configurations:', health.errors)
  } else {
    console.log('✅ All required environment variables are configured')
  }
}
