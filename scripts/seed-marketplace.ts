import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Sample company data for marketplace
const companies = [
  {
    name: 'Tesla Motors',
    category: 'AUTOMOTIVE',
    description: 'Revolutionary electric vehicle and clean energy company leading the transition to sustainable transport.',
    rarity: 'LEGENDARY',
    level: 15,
    power: 950,
    marketCap: 800000000000,
    revenue: 96773000000,
    employees: 127855,
    founded: 2003,
    stockPrice: 248.50,
    priceChange: 5.2,
    ceo: 'Elon Musk',
    headquarters: 'Austin, TX',
    advantages: ['Market Leader in EVs', 'Supercharger Network', 'Autonomous Driving Tech', 'Vertical Integration'],
    weaknesses: ['High Valuation', 'Production Challenges', 'Regulatory Risks', 'CEO Volatility'],
    battlePower: 95,
    defensiveRating: 88,
    acquisitionPrice: 850000000000,
    recentNews: [
      'Q4 deliveries exceed expectations',
      'FSD beta expands to more users', 
      'New Gigafactory announced'
    ],
    battleHistory: { wins: 23, losses: 3, draws: 1 }
  },
  {
    name: 'OpenAI',
    category: 'TECHNOLOGY',
    description: 'Leading artificial intelligence research company developing cutting-edge AI systems and models.',
    rarity: 'EPIC',
    level: 12,
    power: 920,
    marketCap: 90000000000,
    revenue: 2000000000,
    employees: 1500,
    founded: 2015,
    stockPrice: 0,
    priceChange: 0,
    ceo: 'Sam Altman',
    headquarters: 'San Francisco, CA',
    advantages: ['GPT Dominance', 'First Mover Advantage', 'Strong Partnerships', 'Top Talent'],
    weaknesses: ['High Costs', 'Regulatory Pressure', 'Competition Rising', 'Monetization Challenges'],
    battlePower: 92,
    defensiveRating: 75,
    acquisitionPrice: 120000000000,
    recentNews: [
      'GPT-5 development announced',
      'New enterprise partnerships',
      'Funding round completed'
    ],
    battleHistory: { wins: 18, losses: 2, draws: 0 }
  },
  {
    name: 'Netflix',
    category: 'ENTERTAINMENT',
    description: 'Global streaming entertainment service with original content production and international expansion.',
    rarity: 'RARE',
    level: 8,
    power: 750,
    marketCap: 180000000000,
    revenue: 31616000000,
    employees: 12800,
    founded: 1997,
    stockPrice: 425.30,
    priceChange: -2.1,
    ceo: 'Reed Hastings',
    headquarters: 'Los Gatos, CA',
    advantages: ['Content Library', 'Global Reach', 'Original Productions', 'Data Analytics'],
    weaknesses: ['Increasing Competition', 'Content Costs', 'Market Saturation', 'Password Sharing'],
    battlePower: 78,
    defensiveRating: 82,
    acquisitionPrice: 200000000000,
    recentNews: [
      'Subscriber growth slows',
      'New password sharing rules',
      'International expansion'
    ],
    battleHistory: { wins: 15, losses: 8, draws: 2 }
  },
  {
    name: 'Shopify',
    category: 'TECHNOLOGY',
    description: 'Commerce platform providing the technology infrastructure for online stores and retail point-of-sale systems.',
    rarity: 'RARE',
    level: 10,
    power: 820,
    marketCap: 65000000000,
    revenue: 5600000000,
    employees: 12000,
    founded: 2006,
    stockPrice: 52.30,
    priceChange: -5.2,
    ceo: 'Tobi Lütke',
    headquarters: 'Ottawa, CA',
    advantages: ['E-commerce Platform', 'Developer Ecosystem', 'Small Business Focus', 'International Reach'],
    weaknesses: ['Competition from Amazon', 'Dependent on SMB Success', 'High Valuation Pressure', 'Merchant Churn'],
    battlePower: 75,
    defensiveRating: 78,
    acquisitionPrice: 75000000000,
    recentNews: [
      'Q4 merchant growth strong',
      'New AI features launched',
      'Partnership with major retailer'
    ],
    battleHistory: { wins: 12, losses: 6, draws: 1 }
  },
  {
    name: 'Coinbase',
    category: 'FINANCE',
    description: 'Leading cryptocurrency exchange platform providing digital asset trading and custody services.',
    rarity: 'EPIC',
    level: 11,
    power: 880,
    marketCap: 25000000000,
    revenue: 3100000000,
    employees: 4900,
    founded: 2012,
    stockPrice: 95.80,
    priceChange: 8.4,
    ceo: 'Brian Armstrong',
    headquarters: 'San Francisco, CA',
    advantages: ['Market Leader', 'Regulatory Compliance', 'Institutional Focus', 'Product Innovation'],
    weaknesses: ['Crypto Volatility', 'Regulatory Uncertainty', 'Competition Rising', 'Revenue Concentration'],
    battlePower: 82,
    defensiveRating: 85,
    acquisitionPrice: 35000000000,
    recentNews: [
      'Institutional adoption grows',
      'New derivative products',
      'International expansion'
    ],
    battleHistory: { wins: 14, losses: 4, draws: 0 }
  }
]

