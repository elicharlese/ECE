/**
 * AI Media Pipeline Manager
 * Orchestrates comprehensive media generation for ECE applications
 */

import { aiMediaService, GeneratedMediaAsset } from './ai-media.service'
import { aiVideoService, GeneratedVideo } from './ai-video.service'
import { ai3DService, Generated3DAsset } from './ai-3d.service'
import { mediaOptimizationService, OptimizedMediaPackage } from './media-optimization.service'

export interface MediaGenerationRequest {
  appName: string
  category: string
  description: string
  targetPlatforms: ('web' | 'mobile' | 'desktop' | 'vr')[]
  theme?: {
    primaryColor: string
    secondaryColor: string
    style: 'modern' | 'retro' | 'minimalist' | 'glassmorphic' | 'beach-monokai'
  }
  requirements?: {
    images?: {
      count: number
      types: string[]
      dimensions: { width: number; height: number }[]
    }
    videos?: {
      count: number
      duration: number
      quality: '720p' | '1080p' | '4K'
    }
    assets3D?: {
      count: number
      complexity: 'low' | 'medium' | 'high'
      interactive: boolean
    }
  }
}

export interface ComprehensiveMediaPackage {
  id: string
  appName: string
  generatedAt: Date
  images: GeneratedMediaAsset[]
  videos: GeneratedVideo[]
  assets3D: Generated3DAsset[]
  optimized: OptimizedMediaPackage
  analytics: {
    totalGenerationTime: number
    totalAssetCount: number
    totalSize: number
    optimizedSize: number
    compressionRatio: number
    qualityScore: number
    providerUsage: Record<string, number>
  }
  metadata: {
    prompt: string
    category: string
    targetPlatforms: string[]
    theme: any
    processingSteps: string[]
  }
}

export class MediaPipelineManager {
  private readonly beachMonokaiTheme = {
    primaryColor: '#F92672',
    secondaryColor: '#66D9EF',
    accent: '#A6E22E',
    background: '#1A2B4C',
    surface: '#2A3F5F',
    text: '#F8EFD6'
  }

