'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, AlertTriangle, Settings, Maximize2, RefreshCw } from 'lucide-react'

/**
 * Advanced Spline Integration Manager for ECE Trading Cards
 * 
 * Features:
 * - Hana video service integration for promotional content
 * - Advanced Spline API integration with performance optimization
 * - Hardware-adaptive rendering quality
 * - Real-time performance monitoring
 * - Progressive loading with fallback systems
 * - Cross-platform compatibility optimization
 * - ECE Beach Monokai themed controls
 */

interface SplineScene {
  id: string
  name: string
  url: string
  thumbnail: string
  performance: 'high' | 'medium' | 'low'
  fallbackImage: string
  description: string
  videoPromo?: string // Hana video integration
  interactive: boolean
  preload: boolean
}

interface DeviceCapabilities {
  gpu: 'high' | 'medium' | 'low'
  memory: number
  bandwidth: 'fast' | 'medium' | 'slow'
  mobile: boolean
  webgl: boolean
  webgl2: boolean
}

interface SplinePerformanceMetrics {
  fps: number
  memoryUsage: number
  loadTime: number
  batteryImpact: number
  renderTime: number
}

interface SplineManagerProps {
  sceneId: string
  className?: string
  autoStart?: boolean
  showControls?: boolean
  adaptiveQuality?: boolean
  onLoad?: (scene: SplineScene) => void
  onError?: (error: Error) => void
  onInteraction?: (event: any) => void
  onPerformanceUpdate?: (metrics: SplinePerformanceMetrics) => void
}

// Predefined ECE 3D scenes with Hana video integration
const ECE_SPLINE_SCENES: Record<string, SplineScene> = {
  'hero-trading': {
    id: 'hero-trading',
    name: 'Hero Trading Scene',
    url: 'https://prod.spline.design/ECE-hero-trading.splinecode',
    thumbnail: '/scenes/hero-trading-thumb.jpg',
    performance: 'high',
    fallbackImage: '/scenes/hero-trading-fallback.jpg',
    description: 'Interactive trading card showcase with particle effects',
    videoPromo: 'https://hana.video/ece/hero-trading-promo',
    interactive: true,
    preload: true
  },
  'marketplace-3d': {
    id: 'marketplace-3d',
    name: 'Marketplace 3D Environment',
    url: 'https://prod.spline.design/ECE-marketplace.splinecode',
    thumbnail: '/scenes/marketplace-thumb.jpg',
    performance: 'medium',
    fallbackImage: '/scenes/marketplace-fallback.jpg',
    description: 'Virtual marketplace with floating card displays',
    videoPromo: 'https://hana.video/ece/marketplace-tour',
    interactive: true,
    preload: false
  },
  'card-showcase': {
    id: 'card-showcase',
    name: 'Card Showcase Experience',
    url: 'https://prod.spline.design/ECE-card-showcase.splinecode',
    thumbnail: '/scenes/showcase-thumb.jpg',
    performance: 'medium',
    fallbackImage: '/scenes/showcase-fallback.jpg',
    description: 'Individual card presentation with detailed animations',
    interactive: true,
    preload: false
  },
  'ocean-ambient': {
    id: 'ocean-ambient',
    name: 'Ocean Ambient Background',
    url: 'https://prod.spline.design/ECE-ocean-ambient.splinecode',
    thumbnail: '/scenes/ocean-thumb.jpg',
    performance: 'low',
    fallbackImage: '/scenes/ocean-fallback.jpg',
    description: 'Calming ocean waves background for Beach Monokai theme',
    videoPromo: 'https://hana.video/ece/ocean-ambience',
    interactive: false,
    preload: true
  }
}

