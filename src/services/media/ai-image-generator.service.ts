/**
 * Elite AI Image Generation Service
 * Professional image generation using Flux Pro and advanced models
 */

import { AppTemplate, GeneratedApp } from '../types/app-generation.types'

export interface ImageGenerationRequest {
  prompt: string
  style: 'professional' | 'creative' | 'minimalist' | 'vibrant' | 'ece-brand'
  aspect: '16:9' | '1:1' | '9:16' | '4:3' | '3:2'
  quality: 'standard' | 'high' | 'ultra'
  count: number
  tags?: string[]
}

export interface GeneratedImage {
  id: string
  url: string
  prompt: string
  style: string
  dimensions: { width: number; height: number }
  fileSize: number
  metadata: {
    model: string
    seed: number
    steps: number
    guidance: number
    generatedAt: Date
  }
}

export interface ImageAssetPackage {
  hero: GeneratedImage[]
  icons: GeneratedImage[]
  backgrounds: GeneratedImage[]
  ui: GeneratedImage[]
  marketing: GeneratedImage[]
  social: GeneratedImage[]
}

export class AIImageGenerator {
  private apiKey: string
  private baseUrl: string
  private isDemo: boolean

  constructor() {
    this.apiKey = process.env.FLUX_API_KEY || 'demo-key'
    this.baseUrl = 'https://api.runpod.ai/v2/flux-pro'
    this.isDemo = !process.env.FLUX_API_KEY || process.env.FLUX_API_KEY === 'demo-key'
  }

  /**
   * Generate complete image asset package for an app
   */
  async generateAppAssets(app: GeneratedApp): Promise<ImageAssetPackage> {
    console.log(`🎨 Generating image assets for ${app.name}...`)

    const basePrompt = this.createBasePrompt(app)
    
    try {
      const [hero, icons, backgrounds, ui, marketing, social] = await Promise.all([
        this.generateHeroImages(basePrompt, app),
        this.generateIcons(basePrompt, app),
        this.generateBackgrounds(basePrompt, app),
        this.generateUIElements(basePrompt, app),
        this.generateMarketingImages(basePrompt, app),
        this.generateSocialImages(basePrompt, app)
      ])

      return { hero, icons, backgrounds, ui, marketing, social }

    } catch (error) {
      console.warn('⚠️ Production image generation failed, using demo assets')
      return this.generateDemoAssets(app)
    }
  }

  /**
   * Generate hero images for app landing page
   */
  private async generateHeroImages(basePrompt: string, app: GeneratedApp): Promise<GeneratedImage[]> {
    const heroPrompts = [
      `${basePrompt}, hero banner, modern UI mockup, clean design, professional photography style`,
      `${basePrompt}, app showcase, 3D perspective, floating interface elements, premium feel`,
      `${basePrompt}, product hero shot, elegant composition, soft lighting, high-end visualization`
    ]

    const images: GeneratedImage[] = []
    
    for (const prompt of heroPrompts) {
      const request: ImageGenerationRequest = {
        prompt,
        style: 'professional',
        aspect: '16:9',
        quality: 'ultra',
        count: 1,
        tags: ['hero', 'banner', 'showcase']
      }
      
      const generatedImages = await this.generateImages(request)
      images.push(...generatedImages)
    }

    return images
  }

  /**
   * Generate app icons and UI icons
   */
  private async generateIcons(basePrompt: string, app: GeneratedApp): Promise<GeneratedImage[]> {
    const iconPrompts = [
      `${basePrompt}, app icon, circular design, modern flat style, minimal, 1024x1024`,
      `navigation icons, line art style, consistent stroke width, ${app.category} theme`,
      `feature icons, filled style, rounded corners, professional UI design`,
      `status icons, notification badges, micro-interactions ready`
    ]

    const images: GeneratedImage[] = []
    
    for (const prompt of iconPrompts) {
      const request: ImageGenerationRequest = {
        prompt,
        style: 'minimalist',
        aspect: '1:1',
        quality: 'high',
        count: 2,
        tags: ['icon', 'ui', 'interface']
      }
      
      const generatedImages = await this.generateImages(request)
      images.push(...generatedImages)
    }

    return images
  }

