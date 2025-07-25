/**
 * Enhanced Aesthetic Service
 * Teal wave integration with Beach Monokai theme
 */

export interface TealWaveConfig {
  primaryTeal: string
  waveGradient: string[]
  oceanDepth: string[]
  foamWhite: string
  sunsetAccent: string
  intensity: 'subtle' | 'medium' | 'bold'
  animationSpeed: 'slow' | 'medium' | 'fast'
}

export interface BeachMonokaiPalette {
  accent: string       // #F92672
  success: string      // #A6E22E  
  info: string         // #66D9EF
  secondary: string    // #E6DB74
  light: string        // #F8EFD6
  dark: string         // #272822
  primary: string      // #819AFF
  green: string        // #3EBA7C
  muted: string        // #75715E
  alert: string        // #FD5C63
}

export interface EnhancedTheme {
  beachMonokai: BeachMonokaiPalette
  tealWave: TealWaveConfig
  glassmorphism: {
    backdrop: string
    border: string
    shadow: string
    opacity: number
  }
  animations: {
    wave: string
    ripple: string
    flow: string
    breathe: string
  }
}

export interface AestheticAsset {
  type: 'gradient' | 'pattern' | 'texture' | 'animation' | 'shader'
  name: string
  css: string
  svg?: string
  splineConfig?: any
  usage: string[]
  platforms: string[]
}

export class EnhancedAestheticService {
  private theme: EnhancedTheme
  private generatedAssets: AestheticAsset[] = []

  constructor() {
    this.theme = this.initializeTheme()
  }

  /**
   * Generate complete aesthetic package for ECE apps
   */
  async generateAestheticPackage(
    appType: 'web' | 'mobile' | 'desktop',
    intensity: 'subtle' | 'medium' | 'bold' = 'medium'
  ): Promise<{
    theme: EnhancedTheme
    assets: AestheticAsset[]
    cssVariables: Record<string, string>
    animations: Record<string, string>
    splineConfigs: any[]
  }> {
    console.log(`🎨 Generating enhanced aesthetic package (${intensity} intensity)...`)

    // Update theme intensity
    this.updateThemeIntensity(intensity)

    // Generate aesthetic assets
    const assets = await this.generateAestheticAssets(appType, intensity)
    
    // Create CSS variables
    const cssVariables = this.generateCSSVariables()
    
    // Generate animations
    const animations = this.generateAnimations(intensity)
    
    // Create Spline configurations
    const splineConfigs = this.generateSplineConfigs(intensity)

    this.generatedAssets = assets

    return {
      theme: this.theme,
      assets,
      cssVariables,
      animations,
      splineConfigs
    }
  }

  /**
   * Generate teal wave gradients
   */
  generateTealWaveGradients(): AestheticAsset[] {
    const gradients: AestheticAsset[] = [
      {
        type: 'gradient',
        name: 'teal-wave-primary',
        css: `linear-gradient(135deg, 
          ${this.theme.tealWave.primaryTeal} 0%, 
          ${this.theme.tealWave.waveGradient[0]} 25%, 
          ${this.theme.tealWave.waveGradient[1]} 50%, 
          ${this.theme.tealWave.waveGradient[2]} 75%, 
          ${this.theme.tealWave.foamWhite} 100%)`,
        usage: ['hero-backgrounds', 'card-headers', 'navigation'],
        platforms: ['web', 'mobile', 'desktop']
      },
      {
        type: 'gradient',
        name: 'ocean-depth',
        css: `radial-gradient(ellipse at center, 
          ${this.theme.tealWave.oceanDepth[0]} 0%, 
          ${this.theme.tealWave.oceanDepth[1]} 70%, 
          ${this.theme.beachMonokai.dark} 100%)`,
        usage: ['page-backgrounds', 'modal-overlays', 'section-dividers'],
        platforms: ['web', 'desktop']
      },
      {
        type: 'gradient',
        name: 'sunset-wave',
        css: `linear-gradient(45deg, 
          ${this.theme.tealWave.sunsetAccent} 0%, 
          ${this.theme.beachMonokai.accent} 30%, 
          ${this.theme.tealWave.primaryTeal} 70%, 
          ${this.theme.tealWave.foamWhite} 100%)`,
        usage: ['accent-elements', 'buttons', 'highlights'],
        platforms: ['web', 'mobile', 'desktop']
      },
      {
        type: 'gradient',
        name: 'teal-glassmorphism',
        css: `linear-gradient(135deg, 
          rgba(32, 178, 170, 0.1) 0%, 
          rgba(0, 206, 209, 0.05) 50%, 
          rgba(72, 209, 204, 0.1) 100%)`,
        usage: ['glass-cards', 'overlays', 'floating-elements'],
        platforms: ['web', 'mobile', 'desktop']
      }
    ]

    return gradients
  }

