/**
 * Elite AI Video Generation Service
 * Professional video generation using RunwayML and Stable Video
 */

import { AppTemplate, GeneratedApp } from '../types/app-generation.types'

export interface VideoGenerationRequest {
  prompt: string
  type: 'demo' | 'tutorial' | 'promo' | 'feature' | 'testimonial'
  duration: 15 | 30 | 60 | 120 // seconds
  quality: 'standard' | 'high' | 'ultra'
  style: 'professional' | 'dynamic' | 'minimal' | 'cinematic'
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5'
}

export interface GeneratedVideo {
  id: string
  url: string
  thumbnailUrl: string
  prompt: string
  duration: number
  fileSize: number
  resolution: { width: number; height: number }
  metadata: {
    model: string
    style: string
    fps: number
    codec: string
    generatedAt: Date
  }
}

export interface VideoAssetPackage {
  hero: GeneratedVideo[]
  features: GeneratedVideo[]
  tutorials: GeneratedVideo[]
  promos: GeneratedVideo[]
  social: GeneratedVideo[]
  demos: GeneratedVideo[]
}

export class AIVideoGenerator {
  private runwayApiKey: string
  private stableVideoApiKey: string
  private isDemo: boolean

  constructor() {
    this.runwayApiKey = process.env.RUNWAY_API_KEY || 'demo-key'
    this.stableVideoApiKey = process.env.STABLE_VIDEO_API_KEY || 'demo-key'
    this.isDemo = !process.env.RUNWAY_API_KEY || process.env.RUNWAY_API_KEY === 'demo-key'
  }

  /**
   * Generate complete video asset package for an app
   */
  async generateAppVideos(app: GeneratedApp): Promise<VideoAssetPackage> {
    console.log(`🎥 Generating video assets for ${app.name}...`)

    try {
      const [hero, features, tutorials, promos, social, demos] = await Promise.all([
        this.generateHeroVideos(app),
        this.generateFeatureVideos(app),
        this.generateTutorialVideos(app),
        this.generatePromoVideos(app),
        this.generateSocialVideos(app),
        this.generateDemoVideos(app)
      ])

      return { hero, features, tutorials, promos, social, demos }

    } catch (error) {
      console.warn('⚠️ Production video generation failed, using demo assets')
      return this.generateDemoVideoPackage(app)
    }
  }

  /**
   * Generate hero videos for app showcase
   */
  private async generateHeroVideos(app: GeneratedApp): Promise<GeneratedVideo[]> {
    const heroRequests: VideoGenerationRequest[] = [
      {
        prompt: `${app.name} app hero showcase, smooth UI animations, professional presentation, modern interface transitions`,
        type: 'demo',
        duration: 30,
        quality: 'ultra',
        style: 'professional',
        aspectRatio: '16:9'
      },
      {
        prompt: `${app.name} interface walkthrough, elegant transitions, user interaction flow, premium app experience`,
        type: 'demo',
        duration: 60,
        quality: 'high',
        style: 'cinematic',
        aspectRatio: '16:9'
      }
    ]

    const videos: GeneratedVideo[] = []
    for (const request of heroRequests) {
      const generatedVideo = await this.generateVideo(request)
      if (generatedVideo) videos.push(generatedVideo)
    }

    return videos
  }

  /**
   * Generate feature demonstration videos
   */
  private async generateFeatureVideos(app: GeneratedApp): Promise<GeneratedVideo[]> {
    const features = app.features || ['Core functionality', 'User interface', 'Data management']
    const videos: GeneratedVideo[] = []

    for (const feature of features.slice(0, 3)) { // Limit to 3 key features
      const request: VideoGenerationRequest = {
        prompt: `${feature} demonstration in ${app.name}, step-by-step walkthrough, clear UI interactions, professional tutorial style`,
        type: 'feature',
        duration: 30,
        quality: 'high',
        style: 'professional',
        aspectRatio: '16:9'
      }

      const generatedVideo = await this.generateVideo(request)
      if (generatedVideo) videos.push(generatedVideo)
    }

    return videos
  }

