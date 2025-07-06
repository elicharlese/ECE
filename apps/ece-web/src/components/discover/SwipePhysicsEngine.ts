'use client'

import { MotionValue, useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * Advanced physics engine for card swiping with realistic momentum and spring dynamics
 */
export class SwipePhysicsEngine {
  private damping: number
  private stiffness: number
  private mass: number
  private threshold: number
  private velocityThreshold: number

  constructor(config?: {
    damping?: number
    stiffness?: number
    mass?: number
    threshold?: number
    velocityThreshold?: number
  }) {
    this.damping = config?.damping ?? 30
    this.stiffness = config?.stiffness ?? 300
    this.mass = config?.mass ?? 1
    this.threshold = config?.threshold ?? 150
    this.velocityThreshold = config?.velocityThreshold ?? 500
  }

  /**
   * Create motion values for a swipeable card with physics
   */
  createMotionValues() {
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    
    // Spring physics for smooth animations
    const springX = useSpring(x, {
      damping: this.damping,
      stiffness: this.stiffness,
      mass: this.mass
    })
    
    const springY = useSpring(y, {
      damping: this.damping * 0.8, // Less damping for Y to allow natural drop
      stiffness: this.stiffness * 0.6,
      mass: this.mass
    })

    return { x, y, springX, springY }
  }

  /**
   * Calculate rotation based on horizontal position and velocity
   */
  createRotationTransform(x: MotionValue<number>) {
    return useTransform(x, [-300, 0, 300], [-25, 0, 25])
  }

  /**
   * Calculate scale based on distance from center
   */
  createScaleTransform(x: MotionValue<number>, y: MotionValue<number>) {
    return useTransform([x, y], ([xVal, yVal]) => {
      const distance = Math.sqrt(xVal * xVal + yVal * yVal)
      const maxDistance = 300
      const scale = 1 + (distance / maxDistance) * 0.1
      return Math.min(scale, 1.15)
    })
  }

  /**
   * Calculate opacity based on distance from center
   */
  createOpacityTransform(x: MotionValue<number>) {
    return useTransform(x, [-250, -150, 0, 150, 250], [0.3, 0.8, 1, 0.8, 0.3])
  }

  /**
   * Create directional color overlay for swipe feedback
   */
  createColorOverlay(x: MotionValue<number>) {
    const likeColor = 'rgba(166, 226, 46, 0.2)' // monokai-green
    const passColor = 'rgba(249, 38, 114, 0.2)' // monokai-pink
    const neutralColor = 'rgba(255, 255, 255, 0.1)'
    
    return useTransform(
      x,
      [-200, -50, 0, 50, 200],
      [passColor, passColor, neutralColor, likeColor, likeColor]
    )
  }

  /**
   * Determine if swipe should trigger action based on distance and velocity
   */
  shouldTriggerSwipe(offset: { x: number; y: number }, velocity: { x: number; y: number }): {
    shouldSwipe: boolean
    direction: 'left' | 'right' | null
  } {
    const distance = Math.abs(offset.x)
    const velocityMagnitude = Math.abs(velocity.x)
    
    const shouldSwipe = distance > this.threshold || velocityMagnitude > this.velocityThreshold
    
    if (shouldSwipe) {
      return {
        shouldSwipe: true,
        direction: offset.x > 0 ? 'right' : 'left'
      }
    }
    
    return { shouldSwipe: false, direction: null }
  }

  /**
   * Calculate exit animation parameters based on swipe direction and velocity
   */
  calculateExitAnimation(
    direction: 'left' | 'right',
    velocity: { x: number; y: number }
  ): {
    x: number
    y: number
    rotate: number
    opacity: number
    transition: any
  } {
    const exitDistance = window.innerWidth * 1.5
    const x = direction === 'right' ? exitDistance : -exitDistance
    
    // Add some natural downward curve based on velocity
    const y = Math.abs(velocity.y) > 100 ? velocity.y * 0.5 : 50
    
    // More dramatic rotation for faster swipes
    const baseRotation = direction === 'right' ? 30 : -30
    const velocityRotation = Math.min(Math.abs(velocity.x) / 50, 20)
    const rotate = baseRotation + (direction === 'right' ? velocityRotation : -velocityRotation)
    
    return {
      x,
      y,
      rotate,
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for natural feel
      }
    }
  }

  /**
   * Calculate spring back animation when swipe is not completed
   */
  calculateSpringBackAnimation(): {
    x: number
    y: number
    rotate: number
    transition: any
  } {
    return {
      x: 0,
      y: 0,
      rotate: 0,
      transition: {
        type: 'spring',
        damping: this.damping,
        stiffness: this.stiffness * 1.2, // Slightly stiffer for snap back
        mass: this.mass
      }
    }
  }

  /**
   * Create magnetic zones that provide subtle attraction
   */
  createMagneticZones(x: MotionValue<number>) {
    return useTransform(x, (value) => {
      const zones = [
        { center: -150, strength: 0.1, range: 50 }, // Left magnetic zone
        { center: 0, strength: 0.15, range: 80 },   // Center magnetic zone
        { center: 150, strength: 0.1, range: 50 }   // Right magnetic zone
      ]
      
      for (const zone of zones) {
        const distance = Math.abs(value - zone.center)
        if (distance < zone.range) {
          const pull = (zone.range - distance) / zone.range * zone.strength
          return value + (zone.center - value) * pull
        }
      }
      
      return value
    })
  }

  /**
   * Calculate stack displacement for cards behind the active card
   */
  calculateStackDisplacement(index: number, activeCardX: MotionValue<number>) {
    const maxDisplacement = 20
    const displacement = Math.min(index * 8, maxDisplacement)
    
    return useTransform(activeCardX, [-200, 0, 200], [
      -displacement,
      0,
      displacement
    ])
  }

  /**
   * Create subtle parallax effect for background cards
   */
  createParallaxEffect(index: number, activeCardX: MotionValue<number>) {
    const parallaxIntensity = 0.1 * (index + 1)
    
    return useTransform(activeCardX, (value) => value * parallaxIntensity)
  }

  /**
   * Calculate reveal animation for next card as current card is swiped
   */
  createRevealTransform(activeCardX: MotionValue<number>) {
    const scale = useTransform(
      activeCardX,
      [-200, 0, 200],
      [0.95, 0.85, 0.95]
    )
    
    const y = useTransform(
      activeCardX,
      [-200, 0, 200],
      [-5, 10, -5]
    )
    
    return { scale, y }
  }

  /**
   * Advanced gesture detection for complex swipe patterns
   */
  detectGesturePattern(
    history: Array<{ x: number; y: number; timestamp: number }>
  ): 'straight' | 'curve' | 'zigzag' | 'circle' {
    if (history.length < 3) return 'straight'
    
    // Analyze the gesture pattern
    const angles = []
    for (let i = 1; i < history.length; i++) {
      const dx = history[i].x - history[i - 1].x
      const dy = history[i].y - history[i - 1].y
      angles.push(Math.atan2(dy, dx))
    }
    
    // Calculate angle variance
    const avgAngle = angles.reduce((sum, angle) => sum + angle, 0) / angles.length
    const variance = angles.reduce((sum, angle) => sum + Math.pow(angle - avgAngle, 2), 0) / angles.length
    
    if (variance < 0.1) return 'straight'
    if (variance < 0.5) return 'curve'
    return 'zigzag'
  }

  /**
   * Performance optimization: Enable GPU acceleration
   */
  getOptimizedStyles() {
    return {
      transformStyle: 'preserve-3d' as const,
      backfaceVisibility: 'hidden' as const,
      willChange: 'transform, opacity',
    }
  }
}

/**
 * Hook for creating swipe physics engine instance
 */
export function useSwipePhysics(config?: Parameters<typeof SwipePhysicsEngine.constructor>[0]) {
  return new SwipePhysicsEngine(config)
}

/**
 * Prebuilt configurations for different use cases
 */
export const SwipePhysicsPresets = {
  // Smooth and responsive (default)
  default: {
    damping: 30,
    stiffness: 300,
    mass: 1,
    threshold: 150,
    velocityThreshold: 500
  },
  
  // More resistance, requires deliberate swipes
  deliberate: {
    damping: 40,
    stiffness: 200,
    mass: 1.2,
    threshold: 200,
    velocityThreshold: 800
  },
  
  // Very responsive, easy to swipe
  responsive: {
    damping: 20,
    stiffness: 400,
    mass: 0.8,
    threshold: 100,
    velocityThreshold: 300
  },
  
  // Bouncy and playful
  playful: {
    damping: 15,
    stiffness: 500,
    mass: 0.6,
    threshold: 120,
    velocityThreshold: 400
  },
  
  // Heavy and realistic
  realistic: {
    damping: 35,
    stiffness: 250,
    mass: 1.5,
    threshold: 180,
    velocityThreshold: 600
  }
}

export default SwipePhysicsEngine
