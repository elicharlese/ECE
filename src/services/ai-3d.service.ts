/**
 * AI 3D Asset Generation Service
 * Professional 3D models, scenes, and interactive experiences
 */

export interface ThreeDGenerationRequest {
  type: 'model' | 'scene' | 'environment' | 'ui-element' | 'animation'
  category: string
  style: 'beach-monokai' | 'realistic' | 'stylized' | 'minimal'
  complexity: 'low' | 'medium' | 'high' | 'ultra'
  format: 'gltf' | 'fbx' | 'obj' | 'spline' | 'usd'
  prompt: string
  interactive: boolean
  animated: boolean
  optimization: 'web' | 'mobile' | 'desktop' | 'vr'
}

export interface Generated3DAsset {
  id: string
  type: string
  url: string
  thumbnailUrl: string
  previewUrl: string // 360° preview or interactive demo
  format: string
  metadata: {
    vertices: number
    triangles: number
    fileSize: number
    textureCount: number
    animationCount: number
    prompt: string
    generatedAt: Date
    provider: string
    processingTime: number
  }
  optimizedVersions: {
    web: string      // Optimized for web (low poly)
    mobile: string   // Mobile optimized (very low poly)
    desktop: string  // High quality version
    vr?: string      // VR optimized if applicable
  }
  textures: {
    diffuse?: string
    normal?: string
    roughness?: string
    metalness?: string
    emission?: string
  }
  animations?: {
    name: string
    duration: number
    url: string
  }[]
}

export class AI3DService {
  private providers: {
    meshy: { apiKey: string; baseUrl: string }
    luma: { apiKey: string; baseUrl: string }
    spline: { apiKey: string; baseUrl: string }
    kaedim: { apiKey: string; baseUrl: string }
    alpha3d: { apiKey: string; baseUrl: string }
  }

  constructor() {
    this.providers = {
      meshy: {
        apiKey: process.env.MESHY_API_KEY || 'demo-meshy',
        baseUrl: 'https://api.meshy.ai/v1'
      },
      luma: {
        apiKey: process.env.LUMA_3D_API_KEY || 'demo-luma3d',
        baseUrl: 'https://api.lumalabs.ai/v1'
      },
      spline: {
        apiKey: process.env.SPLINE_API_KEY || 'demo-spline',
        baseUrl: 'https://api.spline.design/v1'
      },
      kaedim: {
        apiKey: process.env.KAEDIM_API_KEY || 'demo-kaedim',
        baseUrl: 'https://api.kaedim3d.com/v1'
      },
      alpha3d: {
        apiKey: process.env.ALPHA3D_API_KEY || 'demo-alpha3d',
        baseUrl: 'https://api.alpha3d.io/v1'
      }
    }
  }

  /**
   * Generate complete 3D package for an app
   */
  async generateApp3DPackage(appName: string, appType: string, category: string): Promise<{
    heroScene: Generated3DAsset
    uiElements: Generated3DAsset[]
    icons: Generated3DAsset[]
    environments: Generated3DAsset[]
    interactive: Generated3DAsset[]
    animations: Generated3DAsset[]
  }> {
    console.log(`🎲 Generating 3D package for: ${appName}`)

    const [heroScene, uiElements, icons, environments, interactive, animations] = await Promise.all([
      this.generateHeroScene(appName, appType, category),
      this.generateUIElements3D(appName, appType),
      this.generate3DIcons(appName, category),
      this.generateEnvironments(appName, appType),
      this.generateInteractiveElements(appName, appType),
      this.generate3DAnimations(appName, appType)
    ])

    return {
      heroScene,
      uiElements,
      icons,
      environments,
      interactive,
      animations
    }
  }

  /**
   * Generate hero 3D scene
   */
  async generateHeroScene(appName: string, appType: string, category: string): Promise<Generated3DAsset> {
    const request: ThreeDGenerationRequest = {
      type: 'scene',
      category: 'hero',
      style: 'beach-monokai',
      complexity: 'high',
      format: 'spline',
      prompt: this.buildHeroScenePrompt(appName, appType, category),
      interactive: true,
      animated: true,
      optimization: 'web'
    }

    return await this.generateWithBestProvider(request)
  }

