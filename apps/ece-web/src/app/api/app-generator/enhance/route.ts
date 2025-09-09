import { NextRequest, NextResponse } from 'next/server';
import { AppGenerationService } from '../../../../services/app-generation.service';
import { CodebaseViabilityService } from '../../../../services/codebase-viability.service';
import { ECESecurityMiddleware, ValidationSchemas } from '../../../../middleware/ece-security.middleware';
import { ECE_DEFAULT_BRANDING_SCHEMA } from '../../../../services/ece-branding.schema';

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
    
    // Input validation for codebase enhancement
    const validationResult = ValidationSchemas.codebaseViability.safeParse({
      codebaseUrl: body.projectDetails?.targetCodebaseUrl,
      branch: body.projectDetails?.branch,
      accessToken: body.projectDetails?.accessToken
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid codebase information',
          details: validationResult.error.issues,
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    // Perform codebase viability check
    const viabilityResult = await CodebaseViabilityService.checkViability(
      validationResult.data.codebaseUrl,
      {
        branch: validationResult.data.branch,
        accessToken: validationResult.data.accessToken
      }
    );

    if (!viabilityResult.isViable) {
      return NextResponse.json({
        success: false,
        error: viabilityResult.reason,
        code: 'CODEBASE_NOT_VIABLE',
        data: {
          viabilityScore: viabilityResult.score,
          analysis: viabilityResult.analysis,
          recommendations: {
            security: viabilityResult.analysis.security.recommendations,
            compatibility: viabilityResult.analysis.compatibility.recommendations,
            structure: viabilityResult.analysis.structure.recommendations,
            quality: viabilityResult.analysis.quality.recommendations
          }
        }
      }, { status: 400 });
    }

    // Create enhancement request
    const enhancementRequest = {
      orderId: body.orderId,
      userId: body.userId,
      walletAddress: body.walletAddress,
      orderType: 'CODEBASE_ENHANCEMENT' as const,
      projectDetails: {
        title: body.projectDetails.title,
        description: body.projectDetails.description,
        projectType: body.projectDetails.projectType,
        features: body.projectDetails.features || [],
        complexity: body.projectDetails.complexity || 1.0,
        timeline: body.projectDetails.timeline,
        requirements: body.projectDetails.requirements,
        enhancementTarget: body.projectDetails.enhancementTarget,
        targetCodebaseUrl: validationResult.data.codebaseUrl
      },
      brandingRequirements: ECE_DEFAULT_BRANDING_SCHEMA
    };

    // Perform codebase enhancement
    const result = await AppGenerationService.enhanceCodebase(enhancementRequest);

    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.error,
          code: 'ENHANCEMENT_FAILED'
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        enhancedApp: result.generatedApp,
        revisionTokens: result.revisionTokens,
        viabilityAnalysis: viabilityResult.analysis,
        enhancementPlan: viabilityResult.enhancementPlan,
        message: 'Codebase enhanced successfully with ECE integration'
      }
    });

  } catch (error) {
    console.error('Codebase enhancement error:', error);
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
  const codebaseUrl = searchParams.get('url');

  if (!codebaseUrl) {
    return NextResponse.json(
      { error: 'Codebase URL is required' },
      { status: 400 }
    );
  }

  try {
    // Security validation
    const security = await ECESecurityMiddleware.validateRequest(request, {
      auth: { required: false } // Allow public viability checks
    });
    if (!security.isValid) {
      return NextResponse.json(
        { error: security.error, code: 'SECURITY_VIOLATION' },
        { status: 403 }
      );
    }

    // Perform viability check
    const viabilityResult = await CodebaseViabilityService.checkViability(codebaseUrl);

    return NextResponse.json({
      success: true,
      data: {
        isViable: viabilityResult.isViable,
        score: viabilityResult.score,
        reason: viabilityResult.reason,
        analysis: viabilityResult.analysis,
        enhancementPlan: viabilityResult.enhancementPlan,
        recommendations: {
          immediate: [
            ...viabilityResult.analysis.security.recommendations.slice(0, 3),
            ...viabilityResult.analysis.structure.recommendations.slice(0, 2)
          ],
          suggested: [
            ...viabilityResult.analysis.compatibility.recommendations,
            ...viabilityResult.analysis.quality.recommendations
          ]
        }
      }
    });

  } catch (error) {
    console.error('Viability check error:', error);
    return NextResponse.json(
      { error: 'Failed to check codebase viability' },
      { status: 500 }
    );
  }
}
