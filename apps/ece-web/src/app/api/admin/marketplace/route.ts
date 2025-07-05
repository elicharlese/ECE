import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    if (action === 'seed-marketplace') {
      // Clean existing data first (be careful in production!)
      await prisma.bettingMarket.deleteMany()
      await prisma.auction.deleteMany()
      await prisma.battle.deleteMany()
      await prisma.transaction.deleteMany()
      await prisma.card.deleteMany()
      await prisma.company.deleteMany()

      // Create companies
      const companies = await Promise.all([
        // Tesla
        prisma.company.create({
          data: {
            name: 'Tesla, Inc.',
            symbol: 'TSLA',
            description: 'Electric vehicles and clean energy company',
            industry: 'Automotive',
            marketCap: 800000000000,
            currentPrice: 250.50,
            logoUrl: '/companies/tesla.png',
            headquarters: 'Austin, Texas',
            foundedYear: 2003,
            employees: 127855,
            revenue: 96773000000,
            isPublic: true,
            metrics: {
              currentPrice: 250.50,
              marketCap: 800000000000,
              peRatio: 65.2,
              eps: 3.84,
              volume: 125000000,
              dayChange: 2.5,
              dayChangePercent: 1.01,
              week52High: 299.29,
              week52Low: 138.80,
              beta: 2.11,
              dividendYield: 0.0,
              avgVolume: 89000000
            }
          }
        }),

        // OpenAI
        prisma.company.create({
          data: {
            name: 'OpenAI',
            symbol: 'OPENAI',
            description: 'AI research and deployment company',
            industry: 'Technology',
            marketCap: 86000000000,
            currentPrice: 0,
            logoUrl: '/companies/openai.png',
            headquarters: 'San Francisco, California',
            foundedYear: 2015,
            employees: 770,
            revenue: 2000000000,
            isPublic: false,
            metrics: {
              currentPrice: 0,
              marketCap: 86000000000,
              peRatio: 0,
              eps: 0,
              volume: 0,
              dayChange: 0,
              dayChangePercent: 0,
              week52High: 0,
              week52Low: 0,
              beta: 0,
              dividendYield: 0.0,
              avgVolume: 0
            }
          }
        }),

        // Netflix
        prisma.company.create({
          data: {
            name: 'Netflix, Inc.',
            symbol: 'NFLX',
            description: 'Streaming entertainment service',
            industry: 'Entertainment',
            marketCap: 193000000000,
            currentPrice: 445.20,
            logoUrl: '/companies/netflix.png',
            headquarters: 'Los Gatos, California',
            foundedYear: 1997,
            employees: 13000,
            revenue: 31616000000,
            isPublic: true,
            metrics: {
              currentPrice: 445.20,
              marketCap: 193000000000,
              peRatio: 34.8,
              eps: 12.80,
              volume: 3500000,
              dayChange: -5.80,
              dayChangePercent: -1.29,
              week52High: 485.30,
              week52Low: 344.73,
              beta: 1.15,
              dividendYield: 0.0,
              avgVolume: 4200000
            }
          }
        }),

        // Shopify
        prisma.company.create({
          data: {
            name: 'Shopify Inc.',
            symbol: 'SHOP',
            description: 'E-commerce platform for businesses',
            industry: 'Technology',
            marketCap: 89000000000,
            currentPrice: 72.15,
            logoUrl: '/companies/shopify.png',
            headquarters: 'Ottawa, Ontario',
            foundedYear: 2006,
            employees: 10000,
            revenue: 5600000000,
            isPublic: true,
            metrics: {
              currentPrice: 72.15,
              marketCap: 89000000000,
              peRatio: 156.8,
              eps: 0.46,
              volume: 18500000,
              dayChange: 3.25,
              dayChangePercent: 4.71,
              week52High: 91.57,
              week52Low: 48.56,
              beta: 1.84,
              dividendYield: 0.0,
              avgVolume: 12000000
            }
          }
        }),

        // Coinbase
        prisma.company.create({
          data: {
            name: 'Coinbase Global, Inc.',
            symbol: 'COIN',
            description: 'Cryptocurrency exchange platform',
            industry: 'Financial Services',
            marketCap: 55000000000,
            currentPrice: 218.90,
            logoUrl: '/companies/coinbase.png',
            headquarters: 'San Francisco, California',
            foundedYear: 2012,
            employees: 3730,
            revenue: 3149000000,
            isPublic: true,
            metrics: {
              currentPrice: 218.90,
              marketCap: 55000000000,
              peRatio: -24.5,
              eps: -8.94,
              volume: 8200000,
              dayChange: 12.30,
              dayChangePercent: 5.95,
              week52High: 283.48,
              week52Low: 53.10,
              beta: 3.47,
              dividendYield: 0.0,
              avgVolume: 9500000
            }
          }
        })
      ])

      // Create cards for each company
      const cards = []
      for (const company of companies) {
        const companyCards = await Promise.all([
          // Common card
          prisma.card.create({
            data: {
              companyId: company.id,
              rarity: 'COMMON',
              tier: 1,
              metadataUri: `https://api.example.com/cards/${company.symbol}/common`,
              currentValue: Math.floor(company.currentPrice * 0.1),
              performance: Math.random() * 20 - 10, // -10 to +10
              isActive: true,
              attributes: {
                attack: Math.floor(Math.random() * 50) + 25,
                defense: Math.floor(Math.random() * 50) + 25,
                special: Math.floor(Math.random() * 30) + 10,
                synergy: ['tech', 'growth']
              }
            }
          }),

          // Rare card
          prisma.card.create({
            data: {
              companyId: company.id,
              rarity: 'RARE',
              tier: 2,
              metadataUri: `https://api.example.com/cards/${company.symbol}/rare`,
              currentValue: Math.floor(company.currentPrice * 0.25),
              performance: Math.random() * 30 - 15, // -15 to +15
              isActive: true,
              attributes: {
                attack: Math.floor(Math.random() * 70) + 40,
                defense: Math.floor(Math.random() * 70) + 40,
                special: Math.floor(Math.random() * 50) + 25,
                synergy: ['tech', 'innovation', 'growth']
              }
            }
          }),

          // Epic card (only for some companies)
          ...(Math.random() > 0.5 ? [
            prisma.card.create({
              data: {
                companyId: company.id,
                rarity: 'EPIC',
                tier: 3,
                metadataUri: `https://api.example.com/cards/${company.symbol}/epic`,
                currentValue: Math.floor(company.currentPrice * 0.5),
                performance: Math.random() * 40 - 20, // -20 to +20
                isActive: true,
                attributes: {
                  attack: Math.floor(Math.random() * 90) + 60,
                  defense: Math.floor(Math.random() * 90) + 60,
                  special: Math.floor(Math.random() * 70) + 40,
                  synergy: ['tech', 'innovation', 'growth', 'disruption']
                }
              }
            })
          ] : [])
        ])
        cards.push(...companyCards)
      }

      // Create betting markets
      const bettingMarkets = await Promise.all([
        prisma.bettingMarket.create({
          data: {
            companyId: companies[0].id, // Tesla
            title: 'Will Tesla stock hit $300 by end of month?',
            description: 'Bet on whether TSLA will reach $300 per share by the end of this month',
            marketType: 'PRICE_TARGET',
            targetPrice: 300,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            isActive: true,
            totalPool: 50000,
            yesPool: 28000,
            noPool: 22000,
            yesOdds: 0.64,
            noOdds: 0.44,
            minimumBet: 10,
            maximumBet: 5000,
            conditions: {
              type: 'price_target',
              target: 300,
              direction: 'above'
            }
          }
        }),

        prisma.bettingMarket.create({
          data: {
            companyId: companies[1].id, // OpenAI
            title: 'Will OpenAI go public in 2024?',
            description: 'Prediction market for OpenAI IPO timing',
            marketType: 'EVENT',
            expiresAt: new Date('2024-12-31'),
            isActive: true,
            totalPool: 125000,
            yesPool: 45000,
            noPool: 80000,
            yesOdds: 0.36,
            noOdds: 0.64,
            minimumBet: 25,
            maximumBet: 10000,
            conditions: {
              type: 'event',
              event: 'ipo_announcement',
              deadline: '2024-12-31'
            }
          }
        }),

        prisma.bettingMarket.create({
          data: {
            companyId: companies[2].id, // Netflix
            title: 'Netflix Q4 subscriber growth > 5%?',
            description: 'Will Netflix add more than 5% new subscribers in Q4?',
            marketType: 'PERFORMANCE',
            expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
            isActive: true,
            totalPool: 75000,
            yesPool: 35000,
            noPool: 40000,
            yesOdds: 0.47,
            noOdds: 0.53,
            minimumBet: 15,
            maximumBet: 3000,
            conditions: {
              type: 'metric',
              metric: 'subscriber_growth',
              target: 5,
              unit: 'percent'
            }
          }
        })
      ])

      // Create auctions
      const auctions = await Promise.all([
        prisma.auction.create({
          data: {
            cardId: cards[1].id, // Tesla rare card
            startingBid: cards[1].currentValue,
            currentBid: cards[1].currentValue + 50,
            bidIncrement: 25,
            endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            isActive: true,
            bidCount: 3,
            watchers: 12
          }
        }),

        prisma.auction.create({
          data: {
            cardId: cards[4].id, // Netflix rare card  
            startingBid: cards[4].currentValue,
            currentBid: cards[4].currentValue + 100,
            bidIncrement: 50,
            endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
            isActive: true,
            bidCount: 7,
            watchers: 25
          }
        })
      ])

      // Create M&A battles
      const battles = await Promise.all([
        prisma.battle.create({
          data: {
            acquirerCompanyId: companies[0].id, // Tesla
            targetCompanyId: companies[3].id, // Shopify
            title: 'Tesla vs Shopify: E-commerce Acquisition Battle',
            description: 'Will Tesla acquire Shopify to expand their direct-to-consumer capabilities?',
            battleType: 'ACQUISITION',
            endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
            isActive: true,
            totalVotes: 1250,
            acquirerVotes: 720,
            targetVotes: 530,
            entryFee: 100,
            prizePool: 125000,
            conditions: {
              type: 'acquisition_likelihood',
              factors: ['market_synergy', 'financial_capacity', 'strategic_fit'],
              voting_period: 14
            }
          }
        }),

        prisma.battle.create({
          data: {
            acquirerCompanyId: companies[4].id, // Coinbase
            targetCompanyId: companies[1].id, // OpenAI
            title: 'Coinbase vs OpenAI: Crypto-AI Fusion Battle',
            description: 'Could Coinbase acquire OpenAI to lead the crypto-AI revolution?',
            battleType: 'MERGER',
            endsAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days
            isActive: true,
            totalVotes: 890,
            acquirerVotes: 420,
            targetVotes: 470,
            entryFee: 250,
            prizePool: 222500,
            conditions: {
              type: 'merger_probability',
              factors: ['technology_synergy', 'market_timing', 'regulatory_environment'],
              voting_period: 21
            }
          }
        })
      ])

      // Create sample transactions
      const sampleTransactions = await Promise.all([
        prisma.transaction.create({
          data: {
            userId: 'user_sample_1',
            type: 'BET_PLACED',
            amount: 500,
            eceAmount: 500,
            description: 'Bet on Tesla $300 target - YES',
            reference: bettingMarkets[0].id,
            status: 'COMPLETED'
          }
        }),

        prisma.transaction.create({
          data: {
            userId: 'user_sample_2',
            type: 'AUCTION_BID',
            amount: 75,
            eceAmount: 75,
            description: 'Bid on Tesla Rare Card',
            reference: auctions[0].id,
            status: 'COMPLETED'
          }
        }),

        prisma.transaction.create({
          data: {
            userId: 'user_sample_3',
            type: 'BATTLE_ENTRY',
            amount: 100,
            eceAmount: 100,
            description: 'Entered Tesla vs Shopify battle',
            reference: battles[0].id,
            status: 'COMPLETED'
          }
        }),

        prisma.transaction.create({
          data: {
            userId: 'user_sample_1',
            type: 'CARD_PURCHASE',
            amount: 150,
            eceAmount: 150,
            description: 'Purchased Netflix Common Card',
            reference: cards[3].id,
            status: 'COMPLETED'
          }
        })
      ])

      return NextResponse.json({
        success: true,
        message: 'Marketplace seeded successfully',
        data: {
          companies: companies.length,
          cards: cards.length,
          bettingMarkets: bettingMarkets.length,
          auctions: auctions.length,
          battles: battles.length,
          transactions: sampleTransactions.length
        }
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 })

  } catch (error) {
    console.error('Marketplace seeding error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to seed marketplace data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  if (!action) {
    return NextResponse.json({
      success: false,
      error: 'Action parameter required'
    }, { status: 400 })
  }

  try {
    switch (action) {
      case 'marketplace-stats':
        const stats = await Promise.all([
          prisma.company.count(),
          prisma.card.count(),
          prisma.bettingMarket.count({ where: { isActive: true } }),
          prisma.auction.count({ where: { isActive: true } }),
          prisma.battle.count({ where: { isActive: true } }),
          prisma.transaction.count(),
          prisma.transaction.aggregate({
            _sum: { eceAmount: true }
          })
        ])

        return NextResponse.json({
          success: true,
          data: {
            companies: stats[0],
            cards: stats[1],
            activeBettingMarkets: stats[2],
            activeAuctions: stats[3],
            activeBattles: stats[4],
            totalTransactions: stats[5],
            totalVolume: stats[6]._sum.eceAmount || 0
          }
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
