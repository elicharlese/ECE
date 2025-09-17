/**
 * Profile Success Metrics & Analytics System
 * Tracks user engagement, feature adoption, and performance metrics
 */

import { useEffect, useState } from 'react'

// Analytics event types
export interface AnalyticsEvent {
  event: string
  category: 'profile' | 'trading' | 'battles' | 'wishlist' | 'collection'
  action: string
  label?: string
  value?: number
  userId?: string
  sessionId?: string
  timestamp: Date
  metadata?: Record<string, any>
}

// User engagement metrics
export interface UserEngagementMetrics {
  // Session metrics
  sessionDuration: number
  pageViews: number
  tabSwitches: number
  actionCount: number
  
  // Feature usage
  profileViewsDaily: number
  profileEditsDaily: number
  collectionViewsDaily: number
  tradingActionsDaily: number
  battleParticipationDaily: number
  wishlistInteractionsDaily: number
  
  // Performance metrics
  avgLoadTime: number
  errorRate: number
  completionRates: {
    profileSetup: number
    firstTrade: number
    firstBattle: number
    collectionGoal: number
  }
}

// Feature adoption tracking
export interface FeatureAdoptionMetrics {
  // Core features
  profileCompletion: {
    avatarSet: boolean
    bioCompleted: boolean
    socialLinksAdded: boolean
    preferencesSet: boolean
    completionRate: number
  }
  
  // Advanced features
  tieredCardsUsage: {
    viewCount: number
    upgradeAttempts: number
    successfulUpgrades: number
    adoptionRate: number
  }
  
  // Trading features
  tradingAdoption: {
    firstTradeCompleted: boolean
    activeOrdersCreated: number
    portfolioValue: number
    tradingFrequency: 'daily' | 'weekly' | 'monthly' | 'rare'
  }
  
  // Social features
  battleAdoption: {
    firstBattleJoined: boolean
    battlesCompleted: number
    tournamentParticipation: number
    winRate: number
  }
  
  // Collection features
  collectionAdoption: {
    wishlistItems: number
    collectionSize: number
    rarityDistribution: Record<string, number>
    collectionValue: number
  }
}

// Performance metrics
export interface PerformanceMetrics {
  // Load times
  profilePageLoadTime: number
  componentRenderTimes: Record<string, number>
  apiResponseTimes: Record<string, number>
  
  // User experience
  clickThroughRates: Record<string, number>
  conversionRates: Record<string, number>
  retentionRates: {
    daily: number
    weekly: number
    monthly: number
  }
  
  // Error tracking
  errorCount: number
  errorTypes: Record<string, number>
  crashRate: number
}

// Analytics service
export class ProfileAnalytics {
  private events: AnalyticsEvent[] = []
  private sessionStart: Date = new Date()
  private sessionId: string = this.generateSessionId()
  
  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
  
  // Track events
  track(event: Omit<AnalyticsEvent, 'timestamp' | 'sessionId'>): void {
    const analyticsEvent: AnalyticsEvent = {
      ...event,
      timestamp: new Date(),
      sessionId: this.sessionId
    }
    
    this.events.push(analyticsEvent)
    
    // Send to analytics service (e.g., Google Analytics, Mixpanel, etc.)
    this.sendToAnalytics(analyticsEvent)
  }
  
  // Track page views
  trackPageView(page: string, userId?: string): void {
    this.track({
      event: 'page_view',
      category: 'profile',
      action: 'view',
      label: page,
      userId
    })
  }
  
  // Track feature usage
  trackFeatureUsage(feature: string, action: string, metadata?: Record<string, any>): void {
    this.track({
      event: 'feature_usage',
      category: 'profile',
      action,
      label: feature,
      metadata
    })
  }
  
  // Track performance metrics
  trackPerformance(metric: string, value: number, metadata?: Record<string, any>): void {
    this.track({
      event: 'performance',
      category: 'profile',
      action: 'measure',
      label: metric,
      value,
      metadata
    })
  }
  
  // Track user engagement
  trackEngagement(action: string, value?: number, metadata?: Record<string, any>): void {
    this.track({
      event: 'engagement',
      category: 'profile',
      action,
      value,
      metadata
    })
  }
  
  // Track errors
  trackError(error: Error, context?: string): void {
    this.track({
      event: 'error',
      category: 'profile',
      action: 'exception',
      label: error.message,
      metadata: {
        stack: error.stack,
        context,
        userAgent: navigator.userAgent
      }
    })
  }
  
  // Get session metrics
  getSessionMetrics(): Partial<UserEngagementMetrics> {
    const sessionDuration = Date.now() - this.sessionStart.getTime()
    const pageViews = this.events.filter(e => e.event === 'page_view').length
    const actionCount = this.events.filter(e => e.event === 'feature_usage').length
    
    return {
      sessionDuration,
      pageViews,
      actionCount
    }
  }
  
