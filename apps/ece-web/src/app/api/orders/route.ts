import { NextRequest, NextResponse } from 'next/server'
import { AppOrder, OrderRevision, OrderCommunication, ApiResponse } from '@/lib/db/schema'
import { mockDatabase } from '@/lib/db'

// Mock pricing calculator
const calculateOrderCost = (timeline: 'RUSH_2_WEEKS' | 'STANDARD_1_MONTH', projectType: string): number => {
  const baseCosts = {
    'RUSH_2_WEEKS': 8000,     // $8,000 for 2 week project
    'STANDARD_1_MONTH': 4000  // $4,000 for 1 month project
  }
  
  // Complexity multipliers
  const complexityMultiplier = {
    'SAAS_DASHBOARD': 1.2,
    'ECOMMERCE_STORE': 1.3,
    'MOBILE_APP': 1.4,
    'WEB_APP': 1.2,
    'PORTFOLIO_SITE': 0.8,
    'LANDING_PAGE': 0.6,
    'CUSTOM': 1.5
  }
  
  const baseCost = baseCosts[timeline]
  const multiplier = complexityMultiplier[projectType as keyof typeof complexityMultiplier] || 1.0
  
  return Math.round(baseCost * multiplier)
}

// GET /api/orders - List user's orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user's orders from mock database
    let userOrders = Array.from(mockDatabase.appOrders?.values() || [])
      .filter(order => order.userId === userId)

    // Filter by status if provided
    if (status && status !== 'all') {
      userOrders = userOrders.filter(order => order.status === status)
    }

    // Sort by creation date (newest first)
    userOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    // Apply pagination
    const offset = (page - 1) * limit
    const paginatedOrders = userOrders.slice(offset, offset + limit)

    const response: ApiResponse<AppOrder[]> = {
      success: true,
      data: paginatedOrders
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Orders GET Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { 
      userId, 
      projectType, 
      title, 
      description, 
      timeline,
      requirements 
    } = body

    if (!userId || !projectType || !title || !description || !timeline) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate project type
    const validProjectTypes = [
      'SAAS_DASHBOARD', 'PORTFOLIO_SITE', 'ECOMMERCE_STORE', 
      'LANDING_PAGE', 'MOBILE_APP', 'WEB_APP', 'CUSTOM'
    ]
    
    if (!validProjectTypes.includes(projectType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project type' },
        { status: 400 }
      )
    }

    // Validate timeline
    if (!['RUSH_2_WEEKS', 'STANDARD_1_MONTH'].includes(timeline)) {
      return NextResponse.json(
        { success: false, error: 'Invalid timeline' },
        { status: 400 }
      )
    }

    // Calculate cost
    const estimatedCost = calculateOrderCost(timeline, projectType)

    // Check user's ECE balance (mock validation)
    const user = mockDatabase.users.get(userId)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.eceBalance < estimatedCost) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Insufficient ECE balance. Required: ${estimatedCost} ECE, Available: ${user.eceBalance} ECE` 
        },
        { status: 400 }
      )
    }

    // Create new order
    const newOrder: AppOrder = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      projectType,
      title,
      description,
      requirements: requirements || {},
      timeline,
      estimatedCost,
      currency: 'ECE',
      status: 'PENDING',
      priority: 'STANDARD',
      progressPercentage: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Initialize mock database if needed
    if (!mockDatabase.appOrders) {
      mockDatabase.appOrders = new Map()
    }

    // Save order to mock database
    mockDatabase.appOrders.set(newOrder.id, newOrder)

    // Deduct ECE from user's balance (escrow)
    user.eceBalance -= estimatedCost
    mockDatabase.users.set(userId, user)

    // Create initial communication record
    const initialCommunication: OrderCommunication = {
      id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderId: newOrder.id,
      userId,
      messageType: 'SYSTEM_ALERT',
      subject: 'Order Created Successfully',
      message: `Your order "${title}" has been created and is pending review. We'll begin work shortly and keep you updated on progress.`,
      isFromAdmin: true,
      read: false,
      important: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    if (!mockDatabase.orderCommunications) {
      mockDatabase.orderCommunications = new Map()
    }
    mockDatabase.orderCommunications.set(initialCommunication.id, initialCommunication)

    const response: ApiResponse<AppOrder> = {
      success: true,
      data: newOrder,
      message: 'Order created successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Orders POST Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

// PUT /api/orders/[id] - Update order status (for users: cancel, request revision)
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    const body = await request.json()
    
    const { action, userId, data } = body

    if (!orderId || !action || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Get order from mock database
    const order = mockDatabase.appOrders?.get(orderId)
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Verify user owns this order
    if (order.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    switch (action) {
      case 'cancel':
        if (['PENDING', 'APPROVED'].includes(order.status)) {
          order.status = 'CANCELLED'
          order.updatedAt = new Date()
          
          // Refund ECE to user
          const user = mockDatabase.users.get(userId)
          if (user) {
            user.eceBalance += order.estimatedCost
            mockDatabase.users.set(userId, user)
          }
          
          mockDatabase.appOrders!.set(orderId, order)
          
          return NextResponse.json({
            success: true,
            data: order,
            message: 'Order cancelled successfully'
          })
        } else {
          return NextResponse.json(
            { success: false, error: 'Order cannot be cancelled at this stage' },
            { status: 400 }
          )
        }

      case 'request_revision':
        if (!data?.title || !data?.description) {
          return NextResponse.json(
            { success: false, error: 'Revision title and description are required' },
            { status: 400 }
          )
        }

        // Create revision request
        const revision: OrderRevision = {
          id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          orderId,
          userId,
          revisionNumber: (mockDatabase.orderRevisions?.size || 0) + 1,
          title: data.title,
          description: data.description,
          status: 'PENDING',
          createdAt: new Date(),
          updatedAt: new Date()
        }

        if (!mockDatabase.orderRevisions) {
          mockDatabase.orderRevisions = new Map()
        }
        mockDatabase.orderRevisions.set(revision.id, revision)

        order.status = 'REVISION_REQUESTED'
        order.updatedAt = new Date()
        mockDatabase.appOrders!.set(orderId, order)

        return NextResponse.json({
          success: true,
          data: { order, revision },
          message: 'Revision request submitted successfully'
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Orders PUT Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
