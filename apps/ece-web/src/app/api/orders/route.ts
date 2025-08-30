import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Prisma, OrderStatus } from '@prisma/client'

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
    const statusParam = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Build where clause
    const where: Prisma.AppOrderWhereInput = {
      userId
    }
    
    // Filter by status if provided and valid
    if (statusParam && statusParam !== 'all' && (Object.values(OrderStatus) as string[]).includes(statusParam)) {
      where.status = statusParam as OrderStatus
    }

    // Get paginated orders from database
    const offset = (page - 1) * limit
    
    const [orders, totalCount] = await Promise.all([
      prisma.appOrder.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          revisions: {
            orderBy: { createdAt: 'desc' },
            take: 5
          },
          communications: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      }),
      prisma.appOrder.count({ where })
    ])

    const response = {
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
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

    // Check user's ECE balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { eceBalance: true }
    })
    
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

    // Use a transaction to create order, deduct balance, and create communication
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create new order
      const newOrder = await tx.appOrder.create({
        data: {
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
          progressPercentage: 0
        },
        include: {
          user: {
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

      // Deduct ECE from user's balance (escrow)
      await tx.user.update({
        where: { id: userId },
        data: {
          eceBalance: {
            decrement: estimatedCost
          }
        }
      })

      // Create initial communication record
      const initialCommunication = await tx.orderCommunication.create({
        data: {
          orderId: newOrder.id,
          userId,
          messageType: 'SYSTEM_ALERT',
          subject: 'Order Created Successfully',
          message: `Your order "${title}" has been created and is pending review. We'll begin work shortly and keep you updated on progress.`,
          isFromAdmin: true,
          read: false,
          important: true
        }
      })

      return { newOrder, initialCommunication }
    })

    const response = {
      success: true,
      data: result.newOrder,
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

    // Get order from database
    const order = await prisma.appOrder.findFirst({
      where: {
        id: orderId,
        userId
      }
    })
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found or unauthorized' },
        { status: 404 }
      )
    }

    switch (action) {
      case 'cancel': {
        if (['PENDING', 'APPROVED'].includes(order.status)) {
          // Use transaction to update order and refund balance
          const updatedOrder = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // Update order status
            const updated = await tx.appOrder.update({
              where: { id: orderId },
              data: {
                status: 'CANCELLED'
              },
              include: {
                user: {
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
            
            // Refund ECE to user
            await tx.user.update({
              where: { id: userId },
              data: {
                eceBalance: {
                  increment: order.estimatedCost
                }
              }
            })
            
            return updated
          })
          
          return NextResponse.json({
            success: true,
            data: updatedOrder,
            message: 'Order cancelled successfully'
          })
        } else {
          return NextResponse.json(
            { success: false, error: 'Order cannot be cancelled at this stage' },
            { status: 400 }
          )
        }
      }

      case 'request_revision': {
        if (!data?.title || !data?.description) {
          return NextResponse.json(
            { success: false, error: 'Revision title and description are required' },
            { status: 400 }
          )
        }

        // Use transaction to create revision and update order
        const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
          // Get revision count for this order
          const revisionCount = await tx.orderRevision.count({
            where: { orderId }
          })
          
          // Create revision request
          const revision = await tx.orderRevision.create({
            data: {
              orderId,
              userId,
              revisionNumber: revisionCount + 1,
              title: data.title,
              description: data.description,
              status: 'PENDING'
            }
          })

          // Update order status
          const updatedOrder = await tx.appOrder.update({
            where: { id: orderId },
            data: {
              status: 'REVISION_REQUESTED'
            },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  firstName: true,
                  lastName: true,
                  email: true
                }
              },
              revisions: {
                orderBy: { createdAt: 'desc' },
                take: 5
              }
            }
          })
          
          return { order: updatedOrder, revision }
        })

        return NextResponse.json({
          success: true,
          data: result,
          message: 'Revision request submitted successfully'
        })
      }

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
