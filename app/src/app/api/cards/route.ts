// Cards API - Handles card discovery, filtering, and CRUD operations
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const company = searchParams.get('company')
    const rarity = searchParams.get('rarity')?.split(',')
    const priceMin = searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined
    const priceMax = searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
    const search = searchParams.get('search')

    // Build where clause for Prisma
    const where: Prisma.CardWhereInput = {}
    
    if (category) {
      // category is an enum; only filter if it matches a valid value
      where.category = category as any
    }
    
    if (company) {
      where.company = {
        contains: company,
        mode: 'insensitive'
      }
    }
    
    if (rarity && rarity.length > 0) {
      where.rarity = { in: rarity as any }
    }
    
    if (priceMin !== undefined || priceMax !== undefined) {
      where.currentPrice = {}
      if (priceMin !== undefined) {
        where.currentPrice.gte = priceMin
      }
      if (priceMax !== undefined) {
        where.currentPrice.lte = priceMax
      }
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Build orderBy clause
    let orderBy: Prisma.CardOrderByWithRelationInput = {}
    switch (sortBy) {
      case 'price':
        orderBy = { currentPrice: sortOrder }
        break
      case 'rarity':
        orderBy = { rarity: sortOrder }
        break
      case 'recent':
      default:
        orderBy = { createdAt: sortOrder }
    }
    
    // Get paginated cards from database
    const offset = (page - 1) * limit
    
    const [cards, totalCount] = await Promise.all([
      prisma.card.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit,
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      }),
      prisma.card.count({ where })
    ])

    const response = {
      success: true,
      data: cards,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Cards API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'rarity', 'category', 'currentPrice', 'ownerId']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Create new card in database
    const newCard = await prisma.card.create({
      data: {
        name: body.name,
        description: body.description || null,
        imageUrl: body.imageUrl || null,
        rarity: body.rarity,
        category: body.category,
        company: body.company || null,
        currentPrice: body.currentPrice,
        metadata: body.metadata || {},
        stats: body.stats || {},
        ownerId: body.ownerId
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: newCard,
      message: 'Card created successfully'
    })
  } catch (error) {
    console.error('Create Card Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create card' },
      { status: 500 }
    )
  }
}
