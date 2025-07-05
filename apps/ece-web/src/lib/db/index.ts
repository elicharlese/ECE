// Database Connection and Configuration
// This handles the connection to our database and provides utility functions

// For now, we'll use a mock database until Prisma is properly configured
// import { PrismaClient } from '@prisma/client'

import { 
  User, 
  UserSubscription, 
  SubscriptionFeatures,
  SubscriptionUsage,
  Card, 
  Notification,
  MarketplaceListing,
  Bid,
  SocialFeed,
  AppOrder,
  OrderRevision,
  OrderCommunication,
  OrderDeliverable
} from './schema'

// declare global {
//   var prisma: PrismaClient | undefined
// }

// // Singleton pattern for Prisma client
// export const db = globalThis.prisma || new PrismaClient()

// if (process.env.NODE_ENV !== 'production') {
//   globalThis.prisma = db
// }

// Temporary mock database for development
export const db = null

// Mock data storage
export const mockDatabase = {
  users: new Map<string, User>(),
  subscriptions: new Map<string, UserSubscription>(),
  cards: new Map<string, Card>(),
  notifications: new Map<string, Notification>(),
  marketplaceListings: new Map<string, MarketplaceListing>(),
  bids: new Map<string, Bid>(),
  socialFeeds: new Map<string, SocialFeed>(),
  // App Ordering System
  appOrders: new Map<string, AppOrder>(),
  orderRevisions: new Map<string, OrderRevision>(),
  orderCommunications: new Map<string, OrderCommunication>(),
  orderDeliverables: new Map<string, OrderDeliverable>(),
}