  /**
   * Generate wave patterns and textures
   */
  generateWavePatterns(): AestheticAsset[] {
    const patterns: AestheticAsset[] = [
      {
        type: 'pattern',
        name: 'teal-wave-pattern',
        css: `
          background-image: 
            radial-gradient(circle at 25% 25%, ${this.theme.tealWave.waveGradient[0]} 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, ${this.theme.tealWave.waveGradient[1]} 0%, transparent 50%),
            linear-gradient(90deg, ${this.theme.tealWave.primaryTeal}22 0%, transparent 100%);
          background-size: 200px 200px, 180px 180px, 100% 2px;
          background-position: 0 0, 40px 40px, 0 0;
        `,
        svg: this.generateWaveSVG('teal-wave'),
        usage: ['backgrounds', 'decorative-elements', 'dividers'],
        platforms: ['web', 'mobile', 'desktop']
      },
      {
        type: 'texture',
        name: 'ocean-texture',
        css: `
          background: 
            radial-gradient(ellipse farthest-corner at 45px 45px, 
              ${this.theme.tealWave.waveGradient[0]} 0%, 
              rgba(0,0,0,0) 50%, 
              ${this.theme.tealWave.waveGradient[1]} 95%),
            radial-gradient(ellipse farthest-corner at 90px 90px, 
              ${this.theme.tealWave.waveGradient[2]} 0%, 
              rgba(0,0,0,0) 50%, 
              ${this.theme.tealWave.primaryTeal} 95%);
          background-size: 100px 100px;
          background-position: 0 0, 50px 50px;
        `,
        usage: ['subtle-backgrounds', 'card-textures', 'section-fills'],
        platforms: ['web', 'desktop']
      }
    ]

    return patterns
  }

  /**
   * Generate enhanced animations
   */
  generateEnhancedAnimations(intensity: string): AestheticAsset[] {
    const speed = this.getAnimationSpeed(intensity)
    
    const animations: AestheticAsset[] = [
      {
        type: 'animation',
        name: 'teal-wave-flow',
        css: `
          @keyframes teal-wave-flow {
            0% { 
              background-position: 0% 50%; 
              filter: hue-rotate(0deg);
            }
            25% { 
              background-position: 25% 40%; 
              filter: hue-rotate(90deg);
            }
            50% { 
              background-position: 100% 50%; 
              filter: hue-rotate(180deg);
            }
            75% { 
              background-position: 75% 60%; 
              filter: hue-rotate(270deg);
            }
            100% { 
              background-position: 0% 50%; 
              filter: hue-rotate(360deg);
            }
          }
          
          .teal-wave-flow {
            animation: teal-wave-flow ${speed}s ease-in-out infinite;
            background: linear-gradient(
              -45deg, 
              ${this.theme.tealWave.waveGradient.join(', ')}
            );
            background-size: 400% 400%;
          }
        `,
        usage: ['hero-sections', 'loading-states', 'interactive-elements'],
        platforms: ['web', 'mobile', 'desktop']
      },
      {
        type: 'animation',
        name: 'ocean-ripple',
        css: `
          @keyframes ocean-ripple {
            0% { 
              transform: scale(1); 
              opacity: 1; 
              box-shadow: 0 0 0 0 ${this.theme.tealWave.primaryTeal}66;
            }
            70% { 
              transform: scale(1.1); 
              opacity: 0.7; 
              box-shadow: 0 0 0 20px transparent;
            }
            100% { 
              transform: scale(1); 
              opacity: 1; 
              box-shadow: 0 0 0 0 transparent;
            }
          }
          
          .ocean-ripple {
            animation: ocean-ripple ${speed * 0.8}s ease-out infinite;
          }
          
          .ocean-ripple:hover {
            animation-duration: ${speed * 0.4}s;
          }
        `,
        usage: ['buttons', 'interactive-cards', 'hover-effects'],
        platforms: ['web', 'desktop']
      },
      {
        type: 'animation',
        name: 'wave-breathe',
        css: `
          @keyframes wave-breathe {
            0%, 100% { 
              transform: scale(1) rotate(0deg); 
              filter: brightness(1);
            }
            25% { 
              transform: scale(1.02) rotate(1deg); 
              filter: brightness(1.1);
            }
            50% { 
              transform: scale(1.05) rotate(0deg); 
              filter: brightness(1.2);
            }
            75% { 
              transform: scale(1.02) rotate(-1deg); 
              filter: brightness(1.1);
            }
          }
          
          .wave-breathe {
            animation: wave-breathe ${speed * 2}s ease-in-out infinite;
          }
        `,
        usage: ['ambient-elements', 'background-graphics', '3d-scenes'],
        platforms: ['web', 'mobile', 'desktop']
      }
    ]

    return animations
  }