  /**
   * Generate complete media package for an application
   */
  async generateCompleteMediaPackage(
    request: MediaGenerationRequest,
    onProgress?: (step: string, progress: number) => void
  ): Promise<ComprehensiveMediaPackage> {
    const startTime = Date.now()
    const processingSteps: string[] = []
    const providerUsage: Record<string, number> = {}

    try {
      onProgress?.('Initializing media generation pipeline...', 0)
      processingSteps.push('Pipeline initialization')

      // Apply Beach Monokai theme if not specified
      const theme = request.theme || {
        primaryColor: this.beachMonokaiTheme.primaryColor,
        secondaryColor: this.beachMonokaiTheme.secondaryColor,
        style: 'beach-monokai' as const
      }

      // Step 1: Generate Images (25% of total progress)
      onProgress?.('Generating professional images...', 10)
      const images = await this.generateImagesWithProgress(
        request.appName,
        request.category,
        request.description,
        request.targetPlatforms,
        theme,
        request.requirements?.images,
        (progress) => onProgress?.(`Generating images...`, 10 + progress * 0.15)
      )
      processingSteps.push(`Generated ${images.length} images`)

      // Step 2: Generate Videos (35% of total progress)
      onProgress?.('Creating demo videos...', 25)
      const videos = await this.generateVideosWithProgress(
        request.appName,
        request.category,
        request.description,
        request.targetPlatforms,
        theme,
        request.requirements?.videos,
        (progress) => onProgress?.(`Creating videos...`, 25 + progress * 0.25)
      )
      processingSteps.push(`Generated ${videos.length} videos`)

      // Step 3: Generate 3D Assets (20% of total progress)
      onProgress?.('Building 3D scenes and models...', 50)
      const assets3D = await this.generate3DAssetsWithProgress(
        request.appName,
        request.category,
        request.description,
        request.targetPlatforms,
        theme,
        request.requirements?.assets3D,
        (progress) => onProgress?.(`Building 3D assets...`, 50 + progress * 0.2)
      )
      processingSteps.push(`Generated ${assets3D.length} 3D assets`)

      // Step 4: Optimize Everything (20% of total progress)
      onProgress?.('Optimizing media for production...', 70)
      const optimized = await mediaOptimizationService.optimizeAppMediaPackage(
        images,
        videos,
        assets3D,
        request.targetPlatforms
      )
      processingSteps.push('Media optimization completed')
      onProgress?.('Optimization complete', 90)

      // Calculate analytics
      const endTime = Date.now()
      const totalGenerationTime = endTime - startTime
      const totalAssetCount = images.length + videos.length + assets3D.length
      const totalSize = this.calculateTotalSize(images, videos, assets3D)
      const optimizedSize = optimized.metadata.totalSize
      const compressionRatio = totalSize > 0 ? (totalSize - optimizedSize) / totalSize : 0

      // Track provider usage
      this.trackProviderUsage(images, videos, assets3D, providerUsage)

      onProgress?.('Finalizing media package...', 95)

      const mediaPackage: ComprehensiveMediaPackage = {
        id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        appName: request.appName,
        generatedAt: new Date(),
        images,
        videos,
        assets3D,
        optimized,
        analytics: {
          totalGenerationTime,
          totalAssetCount,
          totalSize,
          optimizedSize,
          compressionRatio,
          qualityScore: this.calculateOverallQualityScore(images, videos, assets3D, optimized),
          providerUsage
        },
        metadata: {
          prompt: this.createMasterPrompt(request),
          category: request.category,
          targetPlatforms: request.targetPlatforms,
          theme,
          processingSteps
        }
      }

      onProgress?.('Media generation complete!', 100)
      return mediaPackage

    } catch (error) {
      console.error('Media pipeline generation failed:', error)
      throw new Error(`Media generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Generate images with progress tracking
   */
  private async generateImagesWithProgress(
    appName: string,
    category: string,
    description: string,
    targetPlatforms: string[],
    theme: any,
    requirements?: any,
    onProgress?: (progress: number) => void
  ): Promise<GeneratedMediaAsset[]> {
    onProgress?.(0)
    
    const images = await aiMediaService.generateAppMediaPackage(
      appName,
      category,
      description,
      targetPlatforms
    )
    
    onProgress?.(100)
    return images.images
  }

  /**
   * Generate videos with progress tracking
   */
  private async generateVideosWithProgress(
    appName: string,
    category: string,
    description: string,
    targetPlatforms: string[],
    theme: any,
    requirements?: any,
    onProgress?: (progress: number) => void
  ): Promise<GeneratedVideo[]> {
    onProgress?.(0)
    
    const videos = await aiVideoService.generateAppVideoPackage(
      appName,
      category,
      description,
      targetPlatforms
    )
    
    onProgress?.(100)
    return videos
  }

  /**
   * Generate 3D assets with progress tracking
   */
  private async generate3DAssetsWithProgress(
    appName: string,
    category: string,
    description: string,
    targetPlatforms: string[],
    theme: any,
    requirements?: any,
    onProgress?: (progress: number) => void
  ): Promise<Generated3DAsset[]> {
    onProgress?.(0)
    
    const assets3D = await ai3DService.generateApp3DPackage(
      appName,
      category,
      description,
      targetPlatforms
    )
    
    onProgress?.(100)
    return assets3D
  }

  /**
   * Create master prompt for media generation
   */
  private createMasterPrompt(request: MediaGenerationRequest): string {
    return [
      `Application: ${request.appName}`,
      `Category: ${request.category}`,
      `Description: ${request.description}`,
      `Platforms: ${request.targetPlatforms.join(', ')}`,
      `Theme: ${request.theme?.style || 'beach-monokai'} style`,
      `Colors: ${request.theme?.primaryColor || '#F92672'} and ${request.theme?.secondaryColor || '#66D9EF'}`
    ].join(' | ')
  }

  /**
   * Calculate total size of all assets
   */
  private calculateTotalSize(
    images: GeneratedMediaAsset[],
    videos: GeneratedVideo[],
    assets3D: Generated3DAsset[]
  ): number {
    const imageSize = images.reduce((sum, img) => sum + (img.metadata.fileSize || 0), 0)
    const videoSize = videos.reduce((sum, vid) => sum + vid.fileSize, 0)
    const asset3DSize = assets3D.reduce((sum, asset) => sum + asset.metadata.fileSize, 0)
    
    return imageSize + videoSize + asset3DSize
  }

  /**
   * Track provider usage across all services
   */
  private trackProviderUsage(
    images: GeneratedMediaAsset[],
    videos: GeneratedVideo[],
    assets3D: Generated3DAsset[],
    providerUsage: Record<string, number>
  ) {
    // Track image providers
    images.forEach(img => {
      const provider = img.metadata.provider || 'unknown'
      providerUsage[provider] = (providerUsage[provider] || 0) + 1
    })

    // Track video providers
    videos.forEach(vid => {
      const provider = vid.metadata.provider || 'unknown'
      providerUsage[provider] = (providerUsage[provider] || 0) + 1
    })

    // Track 3D providers
    assets3D.forEach(asset => {
      const provider = asset.metadata.provider || 'unknown'
      providerUsage[provider] = (providerUsage[provider] || 0) + 1
    })
  }

  /**
   * Calculate overall quality score
   */
  private calculateOverallQualityScore(
    images: GeneratedMediaAsset[],
    videos: GeneratedVideo[],
    assets3D: Generated3DAsset[],
    optimized: OptimizedMediaPackage
  ): number {
    // Base score from optimization
    let score = optimized.metadata.qualityScore

    // Bonus for asset variety
    if (images.length > 0) score += 5
    if (videos.length > 0) score += 5
    if (assets3D.length > 0) score += 5

    // Bonus for optimization ratio
    if (optimized.metadata.optimizationRatio > 0.3) score += 10
    if (optimized.metadata.optimizationRatio > 0.5) score += 5

    // Penalty for processing time (if too long)
    if (optimized.metadata.processingTime > 120000) score -= 5 // 2 minutes

    return Math.min(100, Math.max(0, score))
  }

  /**
   * Get media generation statistics
   */
  async getGenerationStatistics(): Promise<{
    totalPackagesGenerated: number
    averageGenerationTime: number
    averageQualityScore: number
    popularAssetTypes: Record<string, number>
    providerReliability: Record<string, number>
  }> {
    // This would typically connect to a database or analytics service
    // For now, return demo statistics
    return {
      totalPackagesGenerated: 1247,
      averageGenerationTime: 45000, // 45 seconds
      averageQualityScore: 87.3,
      popularAssetTypes: {
        'hero-images': 1247,
        'demo-videos': 983,
        '3d-scenes': 456,
        'ui-components': 2134,
        'backgrounds': 1891
      },
      providerReliability: {
        'midjourney': 94.2,
        'runway-ml': 91.7,
        'luma-ai': 89.1,
        'meshy': 86.8,
        'demo-mode': 100.0
      }
    }
  }
}

// Export singleton instance
export const mediaPipelineManager = new MediaPipelineManager()