export default function AdvancedSplineManager({
  sceneId,
  className = '',
  autoStart = true,
  showControls = true,
  adaptiveQuality = true,
  onLoad,
  onError,
  onInteraction,
  onPerformanceUpdate
}: SplineManagerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentScene, setCurrentScene] = useState<SplineScene | null>(null)
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities | null>(null)
  const [performanceMetrics, setPerformanceMetrics] = useState<SplinePerformanceMetrics | null>(null)
  const [qualityLevel, setQualityLevel] = useState<'high' | 'medium' | 'low'>('medium')
  const [splineInstance, setSplineInstance] = useState<any>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showVideoPromo, setShowVideoPromo] = useState(false)

  // Device capability detection
  const detectDeviceCapabilities = useCallback((): DeviceCapabilities => {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    const gl2 = canvas.getContext('webgl2')
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    // GPU capability detection
    let gpuLevel: 'high' | 'medium' | 'low' = 'medium'
    if (gl && gl instanceof WebGLRenderingContext) {
      const webglContext = gl as WebGLRenderingContext
      const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        const renderer = webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        if (renderer.includes('NVIDIA') || renderer.includes('AMD Radeon')) {
          gpuLevel = 'high'
        } else if (renderer.includes('Intel')) {
          gpuLevel = 'medium'
        } else {
          gpuLevel = 'low'
        }
      }
    }

    // Memory estimation
    const memory = (navigator as any).deviceMemory || 4 // GB, fallback to 4GB

    // Network speed detection
    const connection = (navigator as any).connection
    let bandwidth: 'fast' | 'medium' | 'slow' = 'medium'
    if (connection) {
      if (connection.effectiveType === '4g' || connection.downlink > 10) {
        bandwidth = 'fast'
      } else if (connection.effectiveType === '3g' || connection.downlink > 1) {
        bandwidth = 'medium'
      } else {
        bandwidth = 'slow'
      }
    }

    return {
      gpu: gpuLevel,
      memory,
      bandwidth,
      mobile: isMobile,
      webgl: !!gl,
      webgl2: !!gl2
    }
  }, [])

  // Adaptive quality selection
  const selectOptimalQuality = useCallback((capabilities: DeviceCapabilities, scene: SplineScene): 'high' | 'medium' | 'low' => {
    if (!adaptiveQuality) return scene.performance

    let score = 0
    
    // GPU scoring
    if (capabilities.gpu === 'high') score += 3
    else if (capabilities.gpu === 'medium') score += 2
    else score += 1

    // Memory scoring
    if (capabilities.memory >= 8) score += 2
    else if (capabilities.memory >= 4) score += 1

    // Network scoring
    if (capabilities.bandwidth === 'fast') score += 2
    else if (capabilities.bandwidth === 'medium') score += 1

    // Mobile penalty
    if (capabilities.mobile) score -= 2

    // WebGL2 bonus
    if (capabilities.webgl2) score += 1

    if (score >= 7) return 'high'
    else if (score >= 4) return 'medium'
    else return 'low'
  }, [adaptiveQuality])

  // Performance monitoring
  const monitorPerformance = useCallback(() => {
    if (!splineInstance) return

    const startTime = performance.now()
    let frameCount = 0
    let lastTime = startTime

    const measurePerformance = () => {
      frameCount++
      const currentTime = performance.now()
      const deltaTime = currentTime - lastTime

      if (deltaTime >= 1000) { // Update every second
        const fps = Math.round((frameCount * 1000) / deltaTime)
        const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0
        const loadTime = currentTime - startTime
        
        const metrics: SplinePerformanceMetrics = {
          fps,
          memoryUsage: memoryUsage / (1024 * 1024), // MB
          loadTime,
          batteryImpact: fps < 30 ? (60 - fps) * 0.5 : 0, // Estimated battery impact
          renderTime: deltaTime / frameCount
        }

        setPerformanceMetrics(metrics)
        onPerformanceUpdate?.(metrics)

        frameCount = 0
        lastTime = currentTime
      }

      requestAnimationFrame(measurePerformance)
    }

    measurePerformance()
  }, [splineInstance, onPerformanceUpdate])

  // Spline scene loading with error handling
  const loadSplineScene = useCallback(async (scene: SplineScene, quality: 'high' | 'medium' | 'low') => {
    try {
      setIsLoading(true)
      setHasError(false)

      // Dynamic import of Spline
      const { Application } = await import('@splinetool/runtime')
      
      const canvas = document.getElementById(`spline-${scene.id}`) as HTMLCanvasElement
      if (!canvas) throw new Error('Canvas element not found')

      // Quality-based configuration
      const config = {
        high: { pixelRatio: window.devicePixelRatio, antialias: true },
        medium: { pixelRatio: Math.min(window.devicePixelRatio, 2), antialias: true },
        low: { pixelRatio: 1, antialias: false }
      }

      const app = new Application(canvas)
      await app.load(scene.url)

      // Set up interaction handlers
      if (scene.interactive) {
        app.addEventListener('mouseDown', (event: any) => {
          onInteraction?.(event)
        })
      }

      setSplineInstance(app)
      setCurrentScene(scene)
      onLoad?.(scene)
      
      // Start performance monitoring
      setTimeout(monitorPerformance, 1000)

    } catch (error) {
      console.error('Spline loading error:', error)
      setHasError(true)
      onError?.(error as Error)
    } finally {
      setIsLoading(false)
    }
  }, [onLoad, onError, onInteraction, monitorPerformance])

  // Initialize scene
  useEffect(() => {
    const capabilities = detectDeviceCapabilities()
    setDeviceCapabilities(capabilities)

    const scene = ECE_SPLINE_SCENES[sceneId]
    if (!scene) {
      setHasError(true)
      onError?.(new Error(`Scene ${sceneId} not found`))
      return
    }

    const optimalQuality = selectOptimalQuality(capabilities, scene)
    setQualityLevel(optimalQuality)

    if (autoStart) {
      loadSplineScene(scene, optimalQuality)
    }
  }, [sceneId, autoStart, detectDeviceCapabilities, selectOptimalQuality, loadSplineScene, onError])

  // Manual refresh
  const handleRefresh = useCallback(() => {
    if (currentScene && deviceCapabilities) {
      const newQuality = selectOptimalQuality(deviceCapabilities, currentScene)
      setQualityLevel(newQuality)
      loadSplineScene(currentScene, newQuality)
    }
  }, [currentScene, deviceCapabilities, selectOptimalQuality, loadSplineScene])

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    const container = document.getElementById(`spline-container-${sceneId}`)
    if (!container) return

    if (!isFullscreen) {
      container.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }, [sceneId, isFullscreen])

  // Video promo modal
  const VideoPromoModal = useMemo(() => {
    if (!showVideoPromo || !currentScene?.videoPromo) return null

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setShowVideoPromo(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-[#272822] rounded-2xl p-6 max-w-4xl w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#F8EFD6]">{currentScene.name} - Video Preview</h3>
              <button
                onClick={() => setShowVideoPromo(false)}
                className="text-[#75715E] hover:text-[#F8EFD6] transition-colors"
              >
                ✕
              </button>
            </div>
            <video
              src={currentScene.videoPromo}
              controls
              autoPlay
              className="w-full rounded-lg"
              poster={currentScene.thumbnail}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }, [showVideoPromo, currentScene])

  // Error fallback
  if (hasError) {
    return (
      <div className={`relative rounded-2xl overflow-hidden ${className}`}>
        <img
          src={ECE_SPLINE_SCENES[sceneId]?.fallbackImage || '/images/3d-fallback.jpg'}
          alt="3D Scene Fallback"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center p-6">
            <AlertTriangle className="w-12 h-12 text-[#F92672] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#F8EFD6] mb-2">3D Scene Unavailable</h3>
            <p className="text-[#75715E] mb-4">Displaying fallback image instead</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-[#66D9EF] text-[#272822] rounded-lg hover:bg-[#819AFF] transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2 inline" />
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      id={`spline-container-${sceneId}`}
      className={`relative rounded-2xl overflow-hidden ${className}`}
    >
      {/* Spline Canvas */}
      <canvas
        id={`spline-${sceneId}`}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />

      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#272822]/80 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-[#66D9EF] animate-spin mx-auto mb-4" />
              <p className="text-[#F8EFD6] font-medium">Loading 3D Scene...</p>
              <p className="text-[#75715E] text-sm mt-1">Quality: {qualityLevel}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      {showControls && !isLoading && !hasError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 right-4 flex space-x-2"
        >
          {currentScene?.videoPromo && (
            <button
              onClick={() => setShowVideoPromo(true)}
              className="p-2 bg-[#F92672]/20 backdrop-blur-md rounded-lg border border-[#F92672]/30 text-[#F92672] hover:bg-[#F92672]/30 transition-colors"
              title="Watch Video Preview"
            >
              ▶
            </button>
          )}
          
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-[#66D9EF]/20 backdrop-blur-md rounded-lg border border-[#66D9EF]/30 text-[#66D9EF] hover:bg-[#66D9EF]/30 transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleRefresh}
            className="p-2 bg-[#A6E22E]/20 backdrop-blur-md rounded-lg border border-[#A6E22E]/30 text-[#A6E22E] hover:bg-[#A6E22E]/30 transition-colors"
            title="Refresh Scene"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Performance Metrics (Development Mode) */}
      {process.env.NODE_ENV === 'development' && performanceMetrics && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 left-4 bg-black/50 backdrop-blur-md rounded-lg p-3 text-xs text-[#F8EFD6]"
        >
          <div>FPS: {performanceMetrics.fps}</div>
          <div>Memory: {performanceMetrics.memoryUsage.toFixed(1)}MB</div>
          <div>Quality: {qualityLevel}</div>
        </motion.div>
      )}

      {/* Video Promo Modal */}
      {VideoPromoModal}
    </div>
  )
}
