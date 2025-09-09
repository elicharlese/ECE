import { NextRequest, NextResponse } from 'next/server';
import { RevisionApprovalService } from '../../../../services/revision-approval.service';
import { ECESecurityMiddleware, ValidationSchemas } from '../../../../middleware/ece-security.middleware';

export async function POST(request: NextRequest) {
  try {
    // Security validation
    const security = await ECESecurityMiddleware.validateRequest(request);
    if (!security.isValid) {
      return NextResponse.json(
        { error: security.error, code: 'SECURITY_VIOLATION' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Input validation
    const validationResult = ValidationSchemas.revisionRequest.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid revision request data',
          details: validationResult.error.issues,
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    // Submit revision request
    const result = await RevisionApprovalService.submitRevisionRequest(validationResult.data);

    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.error,
          code: 'REVISION_SUBMISSION_FAILED'
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        revisionId: result.revisionId,
        estimatedCompletionTime: result.estimatedCompletionTime,
        totalCost: result.totalCost,
        freeRevisionsRemaining: result.freeRevisionsRemaining,
        timeline: result.timeline,
        message: result.totalCost > 0 
          ? `Paid revision submitted successfully. Cost: ${result.totalCost} ECE tokens`
          : 'Free revision submitted successfully'
      }
    });

  } catch (error) {
    console.error('Revision submission error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const limit = searchParams.get('limit');

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }

  try {
    // Security validation
    const security = await ECESecurityMiddleware.validateRequest(request);
    if (!security.isValid) {
      return NextResponse.json(
        { error: security.error, code: 'SECURITY_VIOLATION' },
        { status: 403 }
      );
    }

    // Get user revision history
    const revisions = await RevisionApprovalService.getUserRevisionHistory(
      userId, 
      limit ? parseInt(limit) : 10
    );

    return NextResponse.json({
      success: true,
      data: {
        revisions,
        total: revisions.length,
        message: 'Revision history retrieved successfully'
      }
    });

  } catch (error) {
    console.error('Error getting revision history:', error);
    return NextResponse.json(
      { error: 'Failed to get revision history' },
      { status: 500 }
    );
  }
}