  /**
   * Generate CSS variables for the enhanced theme
   */
  generateCSSVariables(): Record<string, string> {
    return {
      // Beach Monokai variables
      '--bm-accent': this.theme.beachMonokai.accent,
      '--bm-success': this.theme.beachMonokai.success,
      '--bm-info': this.theme.beachMonokai.info,
      '--bm-secondary': this.theme.beachMonokai.secondary,
      '--bm-light': this.theme.beachMonokai.light,
      '--bm-dark': this.theme.beachMonokai.dark,
      '--bm-primary': this.theme.beachMonokai.primary,
      '--bm-green': this.theme.beachMonokai.green,
      '--bm-muted': this.theme.beachMonokai.muted,
      '--bm-alert': this.theme.beachMonokai.alert,

      // Teal Wave variables
      '--tw-primary': this.theme.tealWave.primaryTeal,
      '--tw-gradient-1': this.theme.tealWave.waveGradient[0],
      '--tw-gradient-2': this.theme.tealWave.waveGradient[1],
      '--tw-gradient-3': this.theme.tealWave.waveGradient[2],
      '--tw-ocean-1': this.theme.tealWave.oceanDepth[0],
      '--tw-ocean-2': this.theme.tealWave.oceanDepth[1],
      '--tw-foam': this.theme.tealWave.foamWhite,
      '--tw-sunset': this.theme.tealWave.sunsetAccent,

      // Glassmorphism variables
      '--glass-backdrop': this.theme.glassmorphism.backdrop,
      '--glass-border': this.theme.glassmorphism.border,
      '--glass-shadow': this.theme.glassmorphism.shadow,
      '--glass-opacity': this.theme.glassmorphism.opacity.toString(),

      // Animation variables
      '--anim-wave': this.theme.animations.wave,
      '--anim-ripple': this.theme.animations.ripple,
      '--anim-flow': this.theme.animations.flow,
      '--anim-breathe': this.theme.animations.breathe
    }
  }

  /**
   * Generate Spline 3D configurations
   */
  generateSplineConfigs(intensity: string): any[] {
    const configs = [
      {
        name: 'ece-parallax-path-enhanced',
        url: 'https://my.spline.design/eceparallaxpath-R7tEBQLwK8tlOKZWIglFU75G/',
        config: {
          camera: {
            movement: intensity === 'bold' ? 'dynamic' : 'smooth',
            fov: intensity === 'bold' ? 75 : 60
          },
          lighting: {
            ambient: this.theme.tealWave.primaryTeal,
            directional: this.theme.beachMonokai.accent,
            intensity: intensity === 'bold' ? 1.2 : 0.8
          },
          materials: {
            wave: {
              color: this.theme.tealWave.waveGradient[0],
              metalness: 0.1,
              roughness: 0.8,
              emissive: this.theme.tealWave.waveGradient[1]
            },
            foam: {
              color: this.theme.tealWave.foamWhite,
              opacity: 0.7,
              transmission: 0.9
            }
          },
          animation: {
            wave: {
              amplitude: intensity === 'bold' ? 2.0 : 1.0,
              frequency: intensity === 'fast' ? 1.5 : 1.0,
              speed: this.getAnimationSpeed(intensity) / 10
            }
          }
        }
      },
      {
        name: 'ece-cross-icon-enhanced',
        url: 'https://my.spline.design/ececrossicon-TpuUOtOV9JbVqLuctxAHqEED/',
        config: {
          materials: {
            primary: this.theme.beachMonokai.accent,
            secondary: this.theme.tealWave.primaryTeal,
            highlight: this.theme.tealWave.sunsetAccent
          },
          interaction: {
            hover: {
              scale: 1.1,
              rotation: 15,
              color: this.theme.tealWave.waveGradient[2]
            },
            click: {
              scale: 0.95,
              duration: 0.1
            }
          }
        }
      },
      {
        name: 'ece-flat-wave-enhanced',
        url: 'https://my.spline.design/eceflatwave-Y69u366c7TIynMdbjBBiXNwA/',
        config: {
          wave: {
            height: intensity === 'bold' ? 50 : 30,
            frequency: 2.0,
            speed: this.getAnimationSpeed(intensity) / 5,
            color: {
              base: this.theme.tealWave.primaryTeal,
              peak: this.theme.tealWave.foamWhite,
              trough: this.theme.tealWave.oceanDepth[1]
            }
          },
          environment: {
            background: this.theme.beachMonokai.dark,
            fog: {
              color: this.theme.tealWave.waveGradient[0],
              density: 0.05
            }
          }
        }
      }
    ]

    return configs
  }

