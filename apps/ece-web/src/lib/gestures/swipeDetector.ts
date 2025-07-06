/**
 * Swipe Gesture Detection System
 * Advanced gesture recognition for card swiping with haptic feedback
 */

import React, { RefObject } from 'react'

export interface GestureConfig {
  swipeThreshold: number
  velocityThreshold: number
  timeThreshold: number
  maxTouchPoints: number
  enableHaptics: boolean
  preventScroll: boolean
  debugMode: boolean
}

export interface TouchPoint {
  id: number
  x: number
  y: number
  timestamp: number
}

export interface GestureEvent {
  type: 'swipe' | 'tap' | 'longpress' | 'pinch' | 'doubletap'
  direction?: 'left' | 'right' | 'up' | 'down'
  velocity: { x: number; y: number }
  distance: { x: number; y: number }
  duration: number
  touchPoints: TouchPoint[]
  originalEvent: TouchEvent | MouseEvent | PointerEvent
}

export interface SwipeCallbacks {
  onSwipeStart?: (event: GestureEvent) => void
  onSwipeMove?: (event: GestureEvent) => void
  onSwipeEnd?: (event: GestureEvent) => void
  onTap?: (event: GestureEvent) => void
  onLongPress?: (event: GestureEvent) => void
  onDoubleTab?: (event: GestureEvent) => void
  onPinch?: (event: GestureEvent) => void
}

export class SwipeGestureDetector {
  private config: GestureConfig
  private callbacks: SwipeCallbacks
  private element: HTMLElement | null = null
  private isEnabled: boolean = true
  
  // Touch state tracking
  private touchPoints: Map<number, TouchPoint> = new Map()
  private startPoints: Map<number, TouchPoint> = new Map()
  private gestureStartTime: number = 0
  private lastTapTime: number = 0
  private longPressTimer: NodeJS.Timeout | null = null
  private isGestureActive: boolean = false

  // Mouse state tracking (for desktop)
  private mouseDown: boolean = false
  private mouseStartPoint: TouchPoint | null = null

  constructor(config?: Partial<GestureConfig>, callbacks?: SwipeCallbacks) {
    this.config = {
      swipeThreshold: 50,
      velocityThreshold: 0.3,
      timeThreshold: 300,
      maxTouchPoints: 2,
      enableHaptics: true,
      preventScroll: true,
      debugMode: false,
      ...config
    }
    
    this.callbacks = callbacks || {}
  }

  /**
   * Attach gesture detection to an element
   */
  attach(element: HTMLElement): void {
    this.detach() // Remove existing listeners
    this.element = element
    
    // Touch events
    element.addEventListener('touchstart', this.handleTouchStart, { passive: false })
    element.addEventListener('touchmove', this.handleTouchMove, { passive: false })
    element.addEventListener('touchend', this.handleTouchEnd, { passive: false })
    element.addEventListener('touchcancel', this.handleTouchCancel, { passive: false })

    // Mouse events (for desktop)
    element.addEventListener('mousedown', this.handleMouseDown)
    element.addEventListener('mousemove', this.handleMouseMove)
    element.addEventListener('mouseup', this.handleMouseUp)
    element.addEventListener('mouseleave', this.handleMouseLeave)

    // Pointer events (modern browsers)
    if ('PointerEvent' in window) {
      element.addEventListener('pointerdown', this.handlePointerDown)
      element.addEventListener('pointermove', this.handlePointerMove)
      element.addEventListener('pointerup', this.handlePointerUp)
      element.addEventListener('pointercancel', this.handlePointerCancel)
    }

    // Prevent context menu on long press
    element.addEventListener('contextmenu', this.preventContextMenu)
  }

  /**
   * Detach gesture detection from current element
   */
  detach(): void {
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

    // Pointer events
    element.removeEventListener('pointerdown', this.handlePointerDown)
    element.removeEventListener('pointermove', this.handlePointerMove)
    element.removeEventListener('pointerup', this.handlePointerUp)
    element.removeEventListener('pointercancel', this.handlePointerCancel)

    element.removeEventListener('contextmenu', this.preventContextMenu)
    
    this.element = null
    this.resetState()
  }

