/**
 * Elite AI 3D Asset Generation Service
 * Professional 3D models, scenes, and environments
 */

import { AppTemplate, GeneratedApp } from '../types/app-generation.types'

export interface ThreeDGenerationRequest {
  prompt: string
  type: 'model' | 'scene' | 'environment' | 'character' | 'object'
  style: 'realistic' | 'stylized' | 'minimalist' | 'futuristic' | 'ece-brand'
  complexity: 'low' | 'medium' | 'high' | 'ultra'
  format: 'gltf' | 'fbx' | 'obj' | 'usd'
  animations?: string[]
}

export interface Generated3DAsset {
  id: string
  name: string
  modelUrl: string
  textureUrls: string[]
  previewUrl: string
  animationUrls?: string[]
  metadata: {
    vertices: number
    faces: number
    materials: number
    fileSize: number
    format: string
    animations: string[]
    generatedAt: Date
  }
  threeJSConfig: {
    position: [number, number, number]
    rotation: [number, number, number]
    scale: [number, number, number]
    lighting: any
    camera: any
  }
}

export interface ThreeDAssetPackage {
  models: Generated3DAsset[]
  scenes: Generated3DAsset[]
  environments: Generated3DAsset[]
  ui: Generated3DAsset[]
  interactive: Generated3DAsset[]
  characters: Generated3DAsset[]
}

export class AI3DGenerator {
  private meshy3dApiKey: string
  private splineApiKey: string
  private isDemo: boolean

  constructor() {
    this.meshy3dApiKey = process.env.MESHY_3D_API_KEY || 'demo-key'
    this.splineApiKey = process.env.SPLINE_API_KEY || 'demo-key'
    this.isDemo = !process.env.MESHY_3D_API_KEY || process.env.MESHY_3D_API_KEY === 'demo-key'
  }

  /**
   * Generate complete 3D asset package for an app
   */
  async generate3DAssets(app: GeneratedApp): Promise<ThreeDAssetPackage> {
    console.log(`🗿 Generating 3D assets for ${app.name}...`)

    try {
      const [models, scenes, environments, ui, interactive, characters] = await Promise.all([
        this.generateModels(app),
        this.generateScenes(app),
        this.generateEnvironments(app),
        this.generateUIElements(app),
        this.generateInteractiveElements(app),
        this.generateCharacters(app)
      ])

      return { models, scenes, environments, ui, interactive, characters }

    } catch (error) {
      console.warn('⚠️ Production 3D generation failed, using demo assets')
      return this.generateDemo3DPackage(app)
    }
  }

  /**
   * Generate 3D models for app features
   */
  private async generateModels(app: GeneratedApp): Promise<Generated3DAsset[]> {
    const modelRequests: ThreeDGenerationRequest[] = [
      {
        prompt: `${app.name} app icon 3D model, modern design, clean geometry, premium materials`,
        type: 'model',
        style: 'ece-brand',
        complexity: 'medium',
        format: 'gltf',
        animations: ['rotate', 'pulse']
      },
      {
        prompt: `${app.category} themed 3D objects, functional design, app-relevant items, professional quality`,
        type: 'object',
        style: 'minimalist',
        complexity: 'medium',
        format: 'gltf',
        animations: ['hover', 'select']
      },
      {
        prompt: `Modern device mockups for ${app.name}, smartphone, tablet, laptop, realistic materials`,
        type: 'model',
        style: 'realistic',
        complexity: 'high',
        format: 'gltf',
        animations: ['screen_transition', 'device_rotation']
      }
    ]

    const assets: Generated3DAsset[] = []
    for (const request of modelRequests) {
      const asset = await this.generate3DAsset(request)
      if (asset) assets.push(asset)
    }

    return assets
  }

  /**
   * Generate 3D scenes for app showcase
   */
  private async generateScenes(app: GeneratedApp): Promise<Generated3DAsset[]> {
    const sceneRequests: ThreeDGenerationRequest[] = [
      {
        prompt: `${app.name} showcase scene, floating interface elements, professional presentation, studio lighting`,
        type: 'scene',
        style: 'futuristic',
        complexity: 'high',
        format: 'gltf',
        animations: ['camera_orbit', 'element_float', 'light_cycle']
      },
      {
        prompt: `Interactive ${app.category} workspace, 3D environment, user-friendly layout, modern aesthetics`,
        type: 'scene',
        style: 'stylized',
        complexity: 'high',
        format: 'gltf',
        animations: ['environment_transition', 'workspace_reveal']
      },
      {
        prompt: `${app.name} product gallery, 3D showcase environment, premium display, elegant presentation`,
        type: 'scene',
        style: 'minimalist',
        complexity: 'medium',
        format: 'gltf',
        animations: ['gallery_rotation', 'product_highlight']
      }
    ]

    const assets: Generated3DAsset[] = []
    for (const request of sceneRequests) {
      const asset = await this.generate3DAsset(request)
      if (asset) assets.push(asset)
    }

    return assets
  }

