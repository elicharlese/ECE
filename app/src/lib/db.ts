import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Mock database for development
export const mockDatabase = {
  users: new Map(),
  notifications: new Map(),
  orders: new Map(),
  cards: new Map(),
  portfolios: new Map()
}

// Subscription utilities
export const SubscriptionUtils = {
  isSubscriptionActive: (user: any) => {
    return user?.subscription?.status === 'active'
  },
  canUseFeature: (user: any, feature: string) => {
    if (!user?.subscription) return false
    const subscription = user.subscription
    const usage = subscription.usage || {}
    const features = subscription.features || {}
    
    switch (feature) {
      case 'superLikes':
        return (usage.superLikesUsed || 0) < (features.superLikesPerMonth || 0)
      case 'boosts':
        return (usage.boostsUsed || 0) < (features.boostsPerMonth || 0)
      case 'stipend':
        return (usage.stipendUsed || 0) < (features.businessStipend || 0)
      default:
        return features[feature] || false
    }
  }
}
