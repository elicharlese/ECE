import { NextRequest, NextResponse } from 'next/server';
import { AppGenerationService } from '../../services/app-generation.service';
import { ECESecurityMiddleware, ValidationSchemas } from '../../middleware/ece-security.middleware';
import { ECE_DEFAULT_BRANDING_SCHEMA } from '../../services/ece-branding.schema';

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
    const validationResult = ValidationSchemas.appOrder.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input data',
          details: validationResult.error.issues,
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    const { projectDetails, orderType, walletAddress } = validationResult.data;

    // Create app generation request
    const generationRequest = {
      orderId: body.orderId,
      userId: body.userId,
      walletAddress,
      orderType,
      projectDetails,
      brandingRequirements: ECE_DEFAULT_BRANDING_SCHEMA
    };

    // Generate application
    const result = await AppGenerationService.generateApplication(generationRequest);

    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.error,
          code: 'GENERATION_FAILED'
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        generatedApp: result.generatedApp,
        revisionTokens: result.revisionTokens,
        message: 'Application generated successfully'
      }
    });

  } catch (error) {
    console.error('App generation error:', error);
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
  const orderId = searchParams.get('orderId');
  const userId = searchParams.get('userId');

  if (!orderId || !userId) {
    return NextResponse.json(
      { error: 'Order ID and User ID are required' },
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

    // Get generation status (implement this method in AppGenerationService)
    // const status = await AppGenerationService.getGenerationStatus(orderId, userId);

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        status: 'IN_PROGRESS', // placeholder
        progress: 75,
        currentPhase: 'Code Generation',
        estimatedCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours
      }
    });

  } catch (error) {
    console.error('Error getting generation status:', error);
    return NextResponse.json(
      { error: 'Failed to get generation status' },
      { status: 500 }
    );
  }
}
