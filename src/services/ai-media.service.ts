/**
 * AI Media Generation Service
 * Professional-level image, video, and 3D asset generation for ECE apps
 */

import { AppTemplate, GeneratedApp } from '../types/app-generation.types'

export interface MediaGenerationRequest {
  type: 'image' | 'video' | '3d' | 'ui-component'
  category: string
  style: 'beach-monokai' | 'glassmorphic' | 'minimal' | 'vibrant'
  dimensions?: { width: number; height: number }
  duration?: number // for videos
  prompt: string
  quality: 'draft' | 'standard' | 'premium' | 'ultra'
  format?: string
}

export interface GeneratedMediaAsset {
  id: string
  type: 'image' | 'video' | '3d' | 'ui-component'
  url: string
  thumbnailUrl?: string
  metadata: {
    width?: number
    height?: number
    duration?: number
    fileSize: number
    format: string
    quality: string
    prompt: string
    generatedAt: Date
  }
  optimizedVersions?: {
    webp?: string
    avif?: string
    mobile?: string
    thumbnail?: string
  }
}

export class AIMediaService {
  private apiKey: string
  private baseUrl: string
  private models: {
    image: string
    video: string
    '3d': string
    ui: string
  }

  constructor() {
    this.apiKey = process.env.AI_MEDIA_API_KEY || 'demo-key'
    this.baseUrl = process.env.AI_MEDIA_API_URL || 'https://api.runwayml.com/v1'
    
    this.models = {
      image: 'runway-gen3-turbo',
      video: 'runway-gen3-alpha',
      '3d': 'meshy-ai-v3',
      ui: 'midjourney-v6.1'
    }
  }

  /**
   * Generate complete media package for an app
   */
  async generateAppMediaPackage(
    template: AppTemplate,
    generatedApp: GeneratedApp
  ): Promise<{
    hero: GeneratedMediaAsset
    screenshots: GeneratedMediaAsset[]
    demo: GeneratedMediaAsset
    icons: GeneratedMediaAsset[]
    backgrounds: GeneratedMediaAsset[]
    uiElements: GeneratedMediaAsset[]
    scene3d?: GeneratedMediaAsset
  }> {
    console.log(`🎨 Generating media package for: ${template.name}`)
    
    const mediaPackage = {
      hero: await this.generateHeroImage(template),
      screenshots: await this.generateScreenshots(template),
      demo: await this.generateDemoVideo(template, generatedApp),
      icons: await this.generateIcons(template),
      backgrounds: await this.generateBackgrounds(template),
      uiElements: await this.generateUIElements(template),
      scene3d: template.category === 'game' || template.type === 'web' 
        ? await this.generate3DScene(template) 
        : undefined
    }

    console.log(`✅ Media package complete: ${Object.keys(mediaPackage).length} asset types`)
    return mediaPackage
  }

  /**
   * Generate hero image for app showcase
   */
  async generateHeroImage(template: AppTemplate): Promise<GeneratedMediaAsset> {
    const prompt = this.buildHeroPrompt(template)
    
    return await this.generateImage({
      type: 'image',
      category: 'hero',
      style: 'beach-monokai',
      dimensions: { width: 1920, height: 1080 },
      prompt,
      quality: 'premium',
      format: 'webp'
    })
  }

  /**
   * Generate app screenshots
   */
  async generateScreenshots(template: AppTemplate): Promise<GeneratedMediaAsset[]> {
    const screenshots = []
    const screenTypes = ['home', 'dashboard', 'details', 'settings']
    
    for (const screenType of screenTypes) {
      const prompt = this.buildScreenshotPrompt(template, screenType)
      
      const screenshot = await this.generateImage({
        type: 'image',
        category: `screenshot-${screenType}`,
        style: 'beach-monokai',
        dimensions: { width: 1080, height: 1920 },
        prompt,
        quality: 'standard'
      })
      
      screenshots.push(screenshot)
    }
    
    return screenshots
  }

  /**
   * Generate demo video
   */
  async generateDemoVideo(template: AppTemplate, generatedApp: GeneratedApp): Promise<GeneratedMediaAsset> {
    const prompt = this.buildVideoPrompt(template, generatedApp)
    
    return await this.generateVideo({
      type: 'video',
      category: 'demo',
      style: 'beach-monokai',
      duration: 30,
      prompt,
      quality: 'premium',
      format: 'mp4'
    })
  }

  /**
   * Generate app icons
   */
  async generateIcons(template: AppTemplate): Promise<GeneratedMediaAsset[]> {
    const icons = []
    const iconSizes = [
      { size: 512, name: 'app-icon' },
      { size: 256, name: 'medium-icon' },
      { size: 128, name: 'small-icon' },
      { size: 64, name: 'favicon' }
    ]
    
    for (const iconSpec of iconSizes) {
      const prompt = this.buildIconPrompt(template, iconSpec.size)
      
      const icon = await this.generateImage({
        type: 'image',
        category: iconSpec.name,
        style: 'minimal',
        dimensions: { width: iconSpec.size, height: iconSpec.size },
        prompt,
        quality: 'premium',
        format: 'png'
      })
      
      icons.push(icon)
    }
    
    return icons
  }