  /**
   * Enable/disable gesture detection
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
    if (!enabled) {
      this.resetState()
    }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<GestureConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * Update callbacks
   */
  updateCallbacks(callbacks: SwipeCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks }
  }

  // Touch Event Handlers
  private handleTouchStart = (event: TouchEvent): void => {
    if (!this.isEnabled) return
    
    if (this.config.preventScroll) {
      event.preventDefault()
    }

    const timestamp = Date.now()
    this.gestureStartTime = timestamp

    // Track all touch points
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i]
      const touchPoint: TouchPoint = {
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
        timestamp
      }
      
      this.touchPoints.set(touch.identifier, touchPoint)
      this.startPoints.set(touch.identifier, { ...touchPoint })
    }

    this.isGestureActive = true
    this.startLongPressTimer()
    this.triggerHapticFeedback('light')

    if (this.callbacks.onSwipeStart) {
      this.callbacks.onSwipeStart(this.createGestureEvent('swipe', event))
    }
  }

  private handleTouchMove = (event: TouchEvent): void => {
    if (!this.isEnabled || !this.isGestureActive) return

    if (this.config.preventScroll) {
      event.preventDefault()
    }

    this.clearLongPressTimer()

    // Update touch points
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i]
      const touchPoint: TouchPoint = {
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now()
      }
      
      this.touchPoints.set(touch.identifier, touchPoint)
    }

    if (this.callbacks.onSwipeMove) {
      this.callbacks.onSwipeMove(this.createGestureEvent('swipe', event))
    }
  }

  private handleTouchEnd = (event: TouchEvent): void => {
    if (!this.isEnabled) return

    this.clearLongPressTimer()

    const endTime = Date.now()
    const duration = endTime - this.gestureStartTime

    // Remove ended touches
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i]
      this.touchPoints.delete(touch.identifier)
    }

    // If no more touches, end gesture
    if (this.touchPoints.size === 0) {
      const gestureEvent = this.createGestureEvent('swipe', event)
      
      // Determine gesture type
      if (this.isSwipeGesture(gestureEvent)) {
        this.triggerHapticFeedback('medium')
        if (this.callbacks.onSwipeEnd) {
          this.callbacks.onSwipeEnd(gestureEvent)
        }
      } else if (this.isTapGesture(gestureEvent)) {
        this.handleTapGesture(gestureEvent)
      }

      this.resetState()
    }
  }

  private handleTouchCancel = (event: TouchEvent): void => {
    this.resetState()
  }

  // Mouse Event Handlers (for desktop support)
  private handleMouseDown = (event: MouseEvent): void => {
    if (!this.isEnabled) return

    this.mouseDown = true
    this.gestureStartTime = Date.now()
    this.mouseStartPoint = {
      id: 0,
      x: event.clientX,
      y: event.clientY,
      timestamp: Date.now()
    }

    this.isGestureActive = true
    this.startLongPressTimer()

    if (this.callbacks.onSwipeStart) {
      this.callbacks.onSwipeStart(this.createGestureEvent('swipe', event))
    }
  }

  private handleMouseMove = (event: MouseEvent): void => {
    if (!this.isEnabled || !this.mouseDown) return

    this.clearLongPressTimer()

    if (this.callbacks.onSwipeMove) {
      this.callbacks.onSwipeMove(this.createGestureEvent('swipe', event))
    }
  }

  private handleMouseUp = (event: MouseEvent): void => {
    if (!this.isEnabled || !this.mouseDown) return

    this.mouseDown = false
    this.clearLongPressTimer()

    const gestureEvent = this.createGestureEvent('swipe', event)
    
    if (this.isSwipeGesture(gestureEvent)) {
      if (this.callbacks.onSwipeEnd) {
        this.callbacks.onSwipeEnd(gestureEvent)
      }
    } else if (this.isTapGesture(gestureEvent)) {
      this.handleTapGesture(gestureEvent)
    }

    this.resetState()
  }

  private handleMouseLeave = (event: MouseEvent): void => {
    this.resetState()
  }

  // Pointer Event Handlers
  private handlePointerDown = (event: PointerEvent): void => {
    // Handle similar to touch/mouse based on pointer type
    if (event.pointerType === 'touch') {
      // Use touch logic
    } else {
      // Use mouse logic
    }
  }

  private handlePointerMove = (event: PointerEvent): void => {
    // Implementation similar to touch/mouse move
  }

  private handlePointerUp = (event: PointerEvent): void => {
    // Implementation similar to touch/mouse up
  }

  private handlePointerCancel = (event: PointerEvent): void => {
    this.resetState()
  }

  // Utility Methods
  private createGestureEvent(
    type: 'swipe' | 'tap' | 'longpress' | 'pinch' | 'doubletap',
    originalEvent: TouchEvent | MouseEvent | PointerEvent
  ): GestureEvent {
    const touchPoints = Array.from(this.touchPoints.values())
    const startPoints = Array.from(this.startPoints.values())
    
    let distance = { x: 0, y: 0 }
    let velocity = { x: 0, y: 0 }
    
    if (touchPoints.length > 0 && startPoints.length > 0) {
      const currentPoint = touchPoints[0]
      const startPoint = startPoints[0]
      
      distance = {
        x: currentPoint.x - startPoint.x,
        y: currentPoint.y - startPoint.y
      }
      
      const timeDiff = Math.max(1, currentPoint.timestamp - startPoint.timestamp)
      velocity = {
        x: distance.x / timeDiff,
        y: distance.y / timeDiff
      }
    } else if (this.mouseStartPoint && originalEvent instanceof MouseEvent) {
      distance = {
        x: originalEvent.clientX - this.mouseStartPoint.x,
        y: originalEvent.clientY - this.mouseStartPoint.y
      }
      
      const timeDiff = Math.max(1, Date.now() - this.mouseStartPoint.timestamp)
      velocity = {
        x: distance.x / timeDiff,
        y: distance.y / timeDiff
      }
    }

    return {
      type,
      direction: this.getSwipeDirection(distance),
      velocity,
      distance,
      duration: Date.now() - this.gestureStartTime,
      touchPoints,
      originalEvent
    }
  }

  private isSwipeGesture(gestureEvent: GestureEvent): boolean {
    const { distance, velocity } = gestureEvent
    const totalDistance = Math.sqrt(distance.x * distance.x + distance.y * distance.y)
    const totalVelocity = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y)
    
    return totalDistance > this.config.swipeThreshold || 
           totalVelocity > this.config.velocityThreshold
  }

  private isTapGesture(gestureEvent: GestureEvent): boolean {
    const { distance, duration } = gestureEvent
    const totalDistance = Math.sqrt(distance.x * distance.x + distance.y * distance.y)
    
    return totalDistance < this.config.swipeThreshold && 
           duration < this.config.timeThreshold
  }

  private getSwipeDirection(distance: { x: number; y: number }): 'left' | 'right' | 'up' | 'down' {
    if (Math.abs(distance.x) > Math.abs(distance.y)) {
      return distance.x > 0 ? 'right' : 'left'
    } else {
      return distance.y > 0 ? 'down' : 'up'
    }
  }

  private handleTapGesture(gestureEvent: GestureEvent): void {
    const currentTime = Date.now()
    const timeSinceLastTap = currentTime - this.lastTapTime
    
    if (timeSinceLastTap < 300) {
      // Double tap
      this.triggerHapticFeedback('medium')
      if (this.callbacks.onDoubleTab) {
        this.callbacks.onDoubleTab({ ...gestureEvent, type: 'doubletap' })
      }
    } else {
      // Single tap
      this.triggerHapticFeedback('light')
      if (this.callbacks.onTap) {
        this.callbacks.onTap({ ...gestureEvent, type: 'tap' })
      }
    }
    
    this.lastTapTime = currentTime
  }

  private startLongPressTimer(): void {
    this.clearLongPressTimer()
    this.longPressTimer = setTimeout(() => {
      if (this.isGestureActive) {
        this.triggerHapticFeedback('heavy')
        if (this.callbacks.onLongPress) {
          this.callbacks.onLongPress(this.createGestureEvent('longpress', new Event('longpress') as any))
        }
      }
    }, 500)
  }

  private clearLongPressTimer(): void {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer)
      this.longPressTimer = null
    }
  }

  private triggerHapticFeedback(intensity: 'light' | 'medium' | 'heavy'): void {
    if (!this.config.enableHaptics || !navigator.vibrate) return

    const patterns = {
      light: [10],
      medium: [30],
      heavy: [50, 10, 50]
    }

    navigator.vibrate(patterns[intensity])
  }

  private preventContextMenu = (event: Event): void => {
    event.preventDefault()
  }

  private resetState(): void {
    this.touchPoints.clear()
    this.startPoints.clear()
    this.mouseDown = false
    this.mouseStartPoint = null
    this.isGestureActive = false
    this.clearLongPressTimer()
  }

  // Debug methods
  private log(...args: any[]): void {
    if (this.config.debugMode) {
      console.log('[SwipeGestureDetector]', ...args)
    }
  }
}

// Hook for React components
export function useSwipeGesture(
  elementRef: RefObject<HTMLElement>,
  callbacks: SwipeCallbacks,
  config?: Partial<GestureConfig>
) {
  const detector = new SwipeGestureDetector(config, callbacks)
  
  React.useEffect(() => {
    if (elementRef.current) {
      detector.attach(elementRef.current)
    }
    
    return () => {
      detector.detach()
    }
  }, [elementRef.current])

  return {
    setEnabled: detector.setEnabled.bind(detector),
    updateConfig: detector.updateConfig.bind(detector),
    updateCallbacks: detector.updateCallbacks.bind(detector)
  }
}

export default SwipeGestureDetector