  /**
   * Generate 3D UI elements
   */
  async generateUIElements3D(appName: string, appType: string): Promise<Generated3DAsset[]> {
    const uiElements = []
    const elementTypes = ['button', 'card', 'panel', 'navigation', 'menu']

    for (const elementType of elementTypes) {
      const request: ThreeDGenerationRequest = {
        type: 'ui-element',
        category: elementType,
        style: 'beach-monokai',
        complexity: 'medium',
        format: 'gltf',
        prompt: this.buildUIElement3DPrompt(appName, elementType),
        interactive: true,
        animated: false,
        optimization: 'web'
      }

      const element = await this.generateWithBestProvider(request)
      uiElements.push(element)
    }

    return uiElements
  }

  /**
   * Generate 3D icons
   */
  async generate3DIcons(appName: string, category: string): Promise<Generated3DAsset[]> {
    const icons = []
    const iconTypes = ['app-icon', 'feature-icon', 'category-icon', 'action-icon']

    for (const iconType of iconTypes) {
      const request: ThreeDGenerationRequest = {
        type: 'model',
        category: iconType,
        style: 'stylized',
        complexity: 'low',
        format: 'gltf',
        prompt: this.build3DIconPrompt(appName, category, iconType),
        interactive: false,
        animated: true,
        optimization: 'mobile'
      }

      const icon = await this.generateWithBestProvider(request)
      icons.push(icon)
    }

    return icons
  }

  /**
   * Generate 3D environments
   */
  async generateEnvironments(appName: string, appType: string): Promise<Generated3DAsset[]> {
    const environments = []
    const envTypes = ['background', 'ambient', 'showcase', 'immersive']

    for (const envType of envTypes) {
      const request: ThreeDGenerationRequest = {
        type: 'environment',
        category: envType,
        style: 'beach-monokai',
        complexity: 'high',
        format: 'spline',
        prompt: this.buildEnvironmentPrompt(appName, appType, envType),
        interactive: envType === 'immersive',
        animated: true,
        optimization: 'web'
      }

      const environment = await this.generateWithBestProvider(request)
      environments.push(environment)
    }

    return environments
  }

  /**
   * Generate interactive 3D elements
   */
  async generateInteractiveElements(appName: string, appType: string): Promise<Generated3DAsset[]> {
    const interactive = []
    const interactiveTypes = ['hover-effect', 'click-animation', 'scroll-parallax', 'gesture-control']

    for (const interactiveType of interactiveTypes) {
      const request: ThreeDGenerationRequest = {
        type: 'animation',
        category: interactiveType,
        style: 'beach-monokai',
        complexity: 'medium',
        format: 'gltf',
        prompt: this.buildInteractivePrompt(appName, interactiveType),
        interactive: true,
        animated: true,
        optimization: 'web'
      }

      const element = await this.generateWithBestProvider(request)
      interactive.push(element)
    }

    return interactive
  }

  /**
   * Generate 3D animations
   */
  async generate3DAnimations(appName: string, appType: string): Promise<Generated3DAsset[]> {
    const animations = []
    const animationTypes = ['loading', 'transition', 'celebration', 'error']

    for (const animationType of animationTypes) {
      const request: ThreeDGenerationRequest = {
        type: 'animation',
        category: animationType,
        style: 'beach-monokai',
        complexity: 'medium',
        format: 'gltf',
        prompt: this.buildAnimationPrompt(appName, animationType),
        interactive: false,
        animated: true,
        optimization: 'web'
      }

      const animation = await this.generateWithBestProvider(request)
      animations.push(animation)
    }

    return animations
  }

  /**
   * Choose best provider and generate
   */
  private async generateWithBestProvider(request: ThreeDGenerationRequest): Promise<Generated3DAsset> {
    const bestProvider = this.selectBestProvider(request)
    
    switch (bestProvider) {
      case 'meshy':
        return await this.generateWithMeshy(request)
      case 'luma':
        return await this.generateWithLuma3D(request)
      case 'spline':
        return await this.generateWithSpline(request)
      case 'kaedim':
        return await this.generateWithKaedim(request)
      case 'alpha3d':
        return await this.generateWithAlpha3D(request)
      default:
        return this.generateDemo3D(request)
    }
  }

  /**
   * Select best provider for 3D type
   */
  private selectBestProvider(request: ThreeDGenerationRequest): string {
    // Provider strengths:
    // Meshy: Best for general 3D models, high quality
    // Luma: Best for realistic scenes and environments
    // Spline: Best for interactive web experiences
    // Kaedim: Best for game assets and stylized models
    // Alpha3D: Best for product visualization

    if (request.format === 'spline' || request.interactive) return 'spline'
    if (request.type === 'environment' || request.style === 'realistic') return 'luma'
    if (request.category.includes('game') || request.style === 'stylized') return 'kaedim'
    if (request.category.includes('product')) return 'alpha3d'
    
    return 'meshy' // Default to Meshy for general models
  }

