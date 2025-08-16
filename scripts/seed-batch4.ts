import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Batch 4 sample data (auctions + trade offers) ...')

  // Users
  const [alice, bob] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'alice@example.com' },
      update: {},
      create: {
        email: 'alice@example.com',
        username: 'alice',
        firstName: 'Alice',
        lastName: 'Trader',
        eceBalance: 5000,
      },
    }),
    prisma.user.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: {
        email: 'bob@example.com',
        username: 'bob',
        firstName: 'Bob',
        lastName: 'Collector',
        eceBalance: 3500,
      },
    }),
  ])

  // Cards
  let cardA = await prisma.card.findFirst({ where: { name: 'OpenAI' } })
  if (!cardA) {
    cardA = await prisma.card.create({
      data: {
        name: 'OpenAI',
        description: 'AI research leader with foundation models',
        category: 'TECHNOLOGY',
        rarity: 'EPIC',
        company: 'OpenAI',
        currentPrice: 1200,
        ownerId: alice.id,
        imageUrl: '/images/cards/openai.png',
      },
    })
  } else {
    cardA = await prisma.card.update({
      where: { id: cardA.id },
      data: {
        ownerId: alice.id,
        currentPrice: 1200,
        category: 'TECHNOLOGY',
        rarity: 'EPIC',
        company: 'OpenAI',
      },
    })
  }

  let cardB = await prisma.card.findFirst({ where: { name: 'Tesla Motors' } })
  if (!cardB) {
    cardB = await prisma.card.create({
      data: {
        name: 'Tesla Motors',
        description: 'Electric vehicles and energy storage',
        category: 'AUTOMOTIVE',
        rarity: 'LEGENDARY',
        company: 'Tesla',
        currentPrice: 2200,
        ownerId: alice.id,
        imageUrl: '/images/cards/tesla.png',
      },
    })
  } else {
    cardB = await prisma.card.update({
      where: { id: cardB.id },
      data: {
        ownerId: alice.id,
        currentPrice: 2200,
        category: 'AUTOMOTIVE',
        rarity: 'LEGENDARY',
        company: 'Tesla',
      },
    })
  }

  let cardC = await prisma.card.findFirst({ where: { name: 'Netflix' } })
  if (!cardC) {
    cardC = await prisma.card.create({
      data: {
        name: 'Netflix',
        description: 'Streaming leader with global reach',
        category: 'ENTERTAINMENT',
        rarity: 'RARE',
        company: 'Netflix',
        currentPrice: 800,
        ownerId: bob.id,
        imageUrl: '/images/cards/netflix.png',
      },
    })
  } else {
    cardC = await prisma.card.update({
      where: { id: cardC.id },
      data: {
        ownerId: bob.id,
        currentPrice: 800,
        category: 'ENTERTAINMENT',
        rarity: 'RARE',
        company: 'Netflix',
      },
    })
  }

  // Auctions for Alice's cards
  const auctionA = await prisma.cardAuction.upsert({
    where: { cardId: cardA.id },
    update: {
      title: 'OpenAI Strategic Auction',
      description: 'Premium card auction for OpenAI',
      startPrice: 1000,
      reservePrice: 1100,
      currentBid: 1150,
      bidIncrement: 50,
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'ACTIVE',
      ownerId: alice.id,
    },
    create: {
      cardId: cardA.id,
      ownerId: alice.id,
      title: 'OpenAI Strategic Auction',
      description: 'Premium card auction for OpenAI',
      startPrice: 1000,
      reservePrice: 1100,
      currentBid: 1150,
      bidIncrement: 50,
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'ACTIVE',
    },
  })

  const auctionB = await prisma.cardAuction.upsert({
    where: { cardId: cardB.id },
    update: {
      title: 'Tesla Rare Auction',
      description: 'High demand Legendary card',
      startPrice: 2000,
      reservePrice: 2100,
      currentBid: 2300,
      bidIncrement: 100,
      endTime: new Date(Date.now() + 36 * 60 * 60 * 1000),
      status: 'ACTIVE',
      ownerId: alice.id,
    },
    create: {
      cardId: cardB.id,
      ownerId: alice.id,
      title: 'Tesla Rare Auction',
      description: 'High demand Legendary card',
      startPrice: 2000,
      reservePrice: 2100,
      currentBid: 2300,
      bidIncrement: 100,
      endTime: new Date(Date.now() + 36 * 60 * 60 * 1000),
      status: 'ACTIVE',
    },
  })

  console.log('🏦 Created/updated auctions:', auctionA.id, auctionB.id)

  // Trade Offer: Alice -> Bob (offer Netflix from Bob in exchange for OpenAI + 100 ECE from Alice)
  const tradeOffer = await prisma.tradeOffer.create({
    data: {
      senderId: alice.id,
      receiverId: bob.id,
      status: 'PENDING',
      message: 'Swap my OpenAI (EPIC) for your Netflix (RARE) + I add 100 ECE',
      eceFromSender: 100,
      items: {
        create: [
          { cardId: cardA.id, role: 'FROM_SENDER' },
          { cardId: cardC.id, role: 'FROM_RECEIVER' },
        ],
      },
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })

  console.log('🤝 Created trade offer:', tradeOffer.id)
  console.log('✅ Batch 4 seed complete')
}

main()
  .catch((e) => {
    console.error('❌ Seed error', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
