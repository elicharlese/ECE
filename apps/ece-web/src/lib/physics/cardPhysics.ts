/**
 * Card Physics Engine
 * Handles realistic card movement, momentum, and spring animations
 */

import { SpringOptions } from 'framer-motion'

export interface PhysicsConfig {
  dragConstraints: {
    left: number
    right: number
    top: number
    bottom: number
  }
  swipeThreshold: number
  velocityThreshold: number
  springConfig: SpringOptions
  dampingConfig: SpringOptions
  rotationFactor: number
  scaleFactor: number
  elasticity: number
}

export interface SwipeVelocity {
  x: number
  y: number
  magnitude: number
  direction: 'left' | 'right' | 'up' | 'down'
}

export interface CardPhysics {
  position: { x: number; y: number }
  velocity: { x: number; y: number }
  rotation: number
  scale: number
  momentum: number
}

export class CardPhysicsEngine {
  private config: PhysicsConfig

  constructor(config?: Partial<PhysicsConfig>) {
    this.config = {
      dragConstraints: {
        left: -200,
        right: 200,
        top: -200,
        bottom: 200
      },
      swipeThreshold: 80,
      velocityThreshold: 300,
      springConfig: {
        stiffness: 300,
        damping: 30,
        mass: 1
      },
      dampingConfig: {
        stiffness: 100,
        damping: 20,
        mass: 0.8
      },
      rotationFactor: 0.1,
      scaleFactor: 0.95,
      elasticity: 0.3,
      ...config
    }
  }

  /**
   * Calculate swipe velocity and direction
   */
  calculateSwipeVelocity(velocityX: number, velocityY: number): SwipeVelocity {
    const magnitude = Math.sqrt(velocityX * velocityX + velocityY * velocityY)
    
    let direction: 'left' | 'right' | 'up' | 'down'
    
    if (Math.abs(velocityX) > Math.abs(velocityY)) {
      direction = velocityX > 0 ? 'right' : 'left'
    } else {
      direction = velocityY > 0 ? 'down' : 'up'
    }

    return {
      x: velocityX,
      y: velocityY,
      magnitude,
      direction
    }
  }

  /**
   * Determine if swipe should trigger action
   */
  shouldTriggerSwipe(
    offsetX: number, 
    offsetY: number, 
    velocityX: number, 
    velocityY: number
  ): { shouldSwipe: boolean; direction: 'left' | 'right' | 'up' | 'down' | null } {
    const { swipeThreshold, velocityThreshold } = this.config
    
    // Check if position threshold is met
    const positionSwipe = 
      Math.abs(offsetX) > swipeThreshold || 
      Math.abs(offsetY) > swipeThreshold
    
    // Check if velocity threshold is met
    const velocitySwipe = 
      Math.abs(velocityX) > velocityThreshold || 
      Math.abs(velocityY) > velocityThreshold

    if (positionSwipe || velocitySwipe) {
      // Determine direction based on greater displacement
      if (Math.abs(offsetX) > Math.abs(offsetY)) {
        return {
          shouldSwipe: true,
          direction: offsetX > 0 ? 'right' : 'left'
        }
      } else {
        return {
          shouldSwipe: true,
          direction: offsetY > 0 ? 'down' : 'up'
        }
      }
    }

    return { shouldSwipe: false, direction: null }
  }

  /**
   * Calculate card rotation based on position
   */
  calculateRotation(offsetX: number, maxOffset: number = 200): number {
    const normalizedOffset = Math.max(-1, Math.min(1, offsetX / maxOffset))
    return normalizedOffset * 30 * this.config.rotationFactor
  }