// Initialize with sample data
function initializeMockData() {
  // Sample Pro user
  const proUser: User = {
    id: 'user_pro_001',
    email: 'pro@example.com',
    username: 'ProTrader',
    firstName: 'Pro',
    lastName: 'User',
    eceBalance: 5000,
    tier: 'gold',
    badges: [],
    isVerified: true,
    role: 'user',
    preferences: {
      userId: 'user_pro_001',
      enableBidding: true,
      enableBetting: true,
      enableBattling: true,
      autoBoosts: true,
      notificationSettings: {
        pushNotifications: true,
        emailNotifications: true,
        smsNotifications: true,
        marketingEmails: true,
        socialUpdates: true,
        tradingAlerts: true,
        realTimeAlerts: true,
        ipoAlerts: true,
        priceAlerts: true
      }
    },
    subscription: {
      id: 'sub_pro_001',
      userId: 'user_pro_001',
      plan: 'pro',
      status: 'active',
      startDate: new Date('2024-01-01'),
      billingCycle: 'monthly',
      features: {
        earlyMarketplaceAccess: true,
        realTimeAlerts: true,
        superLikesPerMonth: 10,
        boostsPerMonth: 10,
        enhancedUI: true,
        dataReports: true,
        businessStipend: 250,
        aiSuggestions: true,
        multiAppAccess: false,
        priority247Support: false,
        customIntegrations: false,
        dedicatedAccountManager: false,
        customReporting: false,
        whiteLabeling: false
      },
      usage: {
        userId: 'user_pro_001',
        month: '2024-06',
        superLikesUsed: 3,
        boostsUsed: 2,
        stipendUsed: 50,
        alertsReceived: 25,
        reportsGenerated: 5
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }

  // Sample Enterprise user
  const enterpriseUser: User = {
    id: 'user_ent_001',
    email: 'enterprise@example.com',
    username: 'EnterpriseTrader',
    firstName: 'Enterprise',
    lastName: 'User',
    eceBalance: 25000,
    tier: 'diamond',
    badges: [],
    isVerified: true,
    role: 'user',
    preferences: {
      userId: 'user_ent_001',
      enableBidding: true,
      enableBetting: true,
      enableBattling: true,
      autoBoosts: true,
      notificationSettings: {
        pushNotifications: true,
        emailNotifications: true,
        smsNotifications: true,
        marketingEmails: false,
        socialUpdates: true,
        tradingAlerts: true,
        realTimeAlerts: true,
        ipoAlerts: true,
        priceAlerts: true
      }
    },
    subscription: {
      id: 'sub_ent_001',
      userId: 'user_ent_001',
      plan: 'enterprise',
      status: 'active',
      startDate: new Date('2024-01-01'),
      billingCycle: 'yearly',
      features: {
        earlyMarketplaceAccess: true,
        realTimeAlerts: true,
        superLikesPerMonth: 50,
        boostsPerMonth: 50,
        enhancedUI: true,
        dataReports: true,
        businessStipend: 1000,
        aiSuggestions: true,
        multiAppAccess: true,
        priority247Support: true,
        customIntegrations: true,
        dedicatedAccountManager: true,
        customReporting: true,
        whiteLabeling: true
      },
      usage: {
        userId: 'user_ent_001',
        month: '2024-06',
        superLikesUsed: 12,
        boostsUsed: 8,
        stipendUsed: 200,
        alertsReceived: 89,
        reportsGenerated: 15
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  }

  mockDatabase.users.set(proUser.id, proUser)
  mockDatabase.users.set(enterpriseUser.id, enterpriseUser)
}

// Initialize mock data
initializeMockData()

// Subscription utility functions
export class SubscriptionUtils {
  static hasFeature(user: User, feature: keyof SubscriptionFeatures): boolean {
    return user.subscription.features[feature] === true
  }

  static canUseFeature(user: User, feature: 'superLikes' | 'boosts' | 'stipend'): boolean {
    const usage = user.subscription.usage
    const features = user.subscription.features
    const currentMonth = new Date().toISOString().slice(0, 7)

    // Reset usage if it's a new month
    if (usage.month !== currentMonth) {
      usage.month = currentMonth
      usage.superLikesUsed = 0
      usage.boostsUsed = 0
      usage.stipendUsed = 0
      usage.alertsReceived = 0
      usage.reportsGenerated = 0
    }

    switch (feature) {
      case 'superLikes':
        return usage.superLikesUsed < features.superLikesPerMonth
      case 'boosts':
        return usage.boostsUsed < features.boostsPerMonth
      case 'stipend':
        return usage.stipendUsed < features.businessStipend
      default:
        return false
    }
  }

  static useFeature(user: User, feature: 'superLikes' | 'boosts' | 'stipend', amount: number = 1): boolean {
    if (!this.canUseFeature(user, feature)) {
      return false
    }

    const usage = user.subscription.usage
    switch (feature) {
      case 'superLikes':
        usage.superLikesUsed += amount
        break
      case 'boosts':
        usage.boostsUsed += amount
        break
      case 'stipend':
        usage.stipendUsed += amount
        break
    }

    return true
  }

  static getSubscriptionLevel(user: User): 'free' | 'pro' | 'enterprise' {
    return user.subscription.plan
  }

  static isSubscriptionActive(user: User): boolean {
    return user.subscription.status === 'active' || user.subscription.status === 'trial'
  }

  static hasEarlyAccess(user: User): boolean {
    return this.hasFeature(user, 'earlyMarketplaceAccess') && this.isSubscriptionActive(user)
  }

  static canReceiveRealTimeAlerts(user: User): boolean {
    return this.hasFeature(user, 'realTimeAlerts') && this.isSubscriptionActive(user)
  }
}

// Database utility functions
export class DatabaseUtils {
  static async generateId(): Promise<string> {
    return `ece_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  static async paginate<T>(
    query: any,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: T[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      query.skip(skip).take(limit).findMany(),
      query.count()
    ])

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  static buildFilters(filters: Record<string, any>): Record<string, any> {
    const where: Record<string, any> = {}

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          where[key] = { in: value }
        } else if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
          where[key] = {
            gte: value.min,
            lte: value.max
          }
        } else {
          where[key] = { contains: value, mode: 'insensitive' }
        }
      }
    })

    return where
  }

  static generateOrderBy(sortBy?: string, sortOrder: 'asc' | 'desc' = 'desc') {
    if (!sortBy) return { createdAt: 'desc' }
    
    return {
      [sortBy]: sortOrder
    }
  }
}

// Mock data for development (until we set up a real database)
export class MockDatabase {
  private static users: any[] = []
  private static cards: any[] = []
  private static listings: any[] = []
  private static bids: any[] = []
  private static bets: any[] = []
  private static battles: any[] = []
  private static transactions: any[] = []
  private static watchlists: any[] = []
  private static socialFeeds: any[] = []
  private static chats: any[] = []

  // Initialize with sample data
  static init() {
    this.seedSampleData()
  }

  private static seedSampleData() {
    // Sample users
    this.users = [
      {
        id: 'user_1',
        email: 'john@example.com',
        username: 'john_trader',
        firstName: 'John',
        lastName: 'Doe',
        eceBalance: 1500.50,
        tier: 'gold',
        badges: [],
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'user_2',
        email: 'jane@example.com',
        username: 'jane_collector',
        firstName: 'Jane',
        lastName: 'Smith',
        eceBalance: 2300.75,
        tier: 'platinum',
        badges: [],
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    // Sample cards
    this.cards = [
      {
        id: 'card_1',
        name: 'Tesla Model S Plaid',
        description: 'Revolutionary electric vehicle with cutting-edge technology',
        imageUrl: '/api/placeholder/400/600',
        rarity: 'legendary',
        category: 'Automotive',
        company: 'Tesla',
        valuation: 125000,
        marketCap: 800000000000,
        volume24h: 45000000,
        priceChange24h: 2.4,
        attributes: [
          { trait_type: 'Speed', value: '200 mph' },
          { trait_type: 'Range', value: '405 miles' },
          { trait_type: 'Year', value: 2024 }
        ],
        metadata: {
          edition: 'First Edition',
          serialNumber: 1001,
          totalSupply: 50000
        },
        isListed: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'card_2',
        name: 'iPhone 15 Pro Max',
        description: 'Latest flagship smartphone with titanium design',
        imageUrl: '/api/placeholder/400/600',
        rarity: 'epic',
        category: 'Technology',
        company: 'Apple',
        valuation: 1200,
        marketCap: 3000000000000,
        volume24h: 120000000,
        priceChange24h: -1.2,
        attributes: [
          { trait_type: 'Storage', value: '1TB' },
          { trait_type: 'Camera', value: '48MP' },
          { trait_type: 'Year', value: 2024 }
        ],
        metadata: {
          edition: 'Pro Max',
          serialNumber: 2001,
          totalSupply: 100000
        },
        isListed: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    // Sample listings
    this.listings = [
      {
        id: 'listing_1',
        cardId: 'card_1',
        sellerId: 'user_1',
        price: 1250.00,
        currency: 'ECE',
        listingType: 'auction',
        status: 'active',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }

  // CRUD operations for development
  static async findUser(id: string) {
    return this.users.find(user => user.id === id)
  }

  static async findCards(filters: any = {}, limit: number = 20, offset: number = 0) {
    let filtered = [...this.cards]
    
    if (filters.category) {
      filtered = filtered.filter(card => card.category.toLowerCase().includes(filters.category.toLowerCase()))
    }
    
    if (filters.company) {
      filtered = filtered.filter(card => card.company.toLowerCase().includes(filters.company.toLowerCase()))
    }
    
    if (filters.rarity) {
      filtered = filtered.filter(card => filters.rarity.includes(card.rarity))
    }

    return {
      data: filtered.slice(offset, offset + limit),
      total: filtered.length
    }
  }

  static async createListing(listing: any) {
    const newListing = {
      ...listing,
      id: `listing_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.listings.push(newListing)
    return newListing
  }

  static async createBid(bid: any) {
    const newBid = {
      ...bid,
      id: `bid_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.bids.push(newBid)
    return newBid
  }

  static async createBet(bet: any) {
    const newBet = {
      ...bet,
      id: `bet_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.bets.push(newBet)
    return newBet
  }

  static async createBattle(battle: any) {
    const newBattle = {
      ...battle,
      id: `battle_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.battles.push(newBattle)
    return newBattle
  }
}

// Initialize mock data
MockDatabase.init()

export default db
