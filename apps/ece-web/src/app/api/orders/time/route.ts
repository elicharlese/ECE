import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../../generated/prisma';

const prisma = new PrismaClient();

// Get time tracking for an order
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const walletAddress = searchParams.get('walletAddress');

    if (!orderId || !walletAddress) {
      return NextResponse.json({ error: 'Order ID and wallet address required' }, { status: 400 });
    }

    // Verify user
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify order ownership
    const order = await prisma.appOrder.findFirst({
      where: {
        id: orderId,
        userId: user.id
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found or access denied' }, { status: 404 });
    }

    const timeTracking = await prisma.orderTimeTracking.findMany({
      where: { orderId },
      orderBy: { startedAt: 'desc' }
    });

    // Calculate totals
    const totalTimeSpent = timeTracking.reduce((total, entry) => {
      if (entry.endedAt) {
        const duration = Math.floor((entry.endedAt.getTime() - entry.startedAt.getTime()) / (1000 * 60)); // minutes
        return total + (entry.actualDuration || duration);
      }
      return total + (entry.timeSpent || 0);
    }, 0);

    return NextResponse.json({
      success: true,
      timeTracking,
      summary: {
        totalEntries: timeTracking.length,
        totalTimeSpent, // in minutes
        totalTimeSpentHours: Math.round((totalTimeSpent / 60) * 100) / 100
      }
    });

  } catch (error) {
    console.error('Get time tracking error:', error);
    return NextResponse.json({ 
      error: 'Internal server error fetching time tracking' 
    }, { status: 500 });
  }
}

// Start time tracking for an order phase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      orderId, 
      phaseType, 
      assignedUserId,
      plannedDuration,
      walletAddress 
    } = body;

    if (!orderId || !phaseType || !walletAddress) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Verify user
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify order ownership
    const order = await prisma.appOrder.findFirst({
      where: {
        id: orderId,
        userId: user.id
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found or access denied' }, { status: 404 });
    }

    // Check if there's already an active time tracking session for this phase
    const activeSession = await prisma.orderTimeTracking.findFirst({
      where: {
        orderId,
        phaseType,
        endedAt: null
      }
    });

    if (activeSession) {
      return NextResponse.json({ 
        error: 'Time tracking already active for this phase',
        activeSession 
      }, { status: 400 });
    }

    // Create time tracking entry
    const timeTracking = await prisma.orderTimeTracking.create({
      data: {
        orderId,
        phaseType,
        assignedUserId,
        plannedDuration,
        startedAt: new Date(),
        timeSpent: 0
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Time tracking started successfully',
      timeTracking
    });

  } catch (error) {
    console.error('Start time tracking error:', error);
    return NextResponse.json({ 
      error: 'Internal server error starting time tracking' 
    }, { status: 500 });
  }
}

// Stop time tracking for a session
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      trackingId, 
      timeSpent,
      notes,
      walletAddress 
    } = body;

    if (!trackingId || !walletAddress) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Verify user
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find time tracking entry and verify order ownership
    const timeTracking = await prisma.orderTimeTracking.findUnique({
      where: { id: trackingId },
      include: { order: true }
    });

    if (!timeTracking) {
      return NextResponse.json({ error: 'Time tracking entry not found' }, { status: 404 });
    }

    if (timeTracking.order.userId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (timeTracking.endedAt) {
      return NextResponse.json({ error: 'Time tracking already ended' }, { status: 400 });
    }

    const endedAt = new Date();
    const actualDuration = timeSpent || Math.floor((endedAt.getTime() - timeTracking.startedAt.getTime()) / (1000 * 60)); // minutes

    // Update time tracking entry
    const updatedTracking = await prisma.orderTimeTracking.update({
      where: { id: trackingId },
      data: {
        endedAt,
        actualDuration,
        timeSpent: (timeTracking.timeSpent || 0) + actualDuration
      }
    });

    // Update order status based on phase completion
    await updateOrderPhaseStatus(timeTracking.orderId, timeTracking.phaseType);

    return NextResponse.json({
      success: true,
      message: 'Time tracking stopped successfully',
      timeTracking: updatedTracking,
      duration: actualDuration
    });

  } catch (error) {
    console.error('Stop time tracking error:', error);
    return NextResponse.json({ 
      error: 'Internal server error stopping time tracking' 
    }, { status: 500 });
  }
}

// Helper function to update order status based on phase completion
async function updateOrderPhaseStatus(orderId: string, phaseType: string) {
  try {
    const order = await prisma.appOrder.findUnique({
      where: { id: orderId }
    });

    if (!order) return;

    // Define phase progression
    const phaseProgression = {
      'PLANNING': 'APPROVED',
      'DESIGN': 'IN_PROGRESS', 
      'DEVELOPMENT': 'REVIEW',
      'TESTING': 'REVIEW',
      'DEPLOYMENT': 'COMPLETED',
      'REVIEW': 'COMPLETED'
    };

    const newStatus = phaseProgression[phaseType];
    if (newStatus && order.status !== 'COMPLETED') {
      await prisma.appOrder.update({
        where: { id: orderId },
        data: { 
          status: newStatus,
          updatedAt: new Date()
        }
      });
    }
  } catch (error) {
    console.error('Error updating order phase status:', error);
  }
}