  /**
   * Generate tutorial videos
   */
  private async generateTutorialVideos(app: GeneratedApp): Promise<GeneratedVideo[]> {
    const tutorialRequests: VideoGenerationRequest[] = [
      {
        prompt: `Getting started with ${app.name}, onboarding flow, first-time user experience, friendly tutorial`,
        type: 'tutorial',
        duration: 60,
        quality: 'high',
        style: 'professional',
        aspectRatio: '16:9'
      },
      {
        prompt: `Advanced features of ${app.name}, power user tips, productivity shortcuts, expert-level guidance`,
        type: 'tutorial',
        duration: 120,
        quality: 'high',
        style: 'professional',
        aspectRatio: '16:9'
      }
    ]

    const videos: GeneratedVideo[] = []
    for (const request of tutorialRequests) {
      const generatedVideo = await this.generateVideo(request)
      if (generatedVideo) videos.push(generatedVideo)
    }

    return videos
  }

  /**
   * Generate promotional videos
   */
  private async generatePromoVideos(app: GeneratedApp): Promise<GeneratedVideo[]> {
    const promoRequests: VideoGenerationRequest[] = [
      {
        prompt: `${app.name} promotional video, exciting features showcase, call-to-action, marketing focus, dynamic presentation`,
        type: 'promo',
        duration: 30,
        quality: 'ultra',
        style: 'dynamic',
        aspectRatio: '16:9'
      },
      {
        prompt: `${app.name} success stories, user testimonials, results showcase, social proof, trustworthy presentation`,
        type: 'testimonial',
        duration: 60,
        quality: 'high',
        style: 'professional',
        aspectRatio: '16:9'
      }
    ]

    const videos: GeneratedVideo[] = []
    for (const request of promoRequests) {
      const generatedVideo = await this.generateVideo(request)
      if (generatedVideo) videos.push(generatedVideo)
    }

    return videos
  }

  /**
   * Generate social media videos
   */
  private async generateSocialVideos(app: GeneratedApp): Promise<GeneratedVideo[]> {
    const socialRequests: VideoGenerationRequest[] = [
      {
        prompt: `${app.name} Instagram story, quick feature highlight, engaging visual, mobile-first design`,
        type: 'promo',
        duration: 15,
        quality: 'high',
        style: 'dynamic',
        aspectRatio: '9:16'
      },
      {
        prompt: `${app.name} TikTok video, fun demonstration, viral potential, youth-oriented presentation`,
        type: 'demo',
        duration: 30,
        quality: 'high',
        style: 'dynamic',
        aspectRatio: '9:16'
      },
      {
        prompt: `${app.name} LinkedIn post, professional showcase, business value, corporate presentation`,
        type: 'promo',
        duration: 30,
        quality: 'high',
        style: 'professional',
        aspectRatio: '1:1'
      }
    ]

    const videos: GeneratedVideo[] = []
    for (const request of socialRequests) {
      const generatedVideo = await this.generateVideo(request)
      if (generatedVideo) videos.push(generatedVideo)
    }

    return videos
  }

  /**
   * Generate demo videos
   */
  private async generateDemoVideos(app: GeneratedApp): Promise<GeneratedVideo[]> {
    const demoRequests: VideoGenerationRequest[] = [
      {
        prompt: `${app.name} live demo, real-time interaction, actual usage scenario, authentic user experience`,
        type: 'demo',
        duration: 60,
        quality: 'high',
        style: 'professional',
        aspectRatio: '16:9'
      },
      {
        prompt: `${app.name} workflow demonstration, complete task execution, productivity showcase, efficient process`,
        type: 'demo',
        duration: 90,
        quality: 'high',
        style: 'professional',
        aspectRatio: '16:9'
      }
    ]

    const videos: GeneratedVideo[] = []
    for (const request of demoRequests) {
      const generatedVideo = await this.generateVideo(request)
      if (generatedVideo) videos.push(generatedVideo)
    }

    return videos
  }

