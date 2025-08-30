import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const rarity = searchParams.get('rarity')
    const sortBy = searchParams.get('sortBy') || 'ending-soon'
    const limit = parseInt(searchParams.get('limit') || '20')

    let whereClause: any = {
      status: 'ACTIVE',
      endTime: {
        gt: new Date()
      }
    }

    if (rarity && rarity !== 'all') {
      whereClause.card = {
        rarity: rarity
      }
    }

    let orderBy: any = {}
    switch (sortBy) {
      case 'ending-soon':
        orderBy = { endTime: 'asc' }
        break
      case 'price-high':
        orderBy = { currentBid: 'desc' }
        break
      case 'price-low':
        orderBy = { currentBid: 'asc' }
        break
      case 'most-bids':
        orderBy = { bidCount: 'desc' }
        break
      case 'trending':
        orderBy = { viewCount: 'desc' }
        break
      default:
        orderBy = { endTime: 'asc' }
    }

    const auctions = await prisma.cardAuction.findMany({
      where: whereClause,
      orderBy,
      take: limit,
      include: {
        card: {
          select: {
            name: true,
            category: true,
            rarity: true,
            imageUrl: true,
            description: true,
            stats: true
          }
        },
        owner: {
          select: {
            username: true
          }
        },
        _count: {
          select: {
            bids: true,
            watchers: true
          }
        }
      }
    })

    const enrichedAuctions = auctions.map((auction: any) => ({
      ...auction,
      timeLeft: auction.endTime.getTime() - Date.now(),
      cardName: auction.card.name,
      cardCategory: auction.card.category,
      cardRarity: auction.card.rarity,
      cardDescription: auction.card.description,
      sellerName: auction.owner.username,
      totalBids: auction._count.bids,
      watchers: auction._count.watchers
    }))

    return NextResponse.json({
      success: true,
      auctions: enrichedAuctions
    })

  } catch (error) {
    console.error('Error fetching card auctions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch card auctions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { auctionId, amount, type } = await request.json()

    if (!auctionId || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid bid parameters' },
        { status: 400 }
      )
    }

    // Check if auction exists and is active
    const auction = await prisma.cardAuction.findUnique({
      where: { id: auctionId },
      include: { 
        card: true,
        owner: true
      }
    })

    if (!auction || auction.status !== 'ACTIVE' || auction.endTime <= new Date()) {
      return NextResponse.json(
        { success: false, error: 'Auction not available for bidding' },
        { status: 400 }
      )
    }

    if (auction.ownerId === user.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot bid on your own auction' },
        { status: 400 }
      )
    }

    // Check user balance
    const userBalance = await prisma.user.findUnique({
      where: { id: user.id },
      select: { eceBalance: true }
    })

    if (!userBalance || userBalance.eceBalance < amount) {
      return NextResponse.json(
        { success: false, error: 'Insufficient ECE balance' },
        { status: 400 }
      )
    }

    if (type === 'instant_buy') {
      return NextResponse.json(
        { success: false, error: 'Instant buy is not supported for auctions' },
        { status: 400 }
      )
    }

    // Regular bid
    const minAllowed = auction.currentBid != null
      ? auction.currentBid + auction.bidIncrement
      : auction.startPrice

    if (amount < minAllowed) {
      return NextResponse.json(
        { success: false, error: `Bid must be at least ${minAllowed} ECE` },
        { status: 400 }
      )
    }

    // Create bid and update auction
    const result = await prisma.$transaction(async (tx: any) => {
      // Create the bid
      const bid = await tx.auctionBid.create({
        data: {
          auctionId,
          bidderId: user.id,
          bidAmount: amount
        }
      })

      // Update auction current bid and bidCount
      await tx.cardAuction.update({
        where: { id: auctionId },
        data: {
          currentBid: amount,
          bidCount: { increment: 1 }
        }
      })

      return bid
    })

    return NextResponse.json({
      success: true,
      bid: result,
      message: `Successfully placed bid of ${amount} ECE on ${auction.card.name}`
    })

  } catch (error) {
    console.error('Error processing auction action:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process auction action' },
      { status: 500 }
    )
  }
}