  /**
   * Calculate card scale based on drag distance
   */
  calculateScale(offsetX: number, offsetY: number, maxOffset: number = 200): number {
    const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY)
    const normalizedDistance = Math.min(1, distance / maxOffset)
    return 1 - (normalizedDistance * (1 - this.config.scaleFactor))
  }

  /**
   * Calculate opacity based on swipe progress
   */
  calculateOpacity(offsetX: number, offsetY: number, maxOffset: number = 200): number {
    const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY)
    const normalizedDistance = Math.min(1, distance / maxOffset)
    return 1 - (normalizedDistance * 0.3)
  }

  /**
   * Generate spring animation config for return to center
   */
  getReturnTocenterConfig(): SpringOptions {
    return this.config.springConfig
  }

  /**
   * Generate spring animation config for swipe out
   */
  getSwipeOutConfig(): SpringOptions {
    return {
      
      stiffness: 500,
      damping: 40,
      mass: 1
    }
  }

  /**
   * Calculate exit velocity for smooth swipe out
   */
  calculateExitVelocity(
    direction: 'left' | 'right' | 'up' | 'down',
    currentVelocity: { x: number; y: number }
  ): { x: number; y: number } {
    const baseVelocity = 800
    
    switch (direction) {
      case 'left':
        return { x: -baseVelocity + currentVelocity.x, y: currentVelocity.y }
      case 'right':
        return { x: baseVelocity + currentVelocity.x, y: currentVelocity.y }
      case 'up':
        return { x: currentVelocity.x, y: -baseVelocity + currentVelocity.y }
      case 'down':
        return { x: currentVelocity.x, y: baseVelocity + currentVelocity.y }
      default:
        return currentVelocity
    }
  }

  /**
   * Calculate elastic bounce effect
   */
  calculateElasticEffect(offset: number, constraint: number): number {
    if (Math.abs(offset) <= constraint) {
      return offset
    }
    
    const excess = Math.abs(offset) - constraint
    const elasticReduction = excess * this.config.elasticity
    return offset > 0 
      ? constraint + elasticReduction
      : -constraint - elasticReduction
  }

  /**
   * Calculate momentum-based animation
   */
  calculateMomentum(velocity: { x: number; y: number }): number {
    return Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y) / 1000
  }

  /**
   * Apply damping to velocity over time
   */
  applyDamping(velocity: { x: number; y: number }, dampingFactor: number = 0.95): { x: number; y: number } {
    return {
      x: velocity.x * dampingFactor,
      y: velocity.y * dampingFactor
    }
  }

  /**
   * Calculate stack effect positions for multiple cards
   */
  calculateStackPositions(
    cardCount: number, 
    activeIndex: number = 0,
    stackDepth: number = 3
  ): Array<{
    x: number
    y: number
    scale: number
    rotation: number
    zIndex: number
    opacity: number
  }> {
    const positions = []
    
    for (let i = 0; i < Math.min(cardCount, stackDepth); i++) {
      const stackIndex = i
      const depthFactor = stackIndex / (stackDepth - 1)
      
      positions.push({
        x: 0,
        y: stackIndex * -8,
        scale: 1 - (stackIndex * 0.05),
        rotation: stackIndex * 2,
        zIndex: stackDepth - stackIndex,
        opacity: 1 - (stackIndex * 0.15)
      })
    }
    
    return positions
  }

  /**
   * Update physics configuration
   */
  updateConfig(newConfig: Partial<PhysicsConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Get current configuration
   */
  getConfig(): PhysicsConfig {
    return { ...this.config }
  }
}

// Default physics engine instance
export const defaultPhysicsEngine = new CardPhysicsEngine()

// Physics presets for different use cases
export const physicsPresets = {
  smooth: new CardPhysicsEngine({
    swipeThreshold: 100,
    velocityThreshold: 400,
    springConfig: { stiffness: 250, damping: 35 },
    rotationFactor: 0.08
  }),
  
  snappy: new CardPhysicsEngine({
    swipeThreshold: 60,
    velocityThreshold: 200,
    springConfig: { stiffness: 400, damping: 25 },
    rotationFactor: 0.15
  }),
  
  elastic: new CardPhysicsEngine({
    swipeThreshold: 120,
    velocityThreshold: 500,
    springConfig: { stiffness: 200, damping: 40 },
    elasticity: 0.5,
    rotationFactor: 0.12
  }),
  
  gentle: new CardPhysicsEngine({
    swipeThreshold: 150,
    velocityThreshold: 600,
    springConfig: { stiffness: 180, damping: 45 },
    rotationFactor: 0.06,
    scaleFactor: 0.98
  })
}