  /**
   * Generate background images
   */
  async generateBackgrounds(template: AppTemplate): Promise<GeneratedMediaAsset[]> {
    const backgrounds = []
    const bgTypes = ['gradient', 'pattern', 'texture', 'abstract']
    
    for (const bgType of bgTypes) {
      const prompt = this.buildBackgroundPrompt(template, bgType)
      
      const background = await this.generateImage({
        type: 'image',
        category: `background-${bgType}`,
        style: 'beach-monokai',
        dimensions: { width: 1920, height: 1080 },
        prompt,
        quality: 'standard'
      })
      
      backgrounds.push(background)
    }
    
    return backgrounds
  }

  /**
   * Generate UI elements (buttons, cards, etc.)
   */
  async generateUIElements(template: AppTemplate): Promise<GeneratedMediaAsset[]> {
    const uiElements = []
    const elementTypes = ['button-primary', 'button-secondary', 'card-template', 'navigation-bar']
    
    for (const elementType of elementTypes) {
      const prompt = this.buildUIElementPrompt(template, elementType)
      
      const element = await this.generateImage({
        type: 'ui-component',
        category: elementType,
        style: 'glassmorphic',
        dimensions: { width: 400, height: 200 },
        prompt,
        quality: 'premium'
      })
      
      uiElements.push(element)
    }
    
    return uiElements
  }

  /**
   * Generate 3D scene
   */
  async generate3DScene(template: AppTemplate): Promise<GeneratedMediaAsset> {
    const prompt = this.build3DPrompt(template)
    
    return await this.generate3D({
      type: '3d',
      category: 'scene',
      style: 'beach-monokai',
      prompt,
      quality: 'premium',
      format: 'spline'
    })
  }

  /**
   * Core image generation
   */
  private async generateImage(request: MediaGenerationRequest): Promise<GeneratedMediaAsset> {
    if (this.apiKey === 'demo-key') {
      return this.generateDemoAsset(request)
    }

    try {
      const response = await fetch(`${this.baseUrl}/images/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.models.image,
          prompt: request.prompt,
          width: request.dimensions?.width || 1024,
          height: request.dimensions?.height || 1024,
          quality: request.quality,
          format: request.format || 'webp',
          style_preset: this.getStylePreset(request.style)
        })
      })

      if (!response.ok) {
        throw new Error(`Image generation failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      return {
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'image',
        url: result.url,
        thumbnailUrl: result.thumbnail_url,
        metadata: {
          width: request.dimensions?.width || 1024,
          height: request.dimensions?.height || 1024,
          fileSize: result.file_size || 0,
          format: request.format || 'webp',
          quality: request.quality,
          prompt: request.prompt,
          generatedAt: new Date()
        },
        optimizedVersions: {
          webp: result.webp_url,
          avif: result.avif_url,
          mobile: result.mobile_url,
          thumbnail: result.thumbnail_url
        }
      }
    } catch (error) {
      console.error('Image generation error:', error)
      return this.generateDemoAsset(request)
    }
  }

  /**
   * Core video generation
   */
  private async generateVideo(request: MediaGenerationRequest): Promise<GeneratedMediaAsset> {
    if (this.apiKey === 'demo-key') {
      return this.generateDemoAsset(request)
    }

    try {
      const response = await fetch(`${this.baseUrl}/videos/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.models.video,
          prompt: request.prompt,
          duration: request.duration || 10,
          quality: request.quality,
          format: request.format || 'mp4',
          style_preset: this.getStylePreset(request.style)
        })
      })

      if (!response.ok) {
        throw new Error(`Video generation failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      return {
        id: `vid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'video',
        url: result.url,
        thumbnailUrl: result.thumbnail_url,
        metadata: {
          duration: request.duration || 10,
          fileSize: result.file_size || 0,
          format: request.format || 'mp4',
          quality: request.quality,
          prompt: request.prompt,
          generatedAt: new Date()
        }
      }
    } catch (error) {
      console.error('Video generation error:', error)
      return this.generateDemoAsset(request)
    }
  }

  /**
   * Core 3D generation
   */
  private async generate3D(request: MediaGenerationRequest): Promise<GeneratedMediaAsset> {
    if (this.apiKey === 'demo-key') {
      return this.generateDemoAsset(request)
    }

    try {
      const response = await fetch(`${this.baseUrl}/3d/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.models['3d'],
          prompt: request.prompt,
          quality: request.quality,
          format: request.format || 'gltf',
          style_preset: this.getStylePreset(request.style)
        })
      })

      if (!response.ok) {
        throw new Error(`3D generation failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      return {
        id: `3d_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: '3d',
        url: result.url,
        thumbnailUrl: result.thumbnail_url,
        metadata: {
          fileSize: result.file_size || 0,
          format: request.format || 'gltf',
          quality: request.quality,
          prompt: request.prompt,
          generatedAt: new Date()
        }
      }
    } catch (error) {
      console.error('3D generation error:', error)
      return this.generateDemoAsset(request)
    }
  }