async function seedMarketplaceData() {
  console.log('🌱 Seeding marketplace data...')

  // Create a demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@ece.com' },
    update: {},
    create: {
      email: 'demo@ece.com',
      username: 'DemoTrader',
      firstName: 'Demo',
      lastName: 'User',
      eceBalance: 10000,
      reputation: 95,
      isAdmin: false
    }
  })

  console.log(`👤 Created demo user: ${demoUser.username}`)

  // Create company cards
  const cards = await Promise.all(
    companies.map(async (company) => {
      return await prisma.card.upsert({
        where: { name: company.name },
        update: {
          ...company,
          ownerId: demoUser.id
        },
        create: {
          ...company,
          ownerId: demoUser.id,
          imageUrl: `/api/placeholder/400/300?text=${encodeURIComponent(company.name)}`
        }
      })
    })
  )

  console.log(`🃏 Created ${cards.length} company cards`)

  // Create sample betting markets
  const markets = await Promise.all(
    cards.slice(0, 3).map(async (card, index) => {
      const metricTypes = ['REVENUE_GROWTH', 'USER_GROWTH', 'VALUATION_CHANGE']
      const metricType = metricTypes[index]
      
      let currentValue: number, predictionTarget: number, targetDirection: 'UP' | 'DOWN'
      
      switch (metricType) {
        case 'REVENUE_GROWTH':
          currentValue = card.revenue / 1000000000
          predictionTarget = currentValue * 1.15
          targetDirection = 'UP'
          break
        case 'USER_GROWTH':
          currentValue = card.employees * 1000
          predictionTarget = currentValue * 1.10
          targetDirection = 'UP'
          break
        case 'VALUATION_CHANGE':
          currentValue = card.stockPrice || 100
          predictionTarget = currentValue * 0.85
          targetDirection = 'DOWN'
          break
        default:
          currentValue = 100
          predictionTarget = 110
          targetDirection = 'UP'
      }

      return await prisma.bettingMarket.create({
        data: {
          cardId: card.id,
          title: `${card.name} ${metricType.replace('_', ' ')} Prediction`,
          description: `Will ${card.name} ${targetDirection === 'UP' ? 'exceed' : 'fall below'} ${predictionTarget.toFixed(1)} by end of quarter?`,
          metricType,
          currentValue,
          predictionTarget,
          targetDirection,
          odds: 2.0 + index * 0.5,
          totalPot: 1000 + index * 500,
          minimumBet: 10,
          endTime: new Date(Date.now() + (24 + index * 12) * 60 * 60 * 1000),
          status: 'ACTIVE',
          trendingScore: 90 - index * 10,
          volume24h: 500 + index * 250
        }
      })
    })
  )

  console.log(`🎯 Created ${markets.length} betting markets`)

  // Create sample auctions
  const auctions = await Promise.all(
    cards.slice(0, 2).map(async (card, index) => {
      return await prisma.cardAuction.create({
        data: {
          cardId: card.id,
          sellerId: demoUser.id,
          startPrice: 500 + index * 1000,
          currentBid: 750 + index * 1500,
          minBidIncrement: 25,
          reservePrice: 500 + index * 1000,
          instantBuyPrice: index === 0 ? 3500 : undefined,
          endTime: new Date(Date.now() + (12 + index * 6) * 60 * 60 * 1000),
          status: 'ACTIVE',
          totalBids: 5 + index * 3,
          priceChange24h: 5.5 + index * 10,
          volume24h: 2000 + index * 3000
        }
      })
    })
  )

  console.log(`🏆 Created ${auctions.length} card auctions`)

  // Create sample M&A battles
  if (cards.length >= 2) {
    const battle = await prisma.mABattle.create({
      data: {
        challengerId: cards[0].id,
        defenderId: cards[2].id, // Tesla vs Netflix
        creatorId: demoUser.id,
        status: 'VOTING',
        endTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours
      }
    })

    // Add some sample votes
    const sampleVotes = [
      { choice: 'CHALLENGER', amount: 100 },
      { choice: 'CHALLENGER', amount: 250 },
      { choice: 'DEFENDER', amount: 150 },
      { choice: 'CHALLENGER', amount: 200 },
      { choice: 'DEFENDER', amount: 175 }
    ]

    await Promise.all(
      sampleVotes.map(async (vote) => {
        return await prisma.mABattleVote.create({
          data: {
            battleId: battle.id,
            userId: demoUser.id,
            choice: vote.choice as 'CHALLENGER' | 'DEFENDER',
            amount: vote.amount
          }
        })
      })
    )

    console.log(`⚔️ Created M&A battle: ${cards[0].name} vs ${cards[2].name}`)
  }

  console.log('✅ Marketplace data seeding completed!')
}

// Execute seeding
seedMarketplaceData()
  .catch((e) => {
    console.error('❌ Error seeding marketplace data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