  /**
   * Get complete enhanced theme
   */
  getEnhancedTheme(): EnhancedTheme {
    return this.theme
  }

  /**
   * Generate aesthetic assets for specific use cases
   */
  async generateAestheticAssets(
    appType: string, 
    intensity: string
  ): Promise<AestheticAsset[]> {
    const assets: AestheticAsset[] = []

    // Add gradients
    assets.push(...this.generateTealWaveGradients())
    
    // Add patterns
    assets.push(...this.generateWavePatterns())
    
    // Add animations
    assets.push(...this.generateEnhancedAnimations(intensity))

    // Add platform-specific assets
    if (appType === 'mobile') {
      assets.push(...this.generateMobileSpecificAssets())
    }

    return assets
  }

  // Private helper methods
  private initializeTheme(): EnhancedTheme {
    return {
      beachMonokai: {
        accent: '#F92672',
        success: '#A6E22E',
        info: '#66D9EF',
        secondary: '#E6DB74',
        light: '#F8EFD6',
        dark: '#272822',
        primary: '#819AFF',
        green: '#3EBA7C',
        muted: '#75715E',
        alert: '#FD5C63'
      },
      tealWave: {
        primaryTeal: '#008B8B',
        waveGradient: ['#20B2AA', '#00CED1', '#48D1CC'],
        oceanDepth: ['#006666', '#004D4D'],
        foamWhite: '#F0FFFF',
        sunsetAccent: '#FF6347',
        intensity: 'medium',
        animationSpeed: 'medium'
      },
      glassmorphism: {
        backdrop: 'backdrop-blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        shadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
        opacity: 0.1
      },
      animations: {
        wave: '3s ease-in-out infinite',
        ripple: '1s ease-out',
        flow: '8s linear infinite',
        breathe: '4s ease-in-out infinite'
      }
    }
  }

  private updateThemeIntensity(intensity: string): void {
    this.theme.tealWave.intensity = intensity as any
    
    // Adjust colors based on intensity
    if (intensity === 'bold') {
      this.theme.glassmorphism.opacity = 0.15
      this.theme.tealWave.animationSpeed = 'fast'
    } else if (intensity === 'subtle') {
      this.theme.glassmorphism.opacity = 0.05
      this.theme.tealWave.animationSpeed = 'slow'
    }
  }

  private getAnimationSpeed(intensity: string): number {
    const speeds = { slow: 6, medium: 3, fast: 1.5 }
    return speeds[intensity as keyof typeof speeds] || 3
  }

  private generateWaveSVG(type: string): string {
    return `
      <svg viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${type}-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:${this.theme.tealWave.waveGradient[0]}" />
            <stop offset="50%" style="stop-color:${this.theme.tealWave.waveGradient[1]}" />
            <stop offset="100%" style="stop-color:${this.theme.tealWave.waveGradient[2]}" />
          </linearGradient>
        </defs>
        <path d="M0,40 Q300,10 600,40 T1200,40 L1200,120 L0,120 Z" 
              fill="url(#${type}-gradient)" opacity="0.8"/>
        <path d="M0,60 Q300,30 600,60 T1200,60 L1200,120 L0,120 Z" 
              fill="${this.theme.tealWave.primaryTeal}" opacity="0.6"/>
      </svg>
    `
  }

  private generateAnimations(intensity: string): Record<string, string> {
    const speed = this.getAnimationSpeed(intensity)
    
    return {
      waveFlow: `teal-wave-flow ${speed}s ease-in-out infinite`,
      ripple: `ocean-ripple ${speed * 0.8}s ease-out infinite`,
      breathe: `wave-breathe ${speed * 2}s ease-in-out infinite`,
      float: `float ${speed * 1.5}s ease-in-out infinite alternate`
    }
  }

  private generateMobileSpecificAssets(): AestheticAsset[] {
    return [
      {
        type: 'gradient',
        name: 'mobile-teal-wave',
        css: `linear-gradient(180deg, 
          ${this.theme.tealWave.primaryTeal} 0%, 
          ${this.theme.tealWave.waveGradient[0]} 100%)`,
        usage: ['mobile-headers', 'swipe-indicators', 'progress-bars'],
        platforms: ['mobile']
      }
    ]
  }
}

// Export singleton instance
export const enhancedAestheticService = new EnhancedAestheticService()
