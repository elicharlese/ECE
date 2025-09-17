/**
 * AI Video Generation Service
 * Professional video creation using Runway, Luma AI, and other providers
 */

export interface VideoGenerationRequest {
  type: 'hero' | 'demo' | 'tutorial' | 'promo' | 'loading' | 'transition'
  template: string
  duration: number // seconds
  style: 'beach-monokai' | 'cinematic' | 'modern' | 'animated'
  quality: 'draft' | 'standard' | 'premium' | 'ultra'
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:3'
  prompt: string
  soundtrack?: boolean
  captions?: boolean
}

export interface GeneratedVideo {
  id: string
  url: string
  thumbnailUrl: string
  duration: number
  fileSize: number
  format: string
  metadata: {
    prompt: string
    style: string
    quality: string
    generatedAt: Date
    provider: string
    processingTime: number
  }
  optimizedVersions: {
    mobile: string
    web: string
    hd: string
  }
}

export class AIVideoService {
  private providers: {
    runway: { apiKey: string; baseUrl: string }
    luma: { apiKey: string; baseUrl: string }
    pika: { apiKey: string; baseUrl: string }
    haiper: { apiKey: string; baseUrl: string }
  }

  constructor() {
    this.providers = {
      runway: {
        apiKey: process.env.RUNWAY_API_KEY || 'demo-runway',
        baseUrl: 'https://api.runwayml.com/v1'
      },
      luma: {
        apiKey: process.env.LUMA_API_KEY || 'demo-luma',
        baseUrl: 'https://api.lumalabs.ai/v1'
      },
      pika: {
        apiKey: process.env.PIKA_API_KEY || 'demo-pika',
        baseUrl: 'https://api.pika.art/v1'
      },
      haiper: {
        apiKey: process.env.HAIPER_API_KEY || 'demo-haiper',
        baseUrl: 'https://api.haiper.ai/v1'
      }
    }
  }

  /**
   * Generate complete video package for an app
   */
  async generateAppVideoPackage(appName: string, appType: string, features: string[]): Promise<{
    hero: GeneratedVideo
    demo: GeneratedVideo
    tutorial: GeneratedVideo
    loading: GeneratedVideo[]
    transitions: GeneratedVideo[]
  }> {
    console.log(`🎬 Generating video package for: ${appName}`)

    const [hero, demo, tutorial, loadingVideos, transitions] = await Promise.all([
      this.generateHeroVideo(appName, appType),
      this.generateDemoVideo(appName, appType, features),
      this.generateTutorialVideo(appName, appType, features),
      this.generateLoadingVideos(appName, appType),
      this.generateTransitionVideos(appName, appType)
    ])

    return {
      hero,
      demo,
      tutorial,
      loading: loadingVideos,
      transitions
    }
  }

  /**
   * Generate hero video for app showcase
   */
  async generateHeroVideo(appName: string, appType: string): Promise<GeneratedVideo> {
    const request: VideoGenerationRequest = {
      type: 'hero',
      template: appType,
      duration: 15,
      style: 'cinematic',
      quality: 'ultra',
      aspectRatio: '16:9',
      prompt: this.buildHeroVideoPrompt(appName, appType),
      soundtrack: true
    }

    return await this.generateWithBestProvider(request)
  }

  /**
   * Generate demo video showing app functionality
   */
  async generateDemoVideo(appName: string, appType: string, features: string[]): Promise<GeneratedVideo> {
    const request: VideoGenerationRequest = {
      type: 'demo',
      template: appType,
      duration: 30,
      style: 'modern',
      quality: 'premium',
      aspectRatio: '16:9',
      prompt: this.buildDemoVideoPrompt(appName, appType, features),
      captions: true
    }

    return await this.generateWithBestProvider(request)
  }

  /**
   * Generate tutorial video
   */
  async generateTutorialVideo(appName: string, appType: string, features: string[]): Promise<GeneratedVideo> {
    const request: VideoGenerationRequest = {
      type: 'tutorial',
      template: appType,
      duration: 45,
      style: 'modern',
      quality: 'premium',
      aspectRatio: '16:9',
      prompt: this.buildTutorialVideoPrompt(appName, appType, features),
      captions: true
    }

    return await this.generateWithBestProvider(request)
  }

  /**
   * Generate loading animations
   */
  async generateLoadingVideos(appName: string, appType: string): Promise<GeneratedVideo[]> {
    const loadingTypes = ['spinner', 'progress', 'wave', 'pulse']
    const videos = []

    for (const loadingType of loadingTypes) {
      const request: VideoGenerationRequest = {
        type: 'loading',
        template: `${appType}-${loadingType}`,
        duration: 3,
        style: 'beach-monokai',
        quality: 'standard',
        aspectRatio: '1:1',
        prompt: this.buildLoadingVideoPrompt(appName, loadingType)
      }

      const video = await this.generateWithBestProvider(request)
      videos.push(video)
    }

    return videos
  }

