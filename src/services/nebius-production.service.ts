/**
 * Production Nebius Integration Service
 * Handles both demo mode and real API integration
 */

import { NebiusAIService } from './nebius-ai.service'
import { NebiusDemoService } from './nebius-demo.service'
import { AppTemplate, GeneratedApp, GenerationProgress } from '../types/app-generation.types'

export class NebiusProductionService {
  private realService: NebiusAIService
  private demoService: NebiusDemoService
  private isProduction: boolean

  constructor() {
    this.realService = new NebiusAIService()
    this.demoService = new NebiusDemoService()
    
    // Check if we're in production mode with valid API key
    this.isProduction = !!(
      process.env.NODE_ENV === 'production' && 
      process.env.NEBIUS_API_KEY &&
      process.env.NEBIUS_API_KEY !== 'your-nebius-api-key-here'
    )

    console.log(`🔧 Nebius Service Mode: ${this.isProduction ? 'PRODUCTION' : 'DEMO'}`)
  }

  /**
   * Generate app using appropriate service (production or demo)
   */
  async generateApp(
    template: AppTemplate,
    onProgress?: (progress: GenerationProgress) => void
  ): Promise<GeneratedApp> {
    if (this.isProduction) {
      console.log('🚀 Using Production Nebius AI Service')
      return await this.realService.generateApp(template, onProgress)
    } else {
      console.log('🎭 Using Nebius Demo Service')
      return await this.demoService.generateApp(template, onProgress)
    }
  }

  /**
   * Check service status and capabilities
   */
  async getServiceStatus(): Promise<{
    mode: 'production' | 'demo'
    available: boolean
    capabilities: string[]
    limits: {
      concurrentGenerations: number
      monthlyQuota: number
      averageTime: string
    }
  }> {
    if (this.isProduction) {
      try {
        // Test real API connection
        await this.realService.testConnection()
        return {
          mode: 'production',
          available: true,
          capabilities: [
            'Real AI code generation',
            'Advanced model selection',
            'Custom fine-tuning',
            'Enterprise support',
            'GPU acceleration',
            'Scalable infrastructure'
          ],
          limits: {
            concurrentGenerations: 50,
            monthlyQuota: 10000,
            averageTime: '3-8 minutes'
          }
        }
      } catch (error) {
        console.warn('Production service unavailable, falling back to demo')
        this.isProduction = false
      }
    }

    return {
      mode: 'demo',
      available: true,
      capabilities: [
        'Simulated AI generation',
        'Template-based output',
        'Battle stats calculation',
        'Quality assessment',
        'Card generation',
        'Portfolio integration'
      ],
      limits: {
        concurrentGenerations: 10,
        monthlyQuota: 1000,
        averageTime: '15-25 seconds'
      }
    }
  }

  /**
   * Switch to demo mode (for testing)
   */
  forceDemoMode(): void {
    this.isProduction = false
    console.log('🎭 Forced switch to Demo Mode')
  }

  /**
   * Switch to production mode (if API key available)
   */
  forceProductionMode(): boolean {
    if (process.env.NEBIUS_API_KEY && process.env.NEBIUS_API_KEY !== 'your-nebius-api-key-here') {
      this.isProduction = true
      console.log('🚀 Forced switch to Production Mode')
      return true
    } else {
      console.warn('⚠️ Cannot switch to production: No valid API key')
      return false
    }
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(): Promise<{
    totalGenerations: number
    successRate: number
    averageTime: number
    popularTemplates: string[]
    recentActivity: Array<{
      appName: string
      template: string
      generatedAt: Date
      status: 'success' | 'failed'
    }>
  }> {
    // This would connect to your analytics service
    return {
      totalGenerations: 1247,
      successRate: 0.94,
      averageTime: 421, // seconds
      popularTemplates: ['web', 'mobile', 'ai'],
      recentActivity: [
        {
          appName: 'Beach Trading Hub',
          template: 'web',
          generatedAt: new Date(),
          status: 'success'
        },
        {
          appName: 'ECE Card Scanner',
          template: 'mobile',
          generatedAt: new Date(Date.now() - 3600000),
          status: 'success'
        }
      ]
    }
  }
}

// Export singleton instance
export const nebiusService = new NebiusProductionService()
