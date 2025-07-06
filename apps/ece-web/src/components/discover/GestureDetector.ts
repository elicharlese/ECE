'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export type GestureType = 'swipe' | 'tap' | 'double-tap' | 'long-press' | 'pinch' | 'rotate'
export type SwipeDirection = 'up' | 'down' | 'left' | 'right'

export interface GestureEvent {
  type: GestureType
  direction?: SwipeDirection
  startPosition: { x: number; y: number }
  endPosition: { x: number; y: number }
  velocity: { x: number; y: number }
  distance: number
  duration: number
  scale?: number
  rotation?: number
  pressure?: number
}

export interface GestureConfig {
  swipeThreshold?: number
  velocityThreshold?: number
  tapTimeout?: number
  doubleTapTimeout?: number
  longPressTimeout?: number
  pinchThreshold?: number
  rotationThreshold?: number
  enableHapticFeedback?: boolean
}

interface TouchPoint {
  x: number
  y: number
  timestamp: number
  pressure?: number
}

interface GestureState {
  isActive: boolean
  startTime: number
  touchCount: number
  initialTouches: TouchPoint[]
  currentTouches: TouchPoint[]
  history: TouchPoint[]
  lastTapTime: number
  tapCount: number
}

const DEFAULT_CONFIG: Required<GestureConfig> = {
  swipeThreshold: 50,
  velocityThreshold: 0.3,
  tapTimeout: 300,
  doubleTapTimeout: 400,
  longPressTimeout: 800,
  pinchThreshold: 10,
  rotationThreshold: 15,
  enableHapticFeedback: true
}

export class GestureDetector {
  private config: Required<GestureConfig>
  private state: GestureState
  private timeoutId: NodeJS.Timeout | null = null
  private element: HTMLElement | null = null
  
  private onGesture: (event: GestureEvent) => void = () => {}

  constructor(config: GestureConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.state = this.resetState()
  }

  private resetState(): GestureState {
    return {
      isActive: false,
      startTime: 0,
      touchCount: 0,
      initialTouches: [],
      currentTouches: [],
      history: [],
      lastTapTime: 0,
      tapCount: 0
    }
  }

  /**
   * Attach gesture detection to an element
   */
  attach(element: HTMLElement, onGesture: (event: GestureEvent) => void) {
    this.element = element
    this.onGesture = onGesture
    
    // Touch events
    element.addEventListener('touchstart', this.handleTouchStart, { passive: false })
    element.addEventListener('touchmove', this.handleTouchMove, { passive: false })
    element.addEventListener('touchend', this.handleTouchEnd, { passive: false })
    element.addEventListener('touchcancel', this.handleTouchCancel, { passive: false })
    
    // Mouse events for desktop
    element.addEventListener('mousedown', this.handleMouseDown)
    element.addEventListener('mousemove', this.handleMouseMove)
    element.addEventListener('mouseup', this.handleMouseUp)
    element.addEventListener('mouseleave', this.handleMouseLeave)
    
    // Prevent default context menu on long press
    element.addEventListener('contextmenu', (e) => e.preventDefault())
  }

  /**
   * Detach gesture detection from element
   */
  detach() {
    if (!this.element) return
    
    const element = this.element
    
    // Touch events
    element.removeEventListener('touchstart', this.handleTouchStart)
    element.removeEventListener('touchmove', this.handleTouchMove)
    element.removeEventListener('touchend', this.handleTouchEnd)
    element.removeEventListener('touchcancel', this.handleTouchCancel)
    
    // Mouse events
    element.removeEventListener('mousedown', this.handleMouseDown)
    element.removeEventListener('mousemove', this.handleMouseMove)
    element.removeEventListener('mouseup', this.handleMouseUp)
    element.removeEventListener('mouseleave', this.handleMouseLeave)
    
    this.element = null
    this.clearTimeout()
  }

  private handleTouchStart = (e: TouchEvent) => {
    e.preventDefault()
    const touches = this.getTouchPoints(e)
    this.startGesture(touches)
  }

  private handleTouchMove = (e: TouchEvent) => {
    if (!this.state.isActive) return
    e.preventDefault()
    const touches = this.getTouchPoints(e)
    this.updateGesture(touches)
  }

