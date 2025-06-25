// Cards API - Handles card discovery, filtering, and CRUD operations
import { NextRequest, NextResponse } from 'next/server'
import { mockDatabase } from '@/lib/db'
import { Card, CardFilters, PaginatedResponse } from '@/lib/db/schema'

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

    // Build filters
    const filters: CardFilters = {
      category: category || undefined,
      company: company || undefined,
      rarity,
      priceMin,
      priceMax,
      sortBy: sortBy as any,
      sortOrder
    }

    // Get cards from mock database
    const offset = (page - 1) * limit
    let allCards = Array.from(mockDatabase.cards.values())
    
    // Apply filters
    if (filters.category) {
      allCards = allCards.filter(card => 
        card.category.toLowerCase().includes(filters.category!.toLowerCase())
      )
    }
    
    if (filters.company) {
      allCards = allCards.filter(card => 
        card.company.toLowerCase().includes(filters.company!.toLowerCase())
      )
    }
    
    if (filters.rarity && filters.rarity.length > 0) {
      allCards = allCards.filter(card => 
        filters.rarity!.includes(card.rarity)
      )
    }
    
    if (filters.priceMin !== undefined) {
      allCards = allCards.filter(card => card.valuation >= filters.priceMin!)
    }
    
    if (filters.priceMax !== undefined) {
      allCards = allCards.filter(card => card.valuation <= filters.priceMax!)
    }
    
    if (search) {
      allCards = allCards.filter(card => 
        card.name.toLowerCase().includes(search.toLowerCase()) ||
        card.description.toLowerCase().includes(search.toLowerCase()) ||
        card.company.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    // Apply sorting
    allCards.sort((a, b) => {
      let aValue, bValue
      
      switch (filters.sortBy) {
        case 'price':
          aValue = a.valuation
          bValue = b.valuation
          break
        case 'rarity':
          const rarityOrder = { 'common': 1, 'uncommon': 2, 'rare': 3, 'epic': 4, 'legendary': 5 }
          aValue = rarityOrder[a.rarity as keyof typeof rarityOrder] || 0
          bValue = rarityOrder[b.rarity as keyof typeof rarityOrder] || 0
          break
        case 'popularity':
          aValue = a.volume24h || 0
          bValue = b.volume24h || 0
          break
        case 'recent':
        default:
          aValue = a.createdAt
          bValue = b.createdAt
      }
      
      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
    
    // Apply pagination
    const paginatedCards = allCards.slice(offset, offset + limit)

    const response: PaginatedResponse<Card> = {
      success: true,
      data: paginatedCards,
      pagination: {
        page,
        limit,
        total: allCards.length,
        totalPages: Math.ceil(allCards.length / limit)
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
    const requiredFields = ['name', 'description', 'imageUrl', 'rarity', 'category', 'company', 'valuation']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Create new card (mock implementation)
    const newCard: Partial<Card> = {
      id: `card_${Date.now()}`,
      name: body.name,
      description: body.description,
      imageUrl: body.imageUrl,
      rarity: body.rarity,
      category: body.category,
      company: body.company,
      valuation: body.valuation,
      marketCap: body.marketCap,
      volume24h: body.volume24h || 0,
      priceChange24h: body.priceChange24h || 0,
      attributes: body.attributes || [],
      metadata: body.metadata || {},
      ownerId: body.ownerId,
      isListed: body.isListed || false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

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