  /**
   * Core video generation with RunwayML/Stable Video
   */
  private async generateVideo(request: VideoGenerationRequest): Promise<GeneratedVideo | null> {
    if (this.isDemo) {
      return this.generateDemoVideo(request)
    }

    try {
      // Try RunwayML first (higher quality)
      const runwayVideo = await this.generateWithRunway(request)
      if (runwayVideo) return runwayVideo

      // Fallback to Stable Video
      const stableVideo = await this.generateWithStableVideo(request)
      if (stableVideo) return stableVideo

      // Final fallback to demo
      return this.generateDemoVideo(request)

    } catch (error) {
      console.warn(`⚠️ Video generation failed: ${error}`)
      return this.generateDemoVideo(request)
    }
  }

  /**
   * Generate video with RunwayML
   */
  private async generateWithRunway(request: VideoGenerationRequest): Promise<GeneratedVideo | null> {
    try {
      const response = await fetch('https://api.runwayml.com/v1/generate/video', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.runwayApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: this.enhanceVideoPrompt(request),
          duration: request.duration,
          resolution: this.getResolution(request.aspectRatio),
          style: request.style,
          quality: request.quality,
          fps: 30
        })
      })

      if (!response.ok) {
        throw new Error(`RunwayML API error: ${response.status}`)
      }

      const data = await response.json()
      return this.processRunwayResponse(data, request)

    } catch (error) {
      console.warn(`⚠️ RunwayML generation failed: ${error}`)
      return null
    }
  }

  /**
   * Generate video with Stable Video
   */
  private async generateWithStableVideo(request: VideoGenerationRequest): Promise<GeneratedVideo | null> {
    try {
      const response = await fetch('https://api.stability.ai/v2alpha/generation/video', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.stableVideoApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: this.enhanceVideoPrompt(request),
          duration_seconds: request.duration,
          aspect_ratio: request.aspectRatio,
          quality: request.quality,
          motion_strength: request.style === 'dynamic' ? 0.8 : 0.5
        })
      })

      if (!response.ok) {
        throw new Error(`Stable Video API error: ${response.status}`)
      }

      const data = await response.json()
      return this.processStableVideoResponse(data, request)

    } catch (error) {
      console.warn(`⚠️ Stable Video generation failed: ${error}`)
      return null
    }
  }

  /**
   * Enhance prompt for video generation
   */
  private enhanceVideoPrompt(request: VideoGenerationRequest): string {
    const styleEnhancements = {
      professional: 'professional video production, clean transitions, corporate style, high quality',
      dynamic: 'dynamic camera movements, energetic transitions, engaging visuals, modern style',
      minimal: 'minimal design, clean aesthetics, simple transitions, modern approach',
      cinematic: 'cinematic lighting, dramatic composition, film-quality production, artistic direction'
    }

    const typeEnhancements = {
      demo: 'screen recording style, UI walkthrough, interactive demonstration',
      tutorial: 'educational content, step-by-step guidance, clear instructions',
      promo: 'marketing video, promotional content, call-to-action focused',
      feature: 'feature highlight, specific functionality, detailed explanation',
      testimonial: 'user stories, success cases, authentic testimonials'
    }

    return `${request.prompt}, ${styleEnhancements[request.style]}, ${typeEnhancements[request.type]}, 4K quality, smooth motion`
  }

  /**
   * Get resolution based on aspect ratio
   */
  private getResolution(aspectRatio: string): { width: number; height: number } {
    const resolutions = {
      '16:9': { width: 1920, height: 1080 },
      '9:16': { width: 1080, height: 1920 },
      '1:1': { width: 1080, height: 1080 },
      '4:5': { width: 1080, height: 1350 }
    }
    return resolutions[aspectRatio] || resolutions['16:9']
  }

  /**
   * Process RunwayML response
   */
  private processRunwayResponse(data: any, request: VideoGenerationRequest): GeneratedVideo {
    return {
      id: `runway_${Date.now()}`,
      url: data.video_url,
      thumbnailUrl: data.thumbnail_url,
      prompt: request.prompt,
      duration: request.duration,
      fileSize: data.file_size || 0,
      resolution: this.getResolution(request.aspectRatio),
      metadata: {
        model: 'runway-gen3',
        style: request.style,
        fps: 30,
        codec: 'h264',
        generatedAt: new Date()
      }
    }
  }

  /**
   * Process Stable Video response
   */
  private processStableVideoResponse(data: any, request: VideoGenerationRequest): GeneratedVideo {
    return {
      id: `stable_${Date.now()}`,
      url: data.video,
      thumbnailUrl: data.thumbnail || data.video,
      prompt: request.prompt,
      duration: request.duration,
      fileSize: data.file_size || 0,
      resolution: this.getResolution(request.aspectRatio),
      metadata: {
        model: 'stable-video-diffusion',
        style: request.style,
        fps: 24,
        codec: 'h264',
        generatedAt: new Date()
      }
    }
  }

  /**
   * Generate demo video for testing
   */
  private generateDemoVideo(request: VideoGenerationRequest): GeneratedVideo {
    const resolution = this.getResolution(request.aspectRatio)
    
    return {
      id: `demo_${Date.now()}`,
      url: this.getDemoVideoUrl(request),
      thumbnailUrl: this.getDemoThumbnailUrl(request),
      prompt: request.prompt,
      duration: request.duration,
      fileSize: request.duration * 1000000, // 1MB per second estimate
      resolution,
      metadata: {
        model: 'demo-generator',
        style: request.style,
        fps: 30,
        codec: 'h264',
        generatedAt: new Date()
      }
    }
  }

  /**
   * Generate demo video package for testing
   */
  private generateDemoVideoPackage(app: GeneratedApp): VideoAssetPackage {
    return {
      hero: [
        this.generateDemoVideo({
          prompt: `${app.name} hero video`,
          type: 'demo',
          duration: 30,
          quality: 'high',
          style: 'professional',
          aspectRatio: '16:9'
        })
      ],
      features: [
        this.generateDemoVideo({
          prompt: `${app.name} features`,
          type: 'feature',
          duration: 30,
          quality: 'high',
          style: 'professional',
          aspectRatio: '16:9'
        })
      ],
      tutorials: [
        this.generateDemoVideo({
          prompt: `${app.name} tutorial`,
          type: 'tutorial',
          duration: 60,
          quality: 'high',
          style: 'professional',
          aspectRatio: '16:9'
        })
      ],
      promos: [
        this.generateDemoVideo({
          prompt: `${app.name} promo`,
          type: 'promo',
          duration: 30,
          quality: 'high',
          style: 'dynamic',
          aspectRatio: '16:9'
        })
      ],
      social: [
        this.generateDemoVideo({
          prompt: `${app.name} social`,
          type: 'promo',
          duration: 15,
          quality: 'high',
          style: 'dynamic',
          aspectRatio: '9:16'
        })
      ],
      demos: [
        this.generateDemoVideo({
          prompt: `${app.name} demo`,
          type: 'demo',
          duration: 60,
          quality: 'high',
          style: 'professional',
          aspectRatio: '16:9'
        })
      ]
    }
  }

  /**
   * Get demo video URL
   */
  private getDemoVideoUrl(request: VideoGenerationRequest): string {
    // Using a placeholder video service
    const resolution = this.getResolution(request.aspectRatio)
    return `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`
  }

  /**
   * Get demo thumbnail URL
   */
  private getDemoThumbnailUrl(request: VideoGenerationRequest): string {
    const resolution = this.getResolution(request.aspectRatio)
    return `https://picsum.photos/${resolution.width}/${resolution.height}?random=${Math.random()}`
  }
}

export const aiVideoGenerator = new AIVideoGenerator()
