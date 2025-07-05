import { NextRequest, NextResponse } from 'next/server'
import { AppOrder, OrderRevision, OrderCommunication, OrderDeliverable, ApiResponse } from '@/lib/db/schema'
import { mockDatabase } from '@/lib/db'
import { sampleOrders, sampleStats } from '@/lib/sample-data'

// Admin authentication check
function isAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  // In production, validate JWT token and check admin role
  return authHeader === 'Bearer admin_token_demo'
}

// GET /api/admin/orders - Get all orders for admin dashboard
export async function GET(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const projectType = searchParams.get('projectType')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Get all orders from mock database
    let allOrders = Array.from(mockDatabase.appOrders?.values() || [])
    
    // If no orders in mock database, use sample data for demonstration
    if (allOrders.length === 0) {
      allOrders = sampleOrders as any[]
    }

    // Apply filters
    if (status && status !== 'all') {
      allOrders = allOrders.filter(order => order.status === status)
    }

    if (priority && priority !== 'all') {
      allOrders = allOrders.filter(order => order.priority === priority)
    }

    if (projectType && projectType !== 'all') {
      allOrders = allOrders.filter(order => order.projectType === projectType)
    }

    // Sort orders
    allOrders.sort((a, b) => {
      const aValue = (a as any)[sortBy]
      const bValue = (b as any)[sortBy]
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    // Apply pagination
    const offset = (page - 1) * limit
    const paginatedOrders = allOrders.slice(offset, offset + limit)

    // Calculate stats for dashboard
    const stats = allOrders.length > 0 ? {
      total: allOrders.length,
      pending: allOrders.filter(o => o.status === 'PENDING').length,
      inProgress: allOrders.filter(o => o.status === 'IN_PROGRESS').length,
      completed: allOrders.filter(o => o.status === 'COMPLETED').length,
      revenue: allOrders
        .filter(o => o.status === 'COMPLETED')
        .reduce((sum, o) => sum + (o.actualCost || o.estimatedCost), 0),
      avgCompletionTime: 14 // Mock value - would calculate from data
    } : sampleStats

    const response = {
      success: true,
      data: paginatedOrders,
      pagination: {
        page,
        limit,
        total: allOrders.length,
        totalPages: Math.ceil(allOrders.length / limit)
      },
      stats
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Admin Orders GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/orders - Update order status and progress
export async function PUT(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { orderId, action, data } = body

    if (!orderId || !action) {
      return NextResponse.json(
        { error: 'Order ID and action are required' },
        { status: 400 }
      )
    }

    // Get order from mock database
    const order = mockDatabase.appOrders.get(orderId)
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    switch (action) {
      case 'update_status':
        if (!data?.status) {
          return NextResponse.json(
            { error: 'Status is required' },
            { status: 400 }
          )
        }

        order.status = data.status
        order.updatedAt = new Date()

        if (data.progressPercentage !== undefined) {
          order.progressPercentage = data.progressPercentage
        }

        if (data.currentMilestone) {
          order.currentMilestone = data.currentMilestone
        }

        mockDatabase.appOrders.set(orderId, order)

        // Create progress update communication
        const progressComm: OrderCommunication = {
          id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          orderId,
          userId: order.userId,
          messageType: 'PROGRESS_UPDATE',
          subject: 'Project Status Update',
          message: data.message || `Your project status has been updated to: ${data.status}`,
          isFromAdmin: true,
          read: false,
          important: data.status === 'COMPLETED',
          createdAt: new Date(),
          updatedAt: new Date()
        }

        mockDatabase.orderCommunications.set(progressComm.id, progressComm)

        return NextResponse.json({
          success: true,
          data: order,
          message: 'Order status updated successfully'
        })

      case 'assign_admin':
        if (!data?.adminId) {
          return NextResponse.json(
            { error: 'Admin ID is required' },
            { status: 400 }
          )
        }

        order.assignedAdminId = data.adminId
        order.updatedAt = new Date()
        mockDatabase.appOrders.set(orderId, order)

        return NextResponse.json({
          success: true,
          data: order,
          message: 'Admin assigned successfully'
        })

      case 'update_deliverables':
        if (!data?.deliverables || !Array.isArray(data.deliverables)) {
          return NextResponse.json(
            { error: 'Deliverables array is required' },
            { status: 400 }
          )
        }

        // Create or update deliverables
        data.deliverables.forEach((deliverable: any) => {
          const newDeliverable: OrderDeliverable = {
            id: deliverable.id || `del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            orderId,
            type: deliverable.type,
            title: deliverable.title,
            description: deliverable.description,
            url: deliverable.url,
            filePath: deliverable.filePath,
            status: deliverable.status,
            delivered: deliverable.delivered || false,
            createdAt: new Date(),
            updatedAt: new Date()
          }

          mockDatabase.orderDeliverables.set(newDeliverable.id, newDeliverable)
        })

        // Update order delivery fields
        if (data.githubRepo) order.githubRepo = data.githubRepo
        if (data.vercelLink) order.vercelLink = data.vercelLink
        if (data.downloadLink) order.downloadLink = data.downloadLink

        order.updatedAt = new Date()
        mockDatabase.appOrders.set(orderId, order)

        return NextResponse.json({
          success: true,
          data: order,
          message: 'Deliverables updated successfully'
        })

      case 'complete_order':
        order.status = 'COMPLETED'
        order.progressPercentage = 100
        order.deliveryDate = new Date()
        order.updatedAt = new Date()

        // Release payment (move from escrow to completed)
        if (data?.finalCost) {
          order.actualCost = data.finalCost
        }

        mockDatabase.appOrders.set(orderId, order)

        // Create completion notification
        const completionComm: OrderCommunication = {
          id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          orderId,
          userId: order.userId,
          messageType: 'DELIVERY_NOTIFICATION',
          subject: 'Project Completed! 🎉',
          message: `Congratulations! Your project "${order.title}" has been completed and is ready for delivery. Please review the deliverables and let us know if you need any adjustments.`,
          isFromAdmin: true,
          read: false,
          important: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        mockDatabase.orderCommunications.set(completionComm.id, completionComm)

        return NextResponse.json({
          success: true,
          data: order,
          message: 'Order marked as completed'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Admin Orders PUT error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/orders - Admin actions (communicate, create deliverables, etc.)
export async function POST(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, orderId, data } = body

    if (!action || !orderId) {
      return NextResponse.json(
        { error: 'Action and order ID are required' },
        { status: 400 }
      )
    }

    // Verify order exists
    const order = mockDatabase.appOrders.get(orderId)
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    switch (action) {
      case 'send_message':
        if (!data?.message) {
          return NextResponse.json(
            { error: 'Message is required' },
            { status: 400 }
          )
        }

        const message: OrderCommunication = {
          id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          orderId,
          userId: order.userId,
          messageType: data.messageType || 'MESSAGE',
          subject: data.subject,
          message: data.message,
          isFromAdmin: true,
          attachments: data.attachments,
          read: false,
          important: data.important || false,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        mockDatabase.orderCommunications.set(message.id, message)

        return NextResponse.json({
          success: true,
          data: message,
          message: 'Message sent successfully'
        })

      case 'respond_to_revision':
        if (!data?.revisionId || !data?.response) {
          return NextResponse.json(
            { error: 'Revision ID and response are required' },
            { status: 400 }
          )
        }

        const revision = mockDatabase.orderRevisions.get(data.revisionId)
        if (!revision) {
          return NextResponse.json(
            { error: 'Revision not found' },
            { status: 404 }
          )
        }

        revision.adminResponse = data.response
        revision.adminId = data.adminId || 'admin_001'
        revision.status = data.approved ? 'APPROVED' : 'REJECTED'
        revision.updatedAt = new Date()

        mockDatabase.orderRevisions.set(data.revisionId, revision)

        // Update order status based on revision response
        if (data.approved) {
          order.status = 'IN_PROGRESS'
        } else {
          order.status = 'REVIEW'
        }
        order.updatedAt = new Date()
        mockDatabase.appOrders.set(orderId, order)

        return NextResponse.json({
          success: true,
          data: { revision, order },
          message: 'Revision response sent successfully'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Admin Orders POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
