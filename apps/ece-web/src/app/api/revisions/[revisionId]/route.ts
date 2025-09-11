import { NextRequest, NextResponse } from 'next/server';
import { RevisionApprovalService } from '../../../../../services/revision-approval.service';
import { ECESecurityMiddleware } from '../../../../../middleware/ece-security.middleware';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ revisionId: string }> }
) {
  try {
    const { params } = context;
    const { revisionId } = await params;
    // Security validation
    const security = await ECESecurityMiddleware.validateRequest(request);
    if (!security.isValid) {
      return NextResponse.json(
        { error: security.error, code: 'SECURITY_VIOLATION' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get revision status
    const status = await RevisionApprovalService.getRevisionStatus(params.revisionId, userId);

    if (!status) {
      return NextResponse.json(
        { error: 'Revision not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('Error getting revision status:', error);
    return NextResponse.json(
      { error: 'Failed to get revision status' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ revisionId: string }> }
) {
  try {
    const { params } = context;
    const { revisionId } = await params;
    // Security validation with developer role check
    const security = await ECESecurityMiddleware.validateRequest(request, {
      auth: { required: true, roles: ['DEVELOPER', 'ADMIN'] }
    });
    if (!security.isValid) {
      return NextResponse.json(
        { error: security.error, code: 'SECURITY_VIOLATION' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, data } = body;

    let result;
    switch (action) {
      case 'approve':
        result = await RevisionApprovalService.approveRevision(
          params.revisionId, 
          security.user.id
        );
        break;
      
      case 'start':
        result = await RevisionApprovalService.startRevisionWork(
          params.revisionId, 
          security.user.id
        );
        break;
      
      case 'update_progress':
        result = await RevisionApprovalService.updateRevisionProgress(
          params.revisionId,
          data
        );
        break;
      
      case 'complete':
        result = await RevisionApprovalService.completeRevision(
          params.revisionId,
          data.deliverables || []
        );
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Revision ${action} completed successfully`
    });

  } catch (error) {
    console.error('Error updating revision:', error);
    return NextResponse.json(
      { error: 'Failed to update revision' },
      { status: 500 }
    );
  }
}