  /**
   * Generate background images and textures
   */
  private async generateBackgrounds(basePrompt: string, app: GeneratedApp): Promise<GeneratedImage[]> {
    const backgroundPrompts = [
      `${basePrompt}, abstract gradient background, ECE beach monokai colors, smooth transitions`,
      `geometric pattern background, subtle texture, professional design, low opacity overlay`,
      `blurred bokeh background, soft lighting, premium feel, glassmorphism ready`,
      `wave pattern background, flowing design, calming animation ready, beach theme`
    ]

    const images: GeneratedImage[] = []
    
    for (const prompt of backgroundPrompts) {
      const request: ImageGenerationRequest = {
        prompt,
        style: 'ece-brand',
        aspect: '16:9',
        quality: 'high',
        count: 2,
        tags: ['background', 'texture', 'pattern']
      }
      
      const generatedImages = await this.generateImages(request)
      images.push(...generatedImages)
    }

    return images
  }

  /**
   * Generate UI elements and components
   */
  private async generateUIElements(basePrompt: string, app: GeneratedApp): Promise<GeneratedImage[]> {
    const uiPrompts = [
      `modern button designs, glassmorphism style, multiple states, hover effects ready`,
      `card components, shadow effects, rounded corners, professional UI kit`,
      `form elements, input fields, dropdown menus, consistent design system`,
      `loading animations, progress indicators, micro-interactions, smooth transitions`
    ]

    const images: GeneratedImage[] = []
    
    for (const prompt of uiPrompts) {
      const request: ImageGenerationRequest = {
        prompt: `${prompt}, ECE beach monokai theme, high quality UI design`,
        style: 'professional',
        aspect: '4:3',
        quality: 'high',
        count: 3,
        tags: ['ui', 'component', 'interface']
      }
      
      const generatedImages = await this.generateImages(request)
      images.push(...generatedImages)
    }

    return images
  }

  /**
   * Generate marketing and promotional images
   */
  private async generateMarketingImages(basePrompt: string, app: GeneratedApp): Promise<GeneratedImage[]> {
    const marketingPrompts = [
      `${basePrompt}, app store screenshot, feature highlights, professional presentation`,
      `promotional banner, eye-catching design, call-to-action ready, marketing focus`,
      `feature showcase, split layout, before/after comparison, results oriented`,
      `testimonial background, social proof design, trust building imagery`
    ]

    const images: GeneratedImage[] = []
    
    for (const prompt of marketingPrompts) {
      const request: ImageGenerationRequest = {
        prompt,
        style: 'vibrant',
        aspect: '16:9',
        quality: 'high',
        count: 2,
        tags: ['marketing', 'promotional', 'showcase']
      }
      
      const generatedImages = await this.generateImages(request)
      images.push(...generatedImages)
    }

    return images
  }

  /**
   * Generate social media ready images
   */
  private async generateSocialImages(basePrompt: string, app: GeneratedApp): Promise<GeneratedImage[]> {
    const socialPrompts = [
      `${basePrompt}, Instagram post, square format, social media ready, engaging design`,
      `Twitter/X header image, app promotion, professional branding, call-to-action`,
      `LinkedIn post image, business focus, professional presentation, thought leadership`,
      `Facebook cover image, community building, user engagement, social proof`
    ]

    const images: GeneratedImage[] = []
    
    for (const prompt of socialPrompts) {
      const request: ImageGenerationRequest = {
        prompt,
        style: 'vibrant',
        aspect: '1:1',
        quality: 'high',
        count: 1,
        tags: ['social', 'marketing', 'engagement']
      }
      
      const generatedImages = await this.generateImages(request)
      images.push(...generatedImages)
    }

    return images
  }

