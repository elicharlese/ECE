import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, MilestoneStatus } from '../../../../../generated/prisma';

const prisma = new PrismaClient();

// Get milestones for an order
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

    const milestones = await prisma.orderMilestone.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({
      success: true,
      milestones
    });

  } catch (error) {
    console.error('Get milestones error:', error);
    return NextResponse.json({ 
      error: 'Internal server error fetching milestones' 
    }, { status: 500 });
  }
}

// Create a new milestone for an order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      orderId, 
      milestoneType, 
      title, 
      description, 
      plannedDate,
      estimatedDuration,
      walletAddress 
    } = body;

    if (!orderId || !milestoneType || !title || !walletAddress) {
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

    // Create milestone
    const milestone = await prisma.orderMilestone.create({
      data: {
        orderId,
        milestoneType,
        title,
        description,
        plannedDate: plannedDate ? new Date(plannedDate) : null,
        estimatedDuration,
        status: MilestoneStatus.PENDING
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Milestone created successfully',
      milestone
    });

  } catch (error) {
    console.error('Create milestone error:', error);
    return NextResponse.json({ 
      error: 'Internal server error creating milestone' 
    }, { status: 500 });
  }
}

// Update milestone status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      milestoneId, 
      status, 
      actualDate, 
      completedBy, 
      completionNotes,
      walletAddress 
    } = body;

    if (!milestoneId || !status || !walletAddress) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Verify user
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find milestone and verify order ownership
    const milestone = await prisma.orderMilestone.findUnique({
      where: { id: milestoneId },
      include: { order: true }
    });

    if (!milestone) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
    }

    if (milestone.order.userId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Update milestone
    const updateData: any = {
      status: status as MilestoneStatus
    };

    if (actualDate) updateData.actualDate = new Date(actualDate);
    if (completedBy) updateData.completedBy = completedBy;
    if (completionNotes) updateData.completionNotes = completionNotes;

    // If completing milestone, update order progress
    if (status === MilestoneStatus.COMPLETED && milestone.status !== MilestoneStatus.COMPLETED) {
      await updateOrderProgress(milestone.orderId);
    }

    const updatedMilestone = await prisma.orderMilestone.update({
      where: { id: milestoneId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      message: 'Milestone updated successfully',
      milestone: updatedMilestone
    });

  } catch (error) {
    console.error('Update milestone error:', error);
    return NextResponse.json({ 
      error: 'Internal server error updating milestone' 
    }, { status: 500 });
  }
}

// Helper function to update order progress based on completed milestones
async function updateOrderProgress(orderId: string) {
  try {
    const milestones = await prisma.orderMilestone.findMany({
      where: { orderId }
    });

    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(m => m.status === MilestoneStatus.COMPLETED).length;
    
    const progressPercentage = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    await prisma.appOrder.update({
      where: { id: orderId },
      data: { progressPercentage }
    });
  } catch (error) {
    console.error('Error updating order progress:', error);
  }
}