  /**
   * Generate 3D environments
   */
  private async generateEnvironments(app: GeneratedApp): Promise<Generated3DAsset[]> {
    const environmentRequests: ThreeDGenerationRequest[] = [
      {
        prompt: `ECE beach environment, monokai color palette, calming waves, professional atmosphere`,
        type: 'environment',
        style: 'ece-brand',
        complexity: 'ultra',
        format: 'gltf',
        animations: ['wave_motion', 'color_transition', 'ambient_light']
      },
      {
        prompt: `Modern office environment for ${app.name}, professional workspace, tech-focused, clean design`,
        type: 'environment',
        style: 'realistic',
        complexity: 'high',
        format: 'gltf',
        animations: ['day_night_cycle', 'screen_updates']
      },
      {
        prompt: `Abstract ${app.category} environment, geometric shapes, dynamic patterns, innovative design`,
        type: 'environment',
        style: 'futuristic',
        complexity: 'high',
        format: 'gltf',
        animations: ['pattern_morph', 'color_flow', 'geometric_shift']
      }
    ]

    const assets: Generated3DAsset[] = []
    for (const request of environmentRequests) {
      const asset = await this.generate3DAsset(request)
      if (asset) assets.push(asset)
    }

    return assets
  }

  /**
   * Generate 3D UI elements
   */
  private async generateUIElements(app: GeneratedApp): Promise<Generated3DAsset[]> {
    const uiRequests: ThreeDGenerationRequest[] = [
      {
        prompt: `3D button collection, glassmorphism style, hover effects, modern UI design`,
        type: 'object',
        style: 'ece-brand',
        complexity: 'medium',
        format: 'gltf',
        animations: ['hover', 'press', 'glow']
      },
      {
        prompt: `3D card components, floating design, depth effects, interactive elements`,
        type: 'object',
        style: 'minimalist',
        complexity: 'medium',
        format: 'gltf',
        animations: ['flip', 'expand', 'stack']
      },
      {
        prompt: `3D navigation elements, breadcrumbs, menus, modern interface components`,
        type: 'object',
        style: 'futuristic',
        complexity: 'medium',
        format: 'gltf',
        animations: ['slide', 'fade', 'morph']
      }
    ]

    const assets: Generated3DAsset[] = []
    for (const request of uiRequests) {
      const asset = await this.generate3DAsset(request)
      if (asset) assets.push(asset)
    }

    return assets
  }

  /**
   * Generate interactive 3D elements
   */
  private async generateInteractiveElements(app: GeneratedApp): Promise<Generated3DAsset[]> {
    const interactiveRequests: ThreeDGenerationRequest[] = [
      {
        prompt: `Interactive ${app.name} features, 3D controls, user-friendly interface, responsive design`,
        type: 'object',
        style: 'stylized',
        complexity: 'high',
        format: 'gltf',
        animations: ['interact', 'feedback', 'state_change']
      },
      {
        prompt: `3D data visualization for ${app.category}, charts, graphs, interactive elements`,
        type: 'object',
        style: 'futuristic',
        complexity: 'high',
        format: 'gltf',
        animations: ['data_flow', 'chart_build', 'value_highlight']
      },
      {
        prompt: `3D progress indicators, loading animations, status displays, modern design`,
        type: 'object',
        style: 'minimalist',
        complexity: 'medium',
        format: 'gltf',
        animations: ['progress', 'complete', 'loop']
      }
    ]

    const assets: Generated3DAsset[] = []
    for (const request of interactiveRequests) {
      const asset = await this.generate3DAsset(request)
      if (asset) assets.push(asset)
    }

    return assets
  }

  /**
   * Generate 3D characters
   */
  private async generateCharacters(app: GeneratedApp): Promise<Generated3DAsset[]> {
    const characterRequests: ThreeDGenerationRequest[] = [
      {
        prompt: `${app.name} mascot character, friendly design, professional appearance, brand representative`,
        type: 'character',
        style: 'stylized',
        complexity: 'high',
        format: 'gltf',
        animations: ['idle', 'wave', 'point', 'celebrate']
      },
      {
        prompt: `Professional avatar for ${app.category}, business-appropriate, diverse representation, modern style`,
        type: 'character',
        style: 'realistic',
        complexity: 'high',
        format: 'gltf',
        animations: ['idle', 'talk', 'gesture', 'walk']
      }
    ]

    const assets: Generated3DAsset[] = []
    for (const request of characterRequests) {
      const asset = await this.generate3DAsset(request)
      if (asset) assets.push(asset)
    }

    return assets
  }

