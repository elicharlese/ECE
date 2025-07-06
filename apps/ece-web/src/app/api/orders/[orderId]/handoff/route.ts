import { NextRequest, NextResponse } from 'next/server'

// Mock handoff storage
const mockHandoffData = new Map<string, {
  orderId: string
  status: 'READY_FOR_HANDOFF' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  githubRepo?: string
  vercelUrl?: string
  downloadUrl?: string
  portfolioCardId?: string
  createdAt: Date
  completedAt?: Date
  steps: {
    github_repo: 'pending' | 'in_progress' | 'completed' | 'error'
    vercel_deploy: 'pending' | 'in_progress' | 'completed' | 'error'
    assets_package: 'pending' | 'in_progress' | 'completed' | 'error'
    portfolio_card: 'pending' | 'in_progress' | 'completed' | 'error'
  }
}>()

// GET /api/orders/[orderId]/handoff - Get handoff status
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const params = await context.params
    const { orderId } = params
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      )
    }

    const handoffData = mockHandoffData.get(orderId)
    
    if (!handoffData) {
      return NextResponse.json(
        { success: false, error: 'Handoff data not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: handoffData
    })
  } catch (error) {
    console.error('Get Handoff Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch handoff data' },
      { status: 500 }
    )
  }
}

// POST /api/orders/[orderId]/handoff - Initiate handoff process
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const params = await context.params
    const { orderId } = params
    const body = await request.json()
    
    const { orderTitle, orderType, adminId } = body
    
    if (!orderId || !orderTitle || !orderType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: orderTitle, orderType' },
        { status: 400 }
      )
    }

    // Check if handoff already exists
    if (mockHandoffData.has(orderId)) {
      return NextResponse.json(
        { success: false, error: 'Handoff already initiated for this order' },
        { status: 400 }
      )
    }

    // Initialize handoff data
    const handoffData = {
      orderId,
      status: 'PROCESSING' as const,
      createdAt: new Date(),
      steps: {
        github_repo: 'pending' as const,
        vercel_deploy: 'pending' as const,
        assets_package: 'pending' as const,
        portfolio_card: 'pending' as const
      }
    }

    mockHandoffData.set(orderId, handoffData)

    // Start asynchronous handoff process
    processHandoff(orderId, orderTitle, orderType)

    return NextResponse.json({
      success: true,
      data: handoffData,
      message: 'Handoff process initiated successfully'
    })
  } catch (error) {
    console.error('Initiate Handoff Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to initiate handoff' },
      { status: 500 }
    )
  }
}

// Simulate the automated handoff process
async function processHandoff(orderId: string, orderTitle: string, orderType: string) {
  const handoffData = mockHandoffData.get(orderId)
  if (!handoffData) return

  try {
    // Step 1: Create GitHub Repository
    handoffData.steps.github_repo = 'in_progress'
    mockHandoffData.set(orderId, handoffData)
    
    await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate processing
    
    // Mock GitHub repo creation
    handoffData.githubRepo = `https://github.com/ece-platform/${orderTitle.toLowerCase().replace(/\s+/g, '-')}`
    handoffData.steps.github_repo = 'completed'
    mockHandoffData.set(orderId, handoffData)

    // Step 2: Deploy to Vercel
    handoffData.steps.vercel_deploy = 'in_progress'
    mockHandoffData.set(orderId, handoffData)
    
    await new Promise(resolve => setTimeout(resolve, 12000)) // Simulate deployment
    
    handoffData.vercelUrl = `https://${orderTitle.toLowerCase().replace(/\s+/g, '-')}.vercel.app`
    handoffData.steps.vercel_deploy = 'completed'
    mockHandoffData.set(orderId, handoffData)

    // Step 3: Package Assets
    handoffData.steps.assets_package = 'in_progress'
    mockHandoffData.set(orderId, handoffData)
    
    await new Promise(resolve => setTimeout(resolve, 4500)) // Simulate packaging
    
    handoffData.downloadUrl = `/api/orders/${orderId}/download`
    handoffData.steps.assets_package = 'completed'
    mockHandoffData.set(orderId, handoffData)

    // Step 4: Generate Portfolio Card
    handoffData.steps.portfolio_card = 'in_progress'
    mockHandoffData.set(orderId, handoffData)
    
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate card generation
    
    handoffData.portfolioCardId = `card_${orderId}`
    handoffData.steps.portfolio_card = 'completed'
    mockHandoffData.set(orderId, handoffData)

    // Mark as completed
    handoffData.status = 'COMPLETED'
    handoffData.completedAt = new Date()
    mockHandoffData.set(orderId, handoffData)

    console.log(`Handoff completed for order ${orderId}`)
  } catch (error) {
    console.error(`Handoff failed for order ${orderId}:`, error)
    handoffData.status = 'FAILED'
    mockHandoffData.set(orderId, handoffData)
  }
}

// PUT /api/orders/[orderId]/handoff - Update handoff status
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const params = await context.params
    const { orderId } = params
    const body = await request.json()
    
    const { status, step, stepStatus } = body
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      )
    }

    const handoffData = mockHandoffData.get(orderId)
    
    if (!handoffData) {
      return NextResponse.json(
        { success: false, error: 'Handoff data not found' },
        { status: 404 }
      )
    }

    // Update overall status
    if (status) {
      handoffData.status = status
      if (status === 'COMPLETED') {
        handoffData.completedAt = new Date()
      }
    }

    // Update specific step status
    if (step && stepStatus) {
      if (step in handoffData.steps) {
        handoffData.steps[step as keyof typeof handoffData.steps] = stepStatus
      }
    }

    mockHandoffData.set(orderId, handoffData)

    return NextResponse.json({
      success: true,
      data: handoffData,
      message: 'Handoff status updated successfully'
    })
  } catch (error) {
    console.error('Update Handoff Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update handoff status' },
      { status: 500 }
    )
  }
}