  private handleTouchEnd = (e: TouchEvent) => {
    if (!this.state.isActive) return
    const touches = this.getTouchPoints(e, true) // Include ended touches
    this.endGesture(touches)
  }

  private handleTouchCancel = (e: TouchEvent) => {
    this.cancelGesture()
  }

  private handleMouseDown = (e: MouseEvent) => {
    const touch: TouchPoint = {
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now(),
      pressure: e.buttons
    }
    this.startGesture([touch])
  }

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.state.isActive) return
    const touch: TouchPoint = {
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now(),
      pressure: e.buttons
    }
    this.updateGesture([touch])
  }

  private handleMouseUp = (e: MouseEvent) => {
    if (!this.state.isActive) return
    const touch: TouchPoint = {
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now(),
      pressure: 0
    }
    this.endGesture([touch])
  }

  private handleMouseLeave = (e: MouseEvent) => {
    this.cancelGesture()
  }

  private getTouchPoints(e: TouchEvent, includeEnded = false): TouchPoint[] {
    const touches = includeEnded ? 
      Array.from(e.changedTouches) : 
      Array.from(e.touches)
    
    return touches.map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
      pressure: touch.force || 1
    }))
  }

  private startGesture(touches: TouchPoint[]) {
    this.state = {
      ...this.resetState(),
      isActive: true,
      startTime: Date.now(),
      touchCount: touches.length,
      initialTouches: [...touches],
      currentTouches: [...touches],
      history: [...touches]
    }

    // Start long press detection for single touch
    if (touches.length === 1) {
      this.timeoutId = setTimeout(() => {
        this.detectLongPress()
      }, this.config.longPressTimeout)
    }
  }

  private updateGesture(touches: TouchPoint[]) {
    this.state.currentTouches = [...touches]
    this.state.history.push(...touches)

    // Clear long press timeout if we move significantly
    if (this.timeoutId && touches.length === 1) {
      const distance = this.getDistance(
        this.state.initialTouches[0],
        touches[0]
      )
      if (distance > this.config.swipeThreshold / 4) {
        this.clearTimeout()
      }
    }

    // Detect multi-touch gestures
    if (touches.length >= 2 && this.state.initialTouches.length >= 2) {
      this.detectPinchAndRotation()
    }
  }

  private endGesture(touches: TouchPoint[]) {
    const duration = Date.now() - this.state.startTime
    this.clearTimeout()

    // Single touch gestures
    if (this.state.touchCount === 1 && this.state.initialTouches.length > 0) {
      const start = this.state.initialTouches[0]
      const end = touches[0] || this.state.currentTouches[0]
      const distance = this.getDistance(start, end)
      const velocity = this.getVelocity(start, end, duration)

      if (distance < this.config.swipeThreshold && duration < this.config.tapTimeout) {
        this.detectTap(start)
      } else if (distance >= this.config.swipeThreshold || velocity.magnitude > this.config.velocityThreshold) {
        this.detectSwipe(start, end, velocity, duration)
      }
    }

    this.state = this.resetState()
  }

  private cancelGesture() {
    this.clearTimeout()
    this.state = this.resetState()
  }

  private detectTap(position: TouchPoint) {
    const now = Date.now()
    const timeSinceLastTap = now - this.state.lastTapTime

    if (timeSinceLastTap < this.config.doubleTapTimeout) {
      this.state.tapCount++
    } else {
      this.state.tapCount = 1
    }

    this.state.lastTapTime = now

    if (this.state.tapCount === 1) {
      // Wait to see if there's a second tap
      this.timeoutId = setTimeout(() => {
        this.emitGesture({
          type: 'tap',
          startPosition: position,
          endPosition: position,
          velocity: { x: 0, y: 0 },
          distance: 0,
          duration: 0
        })
        this.triggerHaptic('light')
      }, this.config.doubleTapTimeout)
    } else if (this.state.tapCount === 2) {
      this.clearTimeout()
      this.emitGesture({
        type: 'double-tap',
        startPosition: position,
        endPosition: position,
        velocity: { x: 0, y: 0 },
        distance: 0,
        duration: 0
      })
      this.triggerHaptic('medium')
      this.state.tapCount = 0
    }
  }

  private detectSwipe(start: TouchPoint, end: TouchPoint, velocity: any, duration: number) {
    const direction = this.getSwipeDirection(start, end)
    const distance = this.getDistance(start, end)

    this.emitGesture({
      type: 'swipe',
      direction,
      startPosition: start,
      endPosition: end,
      velocity,
      distance,
      duration
    })

    this.triggerHaptic('medium')
  }

  private detectLongPress() {
    if (!this.state.isActive || this.state.touchCount !== 1) return

    const position = this.state.initialTouches[0]
    this.emitGesture({
      type: 'long-press',
      startPosition: position,
      endPosition: position,
      velocity: { x: 0, y: 0 },
      distance: 0,
      duration: this.config.longPressTimeout
    })

    this.triggerHaptic('heavy')
  }

  private detectPinchAndRotation() {
    const initial = this.state.initialTouches.slice(0, 2)
    const current = this.state.currentTouches.slice(0, 2)

    if (initial.length < 2 || current.length < 2) return

    // Calculate pinch (scale change)
    const initialDistance = this.getDistance(initial[0], initial[1])
    const currentDistance = this.getDistance(current[0], current[1])
    const scale = currentDistance / initialDistance

    if (Math.abs(scale - 1) > this.config.pinchThreshold / 100) {
      const center = {
        x: (current[0].x + current[1].x) / 2,
        y: (current[0].y + current[1].y) / 2
      }

      this.emitGesture({
        type: 'pinch',
        startPosition: center,
        endPosition: center,
        velocity: { x: 0, y: 0 },
        distance: 0,
        duration: Date.now() - this.state.startTime,
        scale
      })

      this.triggerHaptic('light')
    }

    // Calculate rotation
    const initialAngle = this.getAngle(initial[0], initial[1])
    const currentAngle = this.getAngle(current[0], current[1])
    const rotation = currentAngle - initialAngle

    if (Math.abs(rotation) > this.config.rotationThreshold) {
      const center = {
        x: (current[0].x + current[1].x) / 2,
        y: (current[0].y + current[1].y) / 2
      }

      this.emitGesture({
        type: 'rotate',
        startPosition: center,
        endPosition: center,
        velocity: { x: 0, y: 0 },
        distance: 0,
        duration: Date.now() - this.state.startTime,
        rotation
      })

      this.triggerHaptic('light')
    }
  }

  private getDistance(point1: TouchPoint, point2: TouchPoint): number {
    const dx = point2.x - point1.x
    const dy = point2.y - point1.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  private getVelocity(start: TouchPoint, end: TouchPoint, duration: number) {
    const dx = end.x - start.x
    const dy = end.y - start.y
    const dt = duration || 1

    return {
      x: dx / dt,
      y: dy / dt,
      magnitude: Math.sqrt(dx * dx + dy * dy) / dt
    }
  }

  private getSwipeDirection(start: TouchPoint, end: TouchPoint): SwipeDirection {
    const dx = end.x - start.x
    const dy = end.y - start.y

    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left'
    } else {
      return dy > 0 ? 'down' : 'up'
    }
  }

  private getAngle(point1: TouchPoint, point2: TouchPoint): number {
    return Math.atan2(point2.y - point1.y, point2.x - point1.x) * 180 / Math.PI
  }

  private emitGesture(event: Omit<GestureEvent, 'type'> & { type: GestureType }) {
    this.onGesture(event as GestureEvent)
  }

  private triggerHaptic(intensity: 'light' | 'medium' | 'heavy') {
    if (!this.config.enableHapticFeedback) return

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30, 10, 30]
      }
      navigator.vibrate(patterns[intensity])
    }
  }

  private clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }
}

/**
 * React hook for gesture detection
 */
export function useGestureDetector(
  config: GestureConfig = {},
  onGesture: (event: GestureEvent) => void
) {
  const detectorRef = useRef<GestureDetector | null>(null)
  const elementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    detectorRef.current = new GestureDetector(config)
    
    return () => {
      if (detectorRef.current) {
        detectorRef.current.detach()
      }
    }
  }, [])

  const attachGestures = useCallback((element: HTMLElement | null) => {
    if (elementRef.current && detectorRef.current) {
      detectorRef.current.detach()
    }

    if (element && detectorRef.current) {
      elementRef.current = element
      detectorRef.current.attach(element, onGesture)
    }
  }, [onGesture])

  return { attachGestures }
}

export default GestureDetector