  /**
   * Core 3D asset generation
   */
  private async generate3DAsset(request: ThreeDGenerationRequest): Promise<Generated3DAsset | null> {
    if (this.isDemo) {
      return this.generateDemo3DAsset(request)
    }

    try {
      // Try Meshy 3D first
      const meshyAsset = await this.generateWithMeshy(request)
      if (meshyAsset) return meshyAsset

      // Fallback to Spline
      const splineAsset = await this.generateWithSpline(request)
      if (splineAsset) return splineAsset

      // Final fallback to demo
      return this.generateDemo3DAsset(request)

    } catch (error) {
      console.warn(`⚠️ 3D generation failed: ${error}`)
      return this.generateDemo3DAsset(request)
    }
  }

  /**
   * Generate 3D asset with Meshy 3D
   */
  private async generateWithMeshy(request: ThreeDGenerationRequest): Promise<Generated3DAsset | null> {
    try {
      const response = await fetch('https://api.meshy.ai/v1/text-to-3d', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.meshy3dApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: this.enhance3DPrompt(request),
          style: request.style,
          quality: request.complexity,
          format: request.format,
          include_animations: request.animations?.length > 0
        })
      })

      if (!response.ok) {
        throw new Error(`Meshy 3D API error: ${response.status}`)
      }

      const data = await response.json()
      return this.processMeshyResponse(data, request)

    } catch (error) {
      console.warn(`⚠️ Meshy 3D generation failed: ${error}`)
      return null
    }
  }

  /**
   * Generate 3D asset with Spline
   */
  private async generateWithSpline(request: ThreeDGenerationRequest): Promise<Generated3DAsset | null> {
    try {
      const response = await fetch('https://api.spline.design/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.splineApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: this.enhance3DPrompt(request),
          type: request.type,
          style: request.style,
          export_format: request.format
        })
      })

      if (!response.ok) {
        throw new Error(`Spline API error: ${response.status}`)
      }

      const data = await response.json()
      return this.processSplineResponse(data, request)

    } catch (error) {
      console.warn(`⚠️ Spline generation failed: ${error}`)
      return null
    }
  }

  /**
   * Enhance 3D prompt with style-specific additions
   */
  private enhance3DPrompt(request: ThreeDGenerationRequest): string {
    const styleEnhancements = {
      realistic: 'photorealistic, high-quality textures, accurate lighting, detailed geometry',
      stylized: 'artistic style, creative interpretation, unique aesthetic, expressive design',
      minimalist: 'clean geometry, simple forms, reduced details, modern aesthetic',
      futuristic: 'sci-fi style, advanced materials, glowing effects, technological design',
      'ece-brand': 'ECE beach monokai colors, glassmorphism materials, modern design, premium quality'
    }

    const complexityEnhancements = {
      low: 'low poly, optimized geometry, mobile-friendly',
      medium: 'medium detail, balanced quality, good performance',
      high: 'high detail, complex geometry, premium quality',
      ultra: 'ultra high detail, maximum quality, AAA game standard'
    }

    return `${request.prompt}, ${styleEnhancements[request.style]}, ${complexityEnhancements[request.complexity]}, production ready, optimized for web`
  }

  /**
   * Process Meshy 3D response
   */
  private processMeshyResponse(data: any, request: ThreeDGenerationRequest): Generated3DAsset {
    return {
      id: `meshy_${Date.now()}`,
      name: this.generateAssetName(request),
      modelUrl: data.model_url,
      textureUrls: data.texture_urls || [],
      previewUrl: data.preview_url,
      animationUrls: data.animation_urls || [],
      metadata: {
        vertices: data.metadata?.vertices || 0,
        faces: data.metadata?.faces || 0,
        materials: data.metadata?.materials || 1,
        fileSize: data.file_size || 0,
        format: request.format,
        animations: request.animations || [],
        generatedAt: new Date()
      },
      threeJSConfig: this.generateThreeJSConfig(request)
    }
  }

  /**
   * Process Spline response
   */
  private processSplineResponse(data: any, request: ThreeDGenerationRequest): Generated3DAsset {
    return {
      id: `spline_${Date.now()}`,
      name: this.generateAssetName(request),
      modelUrl: data.download_url,
      textureUrls: data.textures || [],
      previewUrl: data.preview_url,
      animationUrls: data.animations || [],
      metadata: {
        vertices: data.stats?.vertices || 0,
        faces: data.stats?.faces || 0,
        materials: data.stats?.materials || 1,
        fileSize: data.file_size || 0,
        format: request.format,
        animations: request.animations || [],
        generatedAt: new Date()
      },
      threeJSConfig: this.generateThreeJSConfig(request)
    }
  }

  /**
   * Generate demo 3D asset for testing
   */
  private generateDemo3DAsset(request: ThreeDGenerationRequest): Generated3DAsset {
    return {
      id: `demo_${Date.now()}`,
      name: this.generateAssetName(request),
      modelUrl: this.getDemoModelUrl(request),
      textureUrls: [this.getDemoTextureUrl()],
      previewUrl: this.getDemoPreviewUrl(),
      animationUrls: request.animations?.map(() => this.getDemoAnimationUrl()) || [],
      metadata: {
        vertices: this.getComplexityVertices(request.complexity),
        faces: this.getComplexityFaces(request.complexity),
        materials: 2,
        fileSize: this.getComplexityFileSize(request.complexity),
        format: request.format,
        animations: request.animations || [],
        generatedAt: new Date()
      },
      threeJSConfig: this.generateThreeJSConfig(request)
    }
  }

  /**
   * Generate demo 3D package for testing
   */
  private generateDemo3DPackage(app: GeneratedApp): ThreeDAssetPackage {
    return {
      models: [
        this.generateDemo3DAsset({
          prompt: `${app.name} model`,
          type: 'model',
          style: 'ece-brand',
          complexity: 'medium',
          format: 'gltf'
        })
      ],
      scenes: [
        this.generateDemo3DAsset({
          prompt: `${app.name} scene`,
          type: 'scene',
          style: 'futuristic',
          complexity: 'high',
          format: 'gltf'
        })
      ],
      environments: [
        this.generateDemo3DAsset({
          prompt: `${app.name} environment`,
          type: 'environment',
          style: 'ece-brand',
          complexity: 'ultra',
          format: 'gltf'
        })
      ],
      ui: [
        this.generateDemo3DAsset({
          prompt: `${app.name} UI`,
          type: 'object',
          style: 'minimalist',
          complexity: 'medium',
          format: 'gltf'
        })
      ],
      interactive: [
        this.generateDemo3DAsset({
          prompt: `${app.name} interactive`,
          type: 'object',
          style: 'stylized',
          complexity: 'high',
          format: 'gltf'
        })
      ],
      characters: [
        this.generateDemo3DAsset({
          prompt: `${app.name} character`,
          type: 'character',
          style: 'stylized',
          complexity: 'high',
          format: 'gltf'
        })
      ]
    }
  }

  /**
   * Generate Three.js configuration
   */
  private generateThreeJSConfig(request: ThreeDGenerationRequest): any {
    const configs = {
      model: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        lighting: { type: 'directional', intensity: 1 },
        camera: { position: [0, 0, 5], fov: 75 }
      },
      scene: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        lighting: { type: 'ambient', intensity: 0.6 },
        camera: { position: [0, 2, 8], fov: 60 }
      },
      environment: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [2, 2, 2],
        lighting: { type: 'hemisphere', intensity: 0.8 },
        camera: { position: [0, 5, 10], fov: 75 }
      },
      character: {
        position: [0, -1, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        lighting: { type: 'point', intensity: 1.2 },
        camera: { position: [0, 1, 3], fov: 75 }
      },
      object: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        lighting: { type: 'directional', intensity: 0.8 },
        camera: { position: [2, 2, 2], fov: 75 }
      }
    }

    return configs[request.type] || configs.model
  }

  /**
   * Helper methods
   */
  private generateAssetName(request: ThreeDGenerationRequest): string {
    return `${request.type}_${request.style}_${Date.now()}`
  }

  private getDemoModelUrl(request: ThreeDGenerationRequest): string {
    return `https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf`
  }

  private getDemoTextureUrl(): string {
    return `https://threejs.org/examples/textures/uv_grid_opengl.jpg`
  }

  private getDemoPreviewUrl(): string {
    return `https://picsum.photos/512/512?random=${Math.random()}`
  }

  private getDemoAnimationUrl(): string {
    return `https://threejs.org/examples/models/gltf/Horse.glb`
  }

  private getComplexityVertices(complexity: string): number {
    const vertexCounts = { low: 1000, medium: 5000, high: 20000, ultra: 100000 }
    return vertexCounts[complexity] || 5000
  }

  private getComplexityFaces(complexity: string): number {
    const faceCounts = { low: 500, medium: 2500, high: 10000, ultra: 50000 }
    return faceCounts[complexity] || 2500
  }

  private getComplexityFileSize(complexity: string): number {
    const fileSizes = { low: 100000, medium: 500000, high: 2000000, ultra: 10000000 }
    return fileSizes[complexity] || 500000
  }
}

export const ai3DGenerator = new AI3DGenerator()
