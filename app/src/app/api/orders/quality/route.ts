import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get quality checks for an order
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

    const qualityChecks = await prisma.orderQualityCheck.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({
      success: true,
      qualityChecks
    });

  } catch (error) {
    console.error('Get quality checks error:', error);
    return NextResponse.json({ 
      error: 'Internal server error fetching quality checks' 
    }, { status: 500 });
  }
}

// Create a quality check for an order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      orderId, 
      checkType, 
      checkName, 
      description, 
      criteria,
      automated = false,
      walletAddress 
    } = body;

    if (!orderId || !checkType || !checkName || !walletAddress) {
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

    // Create quality check
    const qualityCheck = await prisma.orderQualityCheck.create({
      data: {
        orderId,
        checkType,
        checkName,
        description,
        criteria,
        automated,
        status: QualityStatus.PENDING
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Quality check created successfully',
      qualityCheck
    });

  } catch (error) {
    console.error('Create quality check error:', error);
    return NextResponse.json({ 
      error: 'Internal server error creating quality check' 
    }, { status: 500 });
  }
}

// Update quality check status and results
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      checkId, 
      status, 
      score, 
      reviewedBy, 
      reviewNotes,
      walletAddress 
    } = body;

    if (!checkId || !status || !walletAddress) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Verify user
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find quality check and verify order ownership
    const qualityCheck = await prisma.orderQualityCheck.findUnique({
      where: { id: checkId },
      include: { order: true }
    });

    if (!qualityCheck) {
      return NextResponse.json({ error: 'Quality check not found' }, { status: 404 });
    }

    if (qualityCheck.order.userId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Update quality check
    const updateData: any = {
      status: status as QualityStatus
    };

    if (score !== undefined) updateData.score = score;
    if (reviewedBy) updateData.reviewedBy = reviewedBy;
    if (reviewNotes) updateData.reviewNotes = reviewNotes;
    if (status === QualityStatus.PASSED || status === QualityStatus.FAILED || status === QualityStatus.WAIVED) {
      updateData.reviewDate = new Date();
    }

    const updatedCheck = await prisma.orderQualityCheck.update({
      where: { id: checkId },
      data: updateData
    });

    // If this is a critical quality check that affects order status
    if (status === QualityStatus.FAILED) {
      await handleFailedQualityCheck(qualityCheck.orderId);
    }

    return NextResponse.json({
      success: true,
      message: 'Quality check updated successfully',
      qualityCheck: updatedCheck
    });

  } catch (error) {
    console.error('Update quality check error:', error);
    return NextResponse.json({ 
      error: 'Internal server error updating quality check' 
    }, { status: 500 });
  }
}

// Helper function to handle failed quality checks
async function handleFailedQualityCheck(orderId: string) {
  try {
    // Check if all quality checks are complete
    const allChecks = await prisma.orderQualityCheck.findMany({
      where: { orderId }
    });

    const passedChecks = allChecks.filter(check => 
      check.status === QualityStatus.PASSED || check.status === QualityStatus.WAIVED
    );

    const failedChecks = allChecks.filter(check => 
      check.status === QualityStatus.FAILED
    );

    // If there are failed checks, update order status
    if (failedChecks.length > 0) {
      await prisma.appOrder.update({
        where: { id: orderId },
        data: { 
          status: 'REVISION_REQUESTED',
          updatedAt: new Date()
        }
      });

      // Create notification for user
      const order = await prisma.appOrder.findUnique({
        where: { id: orderId },
        include: { user: true }
      });

      if (order) {
        await prisma.notification.create({
          data: {
            userId: order.userId,
            type: 'ORDER_UPDATE',
            title: 'Quality Check Failed',
            message: `Quality check failed for order "${order.title}". Please review and request revisions.`,
            data: {
              orderId,
              failedChecks: failedChecks.length,
              totalChecks: allChecks.length
            }
          }
        });
      }
    }
  } catch (error) {
    console.error('Error handling failed quality check:', error);
  }
}
