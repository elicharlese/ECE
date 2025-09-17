'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface SubscriptionFeatures {
  // Pro Features
  earlyMarketplaceAccess: boolean
  realTimeAlerts: boolean
  superLikesPerMonth: number
  boostsPerMonth: number
  enhancedUI: boolean
  dataReports: boolean
  businessStipend: number
  aiSuggestions: boolean
  
  // Enterprise Features
  multiAppAccess: boolean
  priority247Support: boolean
  customIntegrations: boolean
  dedicatedAccountManager: boolean
  customReporting: boolean
  whiteLabeling: boolean
}

interface SubscriptionUsage {
  superLikesUsed: number
  boostsUsed: number
  stipendUsed: number
  alertsReceived: number
  reportsGenerated: number
}

interface Subscription {
  id: string
  plan: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'canceled' | 'expired' | 'trial'
  startDate: Date
  endDate?: Date
  trialEndDate?: Date
  features: SubscriptionFeatures
  usage: SubscriptionUsage
  remainingUsage: {
    superLikes: number
    boosts: number
    stipend: number
  }
  isActive: boolean
}

interface SubscriptionContextType {
  subscription: Subscription | null
  isLoading: boolean
  hasFeature: (feature: keyof SubscriptionFeatures) => boolean
  canUseFeature: (feature: 'superLikes' | 'boosts' | 'stipend') => boolean
  useFeature: (feature: 'superLikes' | 'boosts' | 'stipend', amount?: number) => Promise<boolean>
  upgradeSubscription: (plan: 'pro' | 'enterprise') => Promise<boolean>
  refreshSubscription: () => Promise<void>
  isPro: boolean
  isEnterprise: boolean
  showUpgradePrompt: (feature: string) => void
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}

interface SubscriptionProviderProps {
  children: React.ReactNode
  userId?: string
}

export function SubscriptionProvider({ children, userId = 'user_pro_001' }: SubscriptionProviderProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSubscription = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/subscription?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setSubscription(data.subscription)
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchSubscription()
    }
  }, [userId])

  const hasFeature = (feature: keyof SubscriptionFeatures): boolean => {
    return subscription?.features[feature] === true
  }

  const canUseFeature = (feature: 'superLikes' | 'boosts' | 'stipend'): boolean => {
    if (!subscription?.isActive) return false
    
    switch (feature) {
      case 'superLikes':
        return (subscription.remainingUsage?.superLikes || 0) > 0
      case 'boosts':
        return (subscription.remainingUsage?.boosts || 0) > 0
      case 'stipend':
        return (subscription.remainingUsage?.stipend || 0) > 0
      default:
        return false
    }
  }

  const useFeature = async (feature: 'superLikes' | 'boosts' | 'stipend', amount: number = 1): Promise<boolean> => {
    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action: 'use_feature',
          feature,
          amount
        })
      })

      if (response.ok) {
        await fetchSubscription() // Refresh subscription data
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to use feature:', error)
      return false
    }
  }

  const upgradeSubscription = async (plan: 'pro' | 'enterprise'): Promise<boolean> => {
    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action: 'upgrade',
          plan
        })
      })

      if (response.ok) {
        await fetchSubscription() // Refresh subscription data
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to upgrade subscription:', error)
      return false
    }
  }

  const showUpgradePrompt = (feature: string) => {
    // This would typically show a modal or notification
    console.log(`Upgrade required for feature: ${feature}`)
    // You could implement toast notifications, modals, etc. here
  }

  const refreshSubscription = fetchSubscription

  const isPro = subscription?.plan === 'pro' || subscription?.plan === 'enterprise'
  const isEnterprise = subscription?.plan === 'enterprise'

  const value: SubscriptionContextType = {
    subscription,
    isLoading,
    hasFeature,
    canUseFeature,
    useFeature,
    upgradeSubscription,
    refreshSubscription,
    isPro,
    isEnterprise,
    showUpgradePrompt
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}