  /**
   * Core image generation with Flux Pro API
   */
  private async generateImages(request: ImageGenerationRequest): Promise<GeneratedImage[]> {
    if (this.isDemo) {
      return this.generateDemoImages(request)
    }

    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: this.enhancePrompt(request.prompt, request.style),
          aspect_ratio: request.aspect,
          quality: request.quality,
          num_images: request.count,
          model: 'flux-pro-1.1',
          steps: request.quality === 'ultra' ? 50 : 30,
          guidance_scale: 7.5,
          seed: Math.floor(Math.random() * 1000000)
        })
      })

      if (!response.ok) {
        throw new Error(`Flux API error: ${response.status}`)
      }

      const data = await response.json()
      return this.processFluxResponse(data, request)

    } catch (error) {
      console.warn(`⚠️ Flux generation failed: ${error}`)
      return this.generateDemoImages(request)
    }
  }

  /**
   * Enhance prompt with style-specific additions
   */
  private enhancePrompt(prompt: string, style: string): string {
    const styleEnhancements = {
      professional: 'professional photography, clean composition, high quality, corporate style',
      creative: 'artistic composition, creative lighting, unique perspective, innovative design',
      minimalist: 'minimal design, clean lines, simple composition, modern aesthetic',
      vibrant: 'vibrant colors, energetic composition, dynamic lighting, engaging visual',
      'ece-brand': 'ECE beach monokai colors (#F92672, #A6E22E, #66D9EF, #E6DB74, #F8EFD6), glassmorphism, modern design'
    }

    return `${prompt}, ${styleEnhancements[style] || styleEnhancements.professional}, 8K resolution, highly detailed`
  }

  /**
   * Create base prompt from app details
   */
  private createBasePrompt(app: GeneratedApp): string {
    return `${app.name} ${app.category} application, ${app.description}, ${app.framework} interface`
  }

  /**
   * Process Flux API response
   */
  private processFluxResponse(data: any, request: ImageGenerationRequest): GeneratedImage[] {
    return data.images.map((image: any, index: number) => ({
      id: `flux_${Date.now()}_${index}`,
      url: image.url,
      prompt: request.prompt,
      style: request.style,
      dimensions: { 
        width: image.width || 1024, 
        height: image.height || 1024 
      },
      fileSize: image.file_size || 0,
      metadata: {
        model: 'flux-pro-1.1',
        seed: image.seed || 0,
        steps: image.steps || 30,
        guidance: image.guidance_scale || 7.5,
        generatedAt: new Date()
      }
    }))
  }

  /**
   * Generate demo images for testing
   */
  private generateDemoImages(request: ImageGenerationRequest): GeneratedImage[] {
    const demoImages: GeneratedImage[] = []
    
    for (let i = 0; i < request.count; i++) {
      demoImages.push({
        id: `demo_${Date.now()}_${i}`,
        url: this.getDemoImageUrl(request.style, request.aspect),
        prompt: request.prompt,
        style: request.style,
        dimensions: this.getAspectDimensions(request.aspect),
        fileSize: 512000, // 512KB demo
        metadata: {
          model: 'demo-generator',
          seed: Math.floor(Math.random() * 1000000),
          steps: 30,
          guidance: 7.5,
          generatedAt: new Date()
        }
      })
    }
    
    return demoImages
  }

  /**
   * Generate demo assets for testing
   */
  private generateDemoAssets(app: GeneratedApp): ImageAssetPackage {
    return {
      hero: this.generateDemoImages({ 
        prompt: `${app.name} hero`, 
        style: 'professional', 
        aspect: '16:9', 
        quality: 'high', 
        count: 3 
      }),
      icons: this.generateDemoImages({ 
        prompt: `${app.name} icons`, 
        style: 'minimalist', 
        aspect: '1:1', 
        quality: 'high', 
        count: 8 
      }),
      backgrounds: this.generateDemoImages({ 
        prompt: `${app.name} backgrounds`, 
        style: 'ece-brand', 
        aspect: '16:9', 
        quality: 'high', 
        count: 4 
      }),
      ui: this.generateDemoImages({ 
        prompt: `${app.name} UI elements`, 
        style: 'professional', 
        aspect: '4:3', 
        quality: 'high', 
        count: 6 
      }),
      marketing: this.generateDemoImages({ 
        prompt: `${app.name} marketing`, 
        style: 'vibrant', 
        aspect: '16:9', 
        quality: 'high', 
        count: 4 
      }),
      social: this.generateDemoImages({ 
        prompt: `${app.name} social`, 
        style: 'vibrant', 
        aspect: '1:1', 
        quality: 'high', 
        count: 4 
      })
    }
  }

  /**
   * Get demo image URL based on style and aspect
   */
  private getDemoImageUrl(style: string, aspect: string): string {
    const baseUrl = 'https://picsum.photos'
    const dimensions = this.getAspectDimensions(aspect)
    return `${baseUrl}/${dimensions.width}/${dimensions.height}?random=${Math.random()}`
  }

  /**
   * Convert aspect ratio to dimensions
   */
  private getAspectDimensions(aspect: string): { width: number; height: number } {
    const aspectMap = {
      '16:9': { width: 1920, height: 1080 },
      '1:1': { width: 1024, height: 1024 },
      '9:16': { width: 1080, height: 1920 },
      '4:3': { width: 1024, height: 768 },
      '3:2': { width: 1024, height: 683 }
    }
    return aspectMap[aspect] || aspectMap['16:9']
  }
}

export const aiImageGenerator = new AIImageGenerator()