  /**
   * Generate with Meshy AI
   */
  private async generateWithMeshy(request: ThreeDGenerationRequest): Promise<Generated3DAsset> {
    if (this.providers.meshy.apiKey === 'demo-meshy') {
      return this.generateDemo3D(request)
    }

    try {
      const response = await fetch(`${this.providers.meshy.baseUrl}/3d/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.providers.meshy.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: request.prompt,
          style: request.style,
          complexity: request.complexity,
          format: request.format,
          optimization: request.optimization
        })
      })

      if (!response.ok) {
        throw new Error(`Meshy generation failed: ${response.statusText}`)
      }

      const result = await response.json()
      return this.format3DResult(result, request, 'meshy')
    } catch (error) {
      console.error('Meshy generation error:', error)
      return this.generateDemo3D(request)
    }
  }

  /**
   * Generate with Luma 3D
   */
  private async generateWithLuma3D(request: ThreeDGenerationRequest): Promise<Generated3DAsset> {
    if (this.providers.luma.apiKey === 'demo-luma3d') {
      return this.generateDemo3D(request)
    }

    try {
      const response = await fetch(`${this.providers.luma.baseUrl}/3d/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.providers.luma.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: request.prompt,
          quality: request.complexity,
          format: request.format
        })
      })

      if (!response.ok) {
        throw new Error(`Luma 3D generation failed: ${response.statusText}`)
      }

      const result = await response.json()
      return this.format3DResult(result, request, 'luma')
    } catch (error) {
      console.error('Luma 3D generation error:', error)
      return this.generateDemo3D(request)
    }
  }

  /**
   * Generate with Spline
   */
  private async generateWithSpline(request: ThreeDGenerationRequest): Promise<Generated3DAsset> {
    if (this.providers.spline.apiKey === 'demo-spline') {
      return this.generateDemo3D(request)
    }

    try {
      const response = await fetch(`${this.providers.spline.baseUrl}/scenes/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.providers.spline.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: request.prompt,
          interactive: request.interactive,
          animated: request.animated,
          style: request.style
        })
      })

      if (!response.ok) {
        throw new Error(`Spline generation failed: ${response.statusText}`)
      }

      const result = await response.json()
      return this.format3DResult(result, request, 'spline')
    } catch (error) {
      console.error('Spline generation error:', error)
      return this.generateDemo3D(request)
    }
  }

  /**
   * Generate with Kaedim
   */
  private async generateWithKaedim(request: ThreeDGenerationRequest): Promise<Generated3DAsset> {
    if (this.providers.kaedim.apiKey === 'demo-kaedim') {
      return this.generateDemo3D(request)
    }

    try {
      const response = await fetch(`${this.providers.kaedim.baseUrl}/models/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.providers.kaedim.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: request.prompt,
          style: request.style,
          format: request.format
        })
      })

      if (!response.ok) {
        throw new Error(`Kaedim generation failed: ${response.statusText}`)
      }

      const result = await response.json()
      return this.format3DResult(result, request, 'kaedim')
    } catch (error) {
      console.error('Kaedim generation error:', error)
      return this.generateDemo3D(request)
    }
  }

  /**
   * Generate with Alpha3D
   */
  private async generateWithAlpha3D(request: ThreeDGenerationRequest): Promise<Generated3DAsset> {
    if (this.providers.alpha3d.apiKey === 'demo-alpha3d') {
      return this.generateDemo3D(request)
    }

    try {
      const response = await fetch(`${this.providers.alpha3d.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.providers.alpha3d.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: request.prompt,
          quality: request.complexity,
          format: request.format
        })
      })

      if (!response.ok) {
        throw new Error(`Alpha3D generation failed: ${response.statusText}`)
      }

      const result = await response.json()
      return this.format3DResult(result, request, 'alpha3d')
    } catch (error) {
      console.error('Alpha3D generation error:', error)
      return this.generateDemo3D(request)
    }
  }

  /**
   * Generate demo 3D asset
   */
  private generateDemo3D(request: ThreeDGenerationRequest): Generated3DAsset {
    const assetId = `demo_3d_${Date.now()}`
    
    return {
      id: assetId,
      type: request.type,
      url: 'https://prod.spline.design/demo-scene.splinecode',
      thumbnailUrl: 'https://images.unsplash.com/400x300/?3d&render',
      previewUrl: 'https://my.spline.design/demo-scene-preview',
      format: request.format,
      metadata: {
        vertices: 10000,
        triangles: 15000,
        fileSize: 2 * 1024 * 1024, // 2MB
        textureCount: 3,
        animationCount: request.animated ? 2 : 0,
        prompt: request.prompt,
        generatedAt: new Date(),
        provider: 'demo',
        processingTime: 60
      },
      optimizedVersions: {
        web: 'https://prod.spline.design/demo-scene-web.splinecode',
        mobile: 'https://prod.spline.design/demo-scene-mobile.splinecode',
        desktop: 'https://prod.spline.design/demo-scene-desktop.splinecode'
      },
      textures: {
        diffuse: 'https://images.unsplash.com/1024x1024/?texture&diffuse',
        normal: 'https://images.unsplash.com/1024x1024/?texture&normal',
        roughness: 'https://images.unsplash.com/1024x1024/?texture&roughness'
      },
      animations: request.animated ? [
        { name: 'idle', duration: 3, url: 'https://demo.animations/idle.gltf' },
        { name: 'interaction', duration: 1, url: 'https://demo.animations/interaction.gltf' }
      ] : undefined
    }
  }

  /**
   * Format API result to standard 3D format
   */
  private format3DResult(result: any, request: ThreeDGenerationRequest, provider: string): Generated3DAsset {
    return {
      id: result.id || `${provider}_${Date.now()}`,
      type: request.type,
      url: result.url || result.model_url,
      thumbnailUrl: result.thumbnail_url || result.preview_image,
      previewUrl: result.preview_url || result.interactive_url,
      format: request.format,
      metadata: {
        vertices: result.vertices || 0,
        triangles: result.triangles || 0,
        fileSize: result.file_size || 0,
        textureCount: result.texture_count || 0,
        animationCount: result.animation_count || 0,
        prompt: request.prompt,
        generatedAt: new Date(),
        provider,
        processingTime: result.processing_time || 0
      },
      optimizedVersions: {
        web: result.web_optimized || result.url,
        mobile: result.mobile_optimized || result.url,
        desktop: result.desktop_version || result.url,
        vr: result.vr_version
      },
      textures: {
        diffuse: result.diffuse_texture,
        normal: result.normal_texture,
        roughness: result.roughness_texture,
        metalness: result.metalness_texture,
        emission: result.emission_texture
      },
      animations: result.animations
    }
  }

  // Prompt builders
  private buildHeroScenePrompt(appName: string, appType: string, category: string): string {
    return `Professional 3D hero scene for ${appName} ${appType} application.
      Beach Monokai theme: ocean blues (#66D9EF), warm yellows (#E6DB74), dark grays (#272822).
      Glassmorphic 3D elements, floating interactive objects, smooth animations.
      Category: ${category}. Modern, clean, premium 3D environment.
      Interactive elements, particle effects, ambient lighting.
      Optimized for web, Spline-compatible.`
  }

  private buildUIElement3DPrompt(appName: string, elementType: string): string {
    return `3D ${elementType} UI element for ${appName} app.
      Beach Monokai glassmorphic design with depth and shadows.
      Ocean blue (#66D9EF) primary color, warm yellow (#E6DB74) accents.
      Smooth hover animations, interactive feedback.
      Modern, clean, web-optimized 3D component.`
  }

  private build3DIconPrompt(appName: string, category: string, iconType: string): string {
    return `3D ${iconType} for ${appName} app in ${category} category.
      Stylized, minimalist 3D design. Beach Monokai colors.
      Clean geometry, recognizable symbol, animated idle state.
      Mobile-optimized, low poly count, premium quality.`
  }

  private buildEnvironmentPrompt(appName: string, appType: string, envType: string): string {
    return `3D ${envType} environment for ${appName} ${appType} app.
      Beach Monokai atmospheric lighting, ocean-inspired ambience.
      Floating particles, gentle animations, immersive depth.
      Glassmorphic elements, modern aesthetic, web-optimized.`
  }

  private buildInteractivePrompt(appName: string, interactiveType: string): string {
    return `3D ${interactiveType} interaction for ${appName} app.
      Beach Monokai responsive animations, smooth transitions.
      Ocean wave-inspired motion, elegant feedback.
      Web-optimized, smooth 60fps performance.`
  }

  private buildAnimationPrompt(appName: string, animationType: string): string {
    return `3D ${animationType} animation for ${appName} app.
      Beach Monokai style, ocean wave motion, smooth loops.
      Glassmorphic elements, modern aesthetic, optimized performance.
      Seamless loop, web-compatible format.`
  }
}

// Export singleton instance
export const ai3DService = new AI3DService()