  /**
   * Generate demo asset for testing
   */
  private generateDemoAsset(request: MediaGenerationRequest): GeneratedMediaAsset {
    const assetId = `demo_${request.type}_${Date.now()}`
    const baseUrl = 'https://images.unsplash.com'
    
    const demoUrls = {
      image: `${baseUrl}/1920x1080/?${request.category}&beach&monokai`,
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      '3d': 'https://prod.spline.design/demo-scene.splinecode',
      'ui-component': `${baseUrl}/400x200/?ui&${request.category}&glassmorphic`
    }
    
    return {
      id: assetId,
      type: request.type,
      url: demoUrls[request.type],
      thumbnailUrl: request.type === 'video' ? `${baseUrl}/400x300/?thumbnail` : undefined,
      metadata: {
        width: request.dimensions?.width,
        height: request.dimensions?.height,
        duration: request.duration,
        fileSize: 1024 * 1024, // 1MB demo
        format: request.format || 'demo',
        quality: request.quality,
        prompt: request.prompt,
        generatedAt: new Date()
      }
    }
  }

  // Prompt builders
  private buildHeroPrompt(template: AppTemplate): string {
    return `Professional hero image for ${template.name} ${template.type} application. 
      Category: ${template.category}. Framework: ${template.framework}.
      Style: Beach Monokai color palette with ocean blues (#66D9EF), warm yellows (#E6DB74), 
      and dark backgrounds (#272822). Glassmorphic design with subtle gradients.
      Modern, clean, premium quality. ${template.description}.
      Photorealistic, 8K resolution, professional lighting.`
  }

  private buildScreenshotPrompt(template: AppTemplate, screenType: string): string {
    return `${screenType} screen mockup for ${template.name} ${template.type} app.
      Beach Monokai UI design with glassmorphic cards, ocean blue accents,
      warm yellow highlights. Modern interface, clean typography.
      Mobile-first design, premium quality. ${template.description}.
      UI/UX design, Behance quality, professional mockup.`
  }

  private buildVideoPrompt(template: AppTemplate, generatedApp: GeneratedApp): string {
    return `Professional demo video for ${template.name} application.
      Show smooth navigation, Beach Monokai animations, glassmorphic transitions.
      Ocean wave-inspired motion, gentle floating elements.
      Duration: 30 seconds. Premium quality, cinematic feel.
      App features: ${template.features?.join(', ')}.
      Professional product demo, modern tech presentation.`
  }

  private buildIconPrompt(template: AppTemplate, size: number): string {
    return `App icon for ${template.name}. ${size}x${size} pixels.
      Beach Monokai color scheme, modern minimalist design.
      Represents ${template.category} category. Clean, recognizable symbol.
      Flat design with subtle depth, premium quality icon.
      Professional app store quality.`
  }

  private buildBackgroundPrompt(template: AppTemplate, bgType: string): string {
    return `${bgType} background for ${template.name} app.
      Beach Monokai theme: ocean blues, warm yellows, dark grays.
      Glassmorphic style, subtle ${bgType} patterns.
      Modern, clean, professional. Supports glassmorphic overlays.
      8K resolution, seamless tiling.`
  }

  private buildUIElementPrompt(template: AppTemplate, elementType: string): string {
    return `${elementType} UI component for ${template.name} app.
      Beach Monokai glassmorphic design. Ocean blue (#66D9EF) primary,
      warm yellow (#E6DB74) accents, dark background (#272822).
      Modern, clean, interactive. Premium quality component.
      Behance-level design quality.`
  }

  private build3DPrompt(template: AppTemplate): string {
    return `3D scene for ${template.name} ${template.type} application.
      Beach Monokai environment with ocean themes, floating elements.
      Glassmorphic 3D objects, smooth animations, modern aesthetic.
      Interactive elements, premium quality. Optimized for web.
      Spline-compatible 3D scene.`
  }

  private getStylePreset(style: string): string {
    const presets = {
      'beach-monokai': 'monokai_ocean_glassmorphic',
      'glassmorphic': 'glass_modern_clean',
      'minimal': 'minimal_clean_modern',
      'vibrant': 'vibrant_colorful_dynamic'
    }
    return presets[style] || presets['beach-monokai']
  }
}

// Export singleton instance
export const aiMediaService = new AIMediaService()