  /**
   * Generate transition animations
   */
  async generateTransitionVideos(appName: string, appType: string): Promise<GeneratedVideo[]> {
    const transitionTypes = ['fade', 'slide', 'zoom', 'wave']
    const videos = []

    for (const transitionType of transitionTypes) {
      const request: VideoGenerationRequest = {
        type: 'transition',
        template: `${appType}-${transitionType}`,
        duration: 2,
        style: 'beach-monokai',
        quality: 'standard',
        aspectRatio: '16:9',
        prompt: this.buildTransitionVideoPrompt(appName, transitionType)
      }

      const video = await this.generateWithBestProvider(request)
      videos.push(video)
    }

    return videos
  }

  /**
   * Choose best provider based on video type and generate
   */
  private async generateWithBestProvider(request: VideoGenerationRequest): Promise<GeneratedVideo> {
    const bestProvider = this.selectBestProvider(request)
    
    switch (bestProvider) {
      case 'runway':
        return await this.generateWithRunway(request)
      case 'luma':
        return await this.generateWithLuma(request)
      case 'pika':
        return await this.generateWithPika(request)
      case 'haiper':
        return await this.generateWithHaiper(request)
      default:
        return this.generateDemoVideo(request)
    }
  }

  /**
   * Select best provider for video type
   */
  private selectBestProvider(request: VideoGenerationRequest): string {
    // Provider strengths:
    // Runway: Best for cinematic, hero videos
    // Luma: Best for realistic demos, tutorials
    // Pika: Best for animated content, loading screens
    // Haiper: Best for transitions, effects

    if (request.type === 'hero' && request.style === 'cinematic') return 'runway'
    if (request.type === 'demo' || request.type === 'tutorial') return 'luma'
    if (request.type === 'loading' || request.style === 'animated') return 'pika'
    if (request.type === 'transition') return 'haiper'
    
    return 'runway' // Default to Runway
  }

