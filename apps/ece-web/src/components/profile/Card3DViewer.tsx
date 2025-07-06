'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Play,
  Pause,
  RotateCw,
  Eye,
  Download,
  Share2,
  Settings,
  Lightbulb,
  Camera,
  RefreshCw,
  Loader,
  AlertTriangle
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

interface Card3DViewerProps {
  cardId: string
  cardName: string
  cardTier: string
  cardImage: string
  className?: string
}

interface ViewerControls {
  rotationSpeed: number
  autoRotate: boolean
  zoomLevel: number
  lightIntensity: number
  showEffects: boolean
  renderQuality: 'low' | 'medium' | 'high'
}

export function Card3DViewer({ 
  cardId, 
  cardName, 
  cardTier, 
  cardImage, 
  className = '' 
}: Card3DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isInteracting, setIsInteracting] = useState(false)
  
  const [controls, setControls] = useState<ViewerControls>({
    rotationSpeed: 0.5,
    autoRotate: true,
    zoomLevel: 1,
    lightIntensity: 1,
    showEffects: true,
    renderQuality: 'medium'
  })

  // Check WebGL support
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null)
  
  useEffect(() => {
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        setWebGLSupported(!!gl)
      } catch (e) {
        setWebGLSupported(false)
      }
    }
    checkWebGL()
  }, [])

  // Simulate 3D scene initialization (In real app, this would use Three.js)
  useEffect(() => {
    if (!webGLSupported || !canvasRef.current) return

    setIsLoading(true)
    
    // Simulate loading time
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(loadingTimer)
  }, [webGLSupported, cardId])

  const getTierEffects = (tier: string) => {
    switch (tier) {
      case 'mythic':
        return {
          particleCount: 100,
          glowIntensity: 2.0,
          effects: ['cosmic', 'prismatic', 'reality-distortion'],
          animation: 'floating'
        }
      case 'legendary':
        return {
          particleCount: 50,
          glowIntensity: 1.5,
          effects: ['golden-aura', 'crown', 'majestic-glow'],
          animation: 'gentle-rotation'
        }
      case 'epic':
        return {
          particleCount: 25,
          glowIntensity: 1.2,
          effects: ['flame', 'pulsing', 'color-shift'],
          animation: 'flame-dance'
        }
      case 'rare':
        return {
          particleCount: 15,
          glowIntensity: 1.0,
          effects: ['electric', 'animated-border'],
          animation: 'electric-pulse'
        }
      default:
        return {
          particleCount: 5,
          glowIntensity: 0.5,
          effects: ['basic-glow'],
          animation: 'subtle-hover'
        }
    }
  }

  const handleRotationChange = (value: number[]) => {
    setControls(prev => ({ ...prev, rotationSpeed: value[0] }))
  }

  const handleZoomChange = (value: number[]) => {
    setControls(prev => ({ ...prev, zoomLevel: value[0] }))
  }

  const handleLightingChange = (value: number[]) => {
    setControls(prev => ({ ...prev, lightIntensity: value[0] }))
  }

  const resetView = () => {
    setControls(prev => ({
      ...prev,
      rotationSpeed: 0.5,
      zoomLevel: 1,
      lightIntensity: 1
    }))
  }

  const exportView = () => {
    if (!canvasRef.current) return
    
    // In a real app, this would export the current 3D view
    const dataURL = canvasRef.current.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `${cardName}-3d-view.png`
    link.href = dataURL
    link.click()
  }

  const shareView = () => {
    if (navigator.share) {
      navigator.share({
        title: `${cardName} - 3D View`,
        text: `Check out my ${cardTier} card in 3D!`,
        url: window.location.href
      })
    }
  }

  if (webGLSupported === false) {
    return (
      <GlassCard variant="dark" className={`p-6 ${className}`}>
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-[#F92672] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#F8EFD6] mb-2">
            WebGL Not Supported
          </h3>
          <p className="text-[#75715E] mb-4">
            Your browser doesn't support 3D rendering. Please use a modern browser with WebGL support.
          </p>
          <div className="aspect-video bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 rounded-lg flex items-center justify-center border border-[#75715E]/30">
            <img 
              src={cardImage} 
              alt={cardName}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <div className={className}>
      <GlassCard variant="dark" className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#F8EFD6] mb-1">{cardName}</h3>
            <p className="text-[#75715E] capitalize">{cardTier} Card - 3D View</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetView}
              className="text-[#66D9EF]"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={exportView}
              className="text-[#A6E22E]"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={shareView}
              className="text-[#E6DB74]"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-[#F92672]"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* 3D Viewer */}
        <div className="relative">
          <div className={`relative ${isFullscreen ? 'h-96' : 'h-64'} bg-gradient-to-br from-[#272822]/80 to-[#272822]/60 rounded-lg border border-[#75715E]/30 overflow-hidden`}>
            {/* Loading State */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#272822]/90">
                <div className="text-center">
                  <Loader className="w-8 h-8 text-[#A6E22E] animate-spin mx-auto mb-2" />
                  <p className="text-sm text-[#75715E]">Loading 3D model...</p>
                </div>
              </div>
            )}

            {/* 3D Canvas */}
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              onMouseEnter={() => setIsInteracting(true)}
              onMouseLeave={() => setIsInteracting(false)}
            />

            {/* Fallback Image (for demonstration) */}
            {!isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <img 
                    src={cardImage} 
                    alt={cardName}
                    className="max-w-full max-h-full object-contain rounded-lg transform transition-transform duration-300 hover:scale-105"
                    style={{
                      filter: `brightness(${controls.lightIntensity}) contrast(${controls.zoomLevel})`,
                      transform: `scale(${controls.zoomLevel})`
                    }}
                  />
                  {controls.showEffects && (
                    <div className="absolute inset-0 rounded-lg animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  )}
                </div>
              </div>
            )}

            {/* Interaction Overlay */}
            <div className="absolute top-4 left-4">
              <div className="flex items-center space-x-2 text-xs text-[#75715E] bg-[#272822]/80 px-2 py-1 rounded">
                <Eye className="w-3 h-3" />
                <span>Click and drag to rotate</span>
              </div>
            </div>

            {/* Effects Indicator */}
            {controls.showEffects && (
              <div className="absolute bottom-4 right-4">
                <div className="flex items-center space-x-1 text-xs text-[#A6E22E] bg-[#272822]/80 px-2 py-1 rounded">
                  <span className="w-2 h-2 bg-[#A6E22E] rounded-full animate-pulse" />
                  <span>Effects Active</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 space-y-4">
          {/* Auto Rotation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RotateCcw className="w-4 h-4 text-[#66D9EF]" />
              <span className="text-sm font-medium text-[#F8EFD6]">Auto Rotate</span>
            </div>
            <Button
              variant={controls.autoRotate ? "accent" : "ghost"}
              size="sm"
              onClick={() => setControls(prev => ({ ...prev, autoRotate: !prev.autoRotate }))}
            >
              {controls.autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </div>

          {/* Rotation Speed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#F8EFD6]">Rotation Speed</span>
              <span className="text-sm text-[#75715E]">{controls.rotationSpeed.toFixed(1)}x</span>
            </div>
            <Slider
              value={[controls.rotationSpeed]}
              onValueChange={handleRotationChange}
              min={0}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Zoom Level */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#F8EFD6]">Zoom Level</span>
              <span className="text-sm text-[#75715E]">{(controls.zoomLevel * 100).toFixed(0)}%</span>
            </div>
            <Slider
              value={[controls.zoomLevel]}
              onValueChange={handleZoomChange}
              min={0.5}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Lighting */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#F8EFD6]">Light Intensity</span>
              <span className="text-sm text-[#75715E]">{(controls.lightIntensity * 100).toFixed(0)}%</span>
            </div>
            <Slider
              value={[controls.lightIntensity]}
              onValueChange={handleLightingChange}
              min={0.2}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Effects Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-[#E6DB74]" />
              <span className="text-sm font-medium text-[#F8EFD6]">Visual Effects</span>
            </div>
            <Button
              variant={controls.showEffects ? "accent" : "ghost"}
              size="sm"
              onClick={() => setControls(prev => ({ ...prev, showEffects: !prev.showEffects }))}
            >
              {controls.showEffects ? 'On' : 'Off'}
            </Button>
          </div>
        </div>

        {/* Card Info */}
        <div className="mt-6 p-4 bg-[#272822]/30 rounded-lg border border-[#75715E]/20">
          <h4 className="font-semibold text-[#F8EFD6] mb-2">3D Effects for {cardTier} Cards</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {getTierEffects(cardTier).effects.map((effect, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gradient-to-r from-[#A6E22E]/20 to-[#A6E22E]/10 border border-[#A6E22E]/30 text-[#A6E22E] rounded text-center capitalize"
              >
                {effect.replace('-', ' ')}
              </span>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

// 3D Card Gallery Component
interface Card3DGalleryProps {
  cards: Array<{
    id: string
    name: string
    tier: string
    image: string
  }>
  className?: string
}

export function Card3DGallery({ cards, className = '' }: Card3DGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isCarouselMode, setIsCarouselMode] = useState(true)

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length)
  }

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)
  }

  if (cards.length === 0) {
    return (
      <GlassCard variant="dark" className={`p-6 text-center ${className}`}>
        <Camera className="w-16 h-16 text-[#75715E] mx-auto mb-4" />
        <p className="text-[#75715E]">No cards available for 3D viewing</p>
      </GlassCard>
    )
  }

  const currentCard = cards[currentIndex]

  return (
    <div className={className}>
      {/* Gallery Controls */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-[#F8EFD6] mb-1">3D Card Gallery</h3>
          <p className="text-[#75715E]">
            Card {currentIndex + 1} of {cards.length}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevCard}
            disabled={cards.length <= 1}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextCard}
            disabled={cards.length <= 1}
          >
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 3D Viewer */}
      <Card3DViewer
        cardId={currentCard.id}
        cardName={currentCard.name}
        cardTier={currentCard.tier}
        cardImage={currentCard.image}
      />

      {/* Card Selection */}
      {cards.length > 1 && (
        <div className="mt-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {cards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-20 rounded-lg border-2 transition-all ${
                  index === currentIndex
                    ? 'border-[#A6E22E] bg-[#A6E22E]/20'
                    : 'border-[#75715E]/30 hover:border-[#75715E]/60'
                }`}
              >
                <img 
                  src={card.image} 
                  alt={card.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
