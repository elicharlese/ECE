import { PrismaClient } from '@prisma/client'
import { Redis } from 'ioredis'

/**
 * Prisma Accelerated Caching Service
 * Implements intelligent caching strategies for real-time multiplayer gaming
 */
export class PrismaCacheService {
  private prisma: PrismaClient
  private redis: Redis
  private cachePrefix = 'ece:'
  private defaultTTL = 300 // 5 minutes
  private hotDataTTL = 60 // 1 minute for frequently accessed data
  private coldDataTTL = 3600 // 1 hour for rarely accessed data

  constructor() {
    this.prisma = new PrismaClient({
      // Enable Prisma Accelerate for connection pooling and caching
      datasourceUrl: process.env.DATABASE_URL_ACCELERATE || process.env.DATABASE_URL
    })
    
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
    })

    this.setupCacheInvalidation()
  }

  private setupCacheInvalidation() {
    // Setup Redis keyspace notifications for cache invalidation
    this.redis.config('SET', 'notify-keyspace-events', 'Ex')
    
    // Listen for expired keys
    const subscriber = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    })
    
    subscriber.psubscribe('__keyevent@0__:expired')
    subscriber.on('pmessage', (pattern, channel, expiredKey) => {
      console.log(`Cache key expired: ${expiredKey}`)
    })
  }

  // Card-related caching with battle optimization
  async getCard(cardId: string, useCache = true): Promise<any> {
    const cacheKey = `${this.cachePrefix}card:${cardId}`
    
    if (useCache) {
      const cached = await this.redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached)
      }
    }

    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      include: {
        owner: {
          select: { id: true, username: true, level: true }
        },
        listing: true,
        bids: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { bidder: { select: { username: true } } }
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        appliedPowerups: {
          include: { powerupType: true }
        }
      }
    })

    if (card && useCache) {
      // Cache with hot data TTL since cards are frequently accessed during battles
      await this.redis.setex(cacheKey, this.hotDataTTL, JSON.stringify(card))
    }

    return card
  }

  async getCardsForBattle(playerIds: string[]): Promise<any[]> {
    const cacheKey = `${this.cachePrefix}battle:cards:${playerIds.sort().join(',')}`
    
    const cached = await this.redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached)
    }

    const cards = await this.prisma.card.findMany({
      where: {
        ownerId: { in: playerIds }
      },
      include: {
        owner: { select: { id: true, username: true } },
        appliedPowerups: {
          include: { powerupType: true }
        }
      }
    })

    // Cache for battle duration
    await this.redis.setex(cacheKey, 1800, JSON.stringify(cards)) // 30 minutes
    return cards
  }

  // Battle state caching with real-time updates
  async cacheBattleState(battleId: string, state: any): Promise<void> {
    const cacheKey = `${this.cachePrefix}battle:state:${battleId}`
    
    // Store battle state with short TTL for real-time updates
    await this.redis.setex(cacheKey, 300, JSON.stringify({
      ...state,
      lastUpdated: Date.now()
    }))

    // Also store in battle history for replay
    const historyKey = `${this.cachePrefix}battle:history:${battleId}`
    await this.redis.lpush(historyKey, JSON.stringify({
      state,
      timestamp: Date.now()
    }))
    await this.redis.ltrim(historyKey, 0, 100) // Keep last 100 states
    await this.redis.expire(historyKey, 86400) // 24 hours
  }

  async getBattleState(battleId: string): Promise<any> {
    const cacheKey = `${this.cachePrefix}battle:state:${battleId}`
    const cached = await this.redis.get(cacheKey)
    
    if (cached) {
      const state = JSON.parse(cached)
      // Check if state is fresh (less than 5 seconds old)
      if (Date.now() - state.lastUpdated < 5000) {
        return state
      }
    }

    // Fallback to database
    const battle = await this.prisma.mABattle.findUnique({
      where: { id: battleId },
      include: {
        initiator: { select: { username: true } },
        target: { select: { username: true } },
        proposals: true,
        votes: true
      }
    })

    if (battle) {
      await this.cacheBattleState(battleId, battle)
    }

    return battle
  }

  // Marketplace caching with price volatility awareness
  async getMarketplaceListings(filters: any = {}): Promise<any[]> {
    const cacheKey = `${this.cachePrefix}marketplace:listings:${JSON.stringify(filters)}`
    
    const cached = await this.redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached)
    }

    const listings = await this.prisma.marketplaceListing.findMany({
      where: {
        status: 'ACTIVE',
        ...filters
      },
      include: {
        card: {
          include: {
            owner: { select: { username: true } }
          }
        },
        seller: { select: { username: true } },
        bids: {
          orderBy: { amount: 'desc' },
          take: 1,
          include: { bidder: { select: { username: true } } }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    // Cache marketplace data with shorter TTL due to price volatility
    await this.redis.setex(cacheKey, 30, JSON.stringify(listings))
    return listings
  }

  async cacheAuctionBid(auctionId: string, bid: any): Promise<void> {
    const cacheKey = `${this.cachePrefix}auction:bids:${auctionId}`
    
    // Store latest bid with very short TTL for real-time updates
    await this.redis.setex(`${cacheKey}:latest`, 10, JSON.stringify(bid))
    
    // Add to sorted set for bid history
    await this.redis.zadd(`${cacheKey}:history`, bid.amount, JSON.stringify(bid))
    await this.redis.expire(`${cacheKey}:history`, 3600)
  }

  async getLatestBid(auctionId: string): Promise<any> {
    const cacheKey = `${this.cachePrefix}auction:bids:${auctionId}:latest`
    const cached = await this.redis.get(cacheKey)
    
    if (cached) {
      return JSON.parse(cached)
    }

    const latestBid = await this.prisma.bid.findFirst({
      where: { 
        listing: { id: auctionId },
        status: 'PENDING'
      },
      orderBy: { amount: 'desc' },
      include: { bidder: { select: { username: true } } }
    })

    if (latestBid) {
      await this.cacheAuctionBid(auctionId, latestBid)
    }

    return latestBid
  }

  // User session and profile caching
  async cacheUserSession(userId: string, sessionData: any): Promise<void> {
    const cacheKey = `${this.cachePrefix}session:${userId}`
    await this.redis.setex(cacheKey, 1800, JSON.stringify(sessionData)) // 30 minutes
  }

  async getUserSession(userId: string): Promise<any> {
    const cacheKey = `${this.cachePrefix}session:${userId}`
    const cached = await this.redis.get(cacheKey)
    return cached ? JSON.parse(cached) : null
  }

  // Leaderboard caching with periodic updates
  async cacheLeaderboard(type: 'battle' | 'trading' | 'collection', data: any[]): Promise<void> {
    const cacheKey = `${this.cachePrefix}leaderboard:${type}`
    await this.redis.setex(cacheKey, 300, JSON.stringify(data)) // 5 minutes
  }

  async getLeaderboard(type: 'battle' | 'trading' | 'collection'): Promise<any[]> {
    const cacheKey = `${this.cachePrefix}leaderboard:${type}`
    const cached = await this.redis.get(cacheKey)
    
    if (cached) {
      return JSON.parse(cached)
    }

    // Generate leaderboard from database
    let leaderboard: any[] = []
    
    switch (type) {
      case 'battle':
        const battleStats = await this.prisma.user.findMany({
          select: {
            id: true,
            username: true,
            initiatedMABattles: { where: { status: 'COMPLETED' } },
            targetedMABattles: { where: { status: 'COMPLETED' } }
          },
          take: 100
        })
        
        leaderboard = battleStats.map(user => ({
          userId: user.id,
          username: user.username,
          battlesWon: user.initiatedMABattles.length + user.targetedMABattles.length,
          score: user.initiatedMABattles.length * 10 + user.targetedMABattles.length * 5
        })).sort((a, b) => b.score - a.score)
        break

      case 'trading':
        const tradingStats = await this.prisma.user.findMany({
          select: {
            id: true,
            username: true,
            tradingHistory: true
          },
          take: 100
        })
        
        leaderboard = tradingStats.map(user => ({
          userId: user.id,
          username: user.username,
          totalTrades: user.tradingHistory.length,
          volume: user.tradingHistory.reduce((sum, tx) => sum + tx.amount, 0)
        })).sort((a, b) => b.volume - a.volume)
        break
    }

    await this.cacheLeaderboard(type, leaderboard)
    return leaderboard
  }

  // Cache invalidation methods
  async invalidateCardCache(cardId: string): Promise<void> {
    const pattern = `${this.cachePrefix}card:${cardId}*`
    const keys = await this.redis.keys(pattern)
    if (keys.length > 0) {
      await this.redis.del(...keys)
    }
  }

  async invalidateBattleCache(battleId: string): Promise<void> {
    const patterns = [
      `${this.cachePrefix}battle:state:${battleId}*`,
      `${this.cachePrefix}battle:history:${battleId}*`
    ]
    
    for (const pattern of patterns) {
      const keys = await this.redis.keys(pattern)
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
    }
  }

  async invalidateMarketplaceCache(): Promise<void> {
    const pattern = `${this.cachePrefix}marketplace:*`
    const keys = await this.redis.keys(pattern)
    if (keys.length > 0) {
      await this.redis.del(...keys)
    }
  }

  // Bulk operations for performance
  async preloadBattleData(battleId: string, playerIds: string[]): Promise<void> {
    // Preload all battle-related data in parallel
    await Promise.all([
      this.getBattleState(battleId),
      this.getCardsForBattle(playerIds),
      ...playerIds.map(id => this.getUserSession(id))
    ])
  }

  // Health check
  async healthCheck(): Promise<{ prisma: boolean, redis: boolean }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`
      const prismaHealth = true
      
      await this.redis.ping()
      const redisHealth = true
      
      return { prisma: prismaHealth, redis: redisHealth }
    } catch (error) {
      console.error('Health check failed:', error)
      return { prisma: false, redis: false }
    }
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect()
    await this.redis.disconnect()
  }
}

// Singleton instance
export const prismaCacheService = new PrismaCacheService()