  /**
   * Generate with Runway ML
   */
  private async generateWithRunway(request: VideoGenerationRequest): Promise<GeneratedVideo> {
    if (this.providers.runway.apiKey === 'demo-runway') {
      return this.generateDemoVideo(request)
    }

    try {
      const response = await fetch(`${this.providers.runway.baseUrl}/video/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.providers.runway.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'runway-gen3-alpha',
          prompt: request.prompt,
          duration: request.duration,
          aspect_ratio: request.aspectRatio,
          quality: request.quality,
          style_preset: this.getVideoStylePreset(request.style)
        })
      })

      if (!response.ok) {
        throw new Error(`Runway generation failed: ${response.statusText}`)
      }

      const result = await response.json()
      return this.formatVideoResult(result, request, 'runway')
    } catch (error) {
      console.error('Runway generation error:', error)
      return this.generateDemoVideo(request)
    }
  }

  /**
   * Generate with Luma AI
   */
  private async generateWithLuma(request: VideoGenerationRequest): Promise<GeneratedVideo> {
    if (this.providers.luma.apiKey === 'demo-luma') {
      return this.generateDemoVideo(request)
    }

    try {
      const response = await fetch(`${this.providers.luma.baseUrl}/video/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.providers.luma.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: request.prompt,
          duration: request.duration,
          aspect_ratio: request.aspectRatio,
          quality: request.quality
        })
      })

      if (!response.ok) {
        throw new Error(`Luma generation failed: ${response.statusText}`)
      }

      const result = await response.json()
      return this.formatVideoResult(result, request, 'luma')
    } catch (error) {
      console.error('Luma generation error:', error)
      return this.generateDemoVideo(request)
    }
  }

  /**
   * Generate with Pika AI
   */
  private async generateWithPika(request: VideoGenerationRequest): Promise<GeneratedVideo> {
    if (this.providers.pika.apiKey === 'demo-pika') {
      return this.generateDemoVideo(request)
    }

    try {
      const response = await fetch(`${this.providers.pika.baseUrl}/video/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.providers.pika.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: request.prompt,
          duration: request.duration,
          style: request.style,
          quality: request.quality
        })
      })

      if (!response.ok) {
        throw new Error(`Pika generation failed: ${response.statusText}`)
      }

      const result = await response.json()
      return this.formatVideoResult(result, request, 'pika')
    } catch (error) {
      console.error('Pika generation error:', error)
      return this.generateDemoVideo(request)
    }
  }

  /**
   * Generate with Haiper AI
   */
  private async generateWithHaiper(request: VideoGenerationRequest): Promise<GeneratedVideo> {
    if (this.providers.haiper.apiKey === 'demo-haiper') {
      return this.generateDemoVideo(request)
    }

    try {
      const response = await fetch(`${this.providers.haiper.baseUrl}/video/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.providers.haiper.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: request.prompt,
          duration: request.duration,
          quality: request.quality
        })
      })

      if (!response.ok) {
        throw new Error(`Haiper generation failed: ${response.statusText}`)
      }

      const result = await response.json()
      return this.formatVideoResult(result, request, 'haiper')
    } catch (error) {
      console.error('Haiper generation error:', error)
      return this.generateDemoVideo(request)
    }
  }

  /**
   * Generate demo video for testing
   */
  private generateDemoVideo(request: VideoGenerationRequest): GeneratedVideo {
    const videoId = `demo_video_${Date.now()}`
    
    return {
      id: videoId,
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: 'https://images.unsplash.com/1920x1080/?video&thumbnail',
      duration: request.duration,
      fileSize: 10 * 1024 * 1024, // 10MB demo
      format: 'mp4',
      metadata: {
        prompt: request.prompt,
        style: request.style,
        quality: request.quality,
        generatedAt: new Date(),
        provider: 'demo',
        processingTime: 30
      },
      optimizedVersions: {
        mobile: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        web: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        hd: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      }
    }
  }

  /**
   * Format API result to standard video format
   */
  private formatVideoResult(result: any, request: VideoGenerationRequest, provider: string): GeneratedVideo {
    return {
      id: result.id || `${provider}_${Date.now()}`,
      url: result.url || result.video_url,
      thumbnailUrl: result.thumbnail_url || result.thumbnail,
      duration: request.duration,
      fileSize: result.file_size || 0,
      format: 'mp4',
      metadata: {
        prompt: request.prompt,
        style: request.style,
        quality: request.quality,
        generatedAt: new Date(),
        provider,
        processingTime: result.processing_time || 0
      },
      optimizedVersions: {
        mobile: result.mobile_url || result.url,
        web: result.web_url || result.url,
        hd: result.hd_url || result.url
      }
    }
  }

  // Prompt builders
  private buildHeroVideoPrompt(appName: string, appType: string): string {
    return `Cinematic hero video for ${appName} ${appType} application.
      Professional tech presentation with Beach Monokai color palette.
      Ocean blue (#66D9EF) and warm yellow (#E6DB74) highlights.
      Smooth camera movements, modern UI animations, glassmorphic elements.
      Premium tech showcase, Apple-style presentation.
      15 seconds, cinematic quality, professional lighting.`
  }

  private buildDemoVideoPrompt(appName: string, appType: string, features: string[]): string {
    return `Professional demo video for ${appName} ${appType} app.
      Show app navigation, key features: ${features.join(', ')}.
      Beach Monokai UI with glassmorphic design, smooth transitions.
      Ocean wave-inspired animations, modern interface.
      30 seconds, tutorial style, clear feature demonstration.`
  }

  private buildTutorialVideoPrompt(appName: string, appType: string, features: string[]): string {
    return `Step-by-step tutorial for ${appName} ${appType} application.
      Detailed walkthrough of features: ${features.join(', ')}.
      Beach Monokai interface, clear UI highlights, smooth transitions.
      Educational style, easy to follow, professional quality.
      45 seconds, tutorial format with clear instructions.`
  }

  private buildLoadingVideoPrompt(appName: string, loadingType: string): string {
    return `${loadingType} loading animation for ${appName} app.
      Beach Monokai colors: ocean blue (#66D9EF), warm yellow (#E6DB74).
      Smooth, hypnotic animation. Modern, clean design.
      3 seconds loop, seamless, glassmorphic style.`
  }

  private buildTransitionVideoPrompt(appName: string, transitionType: string): string {
    return `${transitionType} transition animation for ${appName} app.
      Beach Monokai theme with glassmorphic elements.
      Ocean wave-inspired motion, smooth and elegant.
      2 seconds, seamless transition, modern design.`
  }

  private getVideoStylePreset(style: string): string {
    const presets = {
      'beach-monokai': 'ocean_monokai_glassmorphic',
      'cinematic': 'cinematic_premium_tech',
      'modern': 'modern_clean_ui',
      'animated': 'animated_colorful_smooth'
    }
    return presets[style] || presets['beach-monokai']
  }
}

// Export singleton instance
export const aiVideoService = new AIVideoService()