  // Send to external analytics service
  private async sendToAnalytics(event: AnalyticsEvent): Promise<void> {
    try {
      // Send to Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event.action, {
          event_category: event.category,
          event_label: event.label,
          value: event.value,
          custom_map: event.metadata
        })
      }
      
      // Send to custom analytics endpoint
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      })
    } catch (error) {
      console.warn('Analytics tracking failed:', error)
    }
  }
  
  // Export events for analysis
  exportEvents(): AnalyticsEvent[] {
    return [...this.events]
  }
  
  // Clear events (for memory management)
  clearEvents(): void {
    this.events = []
  }
}

// React hook for analytics
export function useProfileAnalytics(userId?: string) {
  const [analytics] = useState(() => new ProfileAnalytics())
  const [metrics, setMetrics] = useState<Partial<UserEngagementMetrics>>({})
  
  useEffect(() => {
    // Track initial page load
    analytics.trackPageView('profile', userId)
    
    // Track performance metrics
    const loadTime = performance.now()
    analytics.trackPerformance('page_load_time', loadTime)
    
    // Update metrics periodically
    const interval = setInterval(() => {
      setMetrics(analytics.getSessionMetrics())
    }, 5000)
    
    return () => clearInterval(interval)
  }, [analytics, userId])
  
  // Track component mount/unmount
  const trackComponentLifecycle = (componentName: string, action: 'mount' | 'unmount') => {
    analytics.trackFeatureUsage(componentName, action, {
      timestamp: Date.now()
    })
  }
  
  // Track user interactions
  const trackInteraction = (element: string, action: string, metadata?: Record<string, any>) => {
    analytics.trackEngagement(action, 1, {
      element,
      ...metadata
    })
  }
  
  // Track feature adoption
  const trackFeatureAdoption = (feature: string, adopted: boolean, metadata?: Record<string, any>) => {
    analytics.trackFeatureUsage(feature, adopted ? 'adopted' : 'abandoned', metadata)
  }
  
  return {
    analytics,
    metrics,
    trackComponentLifecycle,
    trackInteraction,
    trackFeatureAdoption,
    trackPageView: analytics.trackPageView.bind(analytics),
    trackFeatureUsage: analytics.trackFeatureUsage.bind(analytics),
    trackPerformance: analytics.trackPerformance.bind(analytics),
    trackError: analytics.trackError.bind(analytics)
  }
}

// Success metrics calculator
export class SuccessMetricsCalculator {
  // Calculate profile completion score
  static calculateProfileCompletion(user: any): number {
    const checks = [
      !!user.avatar,
      !!user.bio && user.bio.length > 10,
      !!user.socialLinks && Object.keys(user.socialLinks).length > 0,
      !!user.preferences,
      !!user.tier && user.tier > 1,
      !!user.collections && user.collections.length > 0
    ]
    
    return (checks.filter(Boolean).length / checks.length) * 100
  }
  
  // Calculate engagement score
  static calculateEngagementScore(metrics: UserEngagementMetrics): number {
    const weights = {
      sessionDuration: 0.3,
      actionCount: 0.25,
      tabSwitches: 0.15,
      tradingActions: 0.15,
      battleParticipation: 0.15
    }
    
    const normalizedMetrics = {
      sessionDuration: Math.min(metrics.sessionDuration / (30 * 60 * 1000), 1), // 30 minutes max
      actionCount: Math.min(metrics.actionCount / 50, 1), // 50 actions max
      tabSwitches: Math.min(metrics.tabSwitches / 20, 1), // 20 switches max
      tradingActions: Math.min(metrics.tradingActionsDaily / 10, 1), // 10 trades max
      battleParticipation: Math.min(metrics.battleParticipationDaily / 5, 1) // 5 battles max
    }
    
    return Object.entries(weights).reduce((score, [key, weight]) => {
      return score + (normalizedMetrics[key as keyof typeof normalizedMetrics] || 0) * weight
    }, 0) * 100
  }
  
  // Calculate feature adoption rate
  static calculateFeatureAdoptionRate(adoption: FeatureAdoptionMetrics): number {
    const features = [
      adoption.profileCompletion.completionRate > 0.8,
      adoption.tieredCardsUsage.adoptionRate > 0.5,
      adoption.tradingAdoption.firstTradeCompleted,
      adoption.battleAdoption.firstBattleJoined,
      adoption.collectionAdoption.wishlistItems > 5
    ]
    
    return (features.filter(Boolean).length / features.length) * 100
  }
}

// Export analytics instance
export const profileAnalytics = new ProfileAnalytics()
