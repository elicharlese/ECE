/**
 * Revision Approval Service
 * Manages the revision process for generated applications
 * Supports up to 3 free revisions + paid additional revisions
 * Includes multimedia support for revision requests
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface RevisionRequest {
  orderId: string;
  userId: string;
  walletAddress: string;
  revisionType: 'FREE' | 'PAID';
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  changes: Array<{
    type: 'FEATURE_ADD' | 'FEATURE_MODIFY' | 'FEATURE_REMOVE' | 'BUG_FIX' | 'DESIGN_CHANGE' | 'CONTENT_UPDATE';
    description: string;
    targetFile?: string;
    targetComponent?: string;
    estimatedEffort: number; // hours
  }>;
  multimedia: {
    images: Array<{
      url: string;
      description: string;
      type: 'MOCKUP' | 'REFERENCE' | 'SCREENSHOT' | 'DESIGN';
    }>;
    videos: Array<{
      url: string;
      description: string;
      type: 'WALKTHROUGH' | 'DEMO' | 'FEEDBACK' | 'TUTORIAL';
      duration: number; // seconds
    }>;
    audio: Array<{
      url: string;
      description: string;
      type: 'VOICEOVER' | 'FEEDBACK' | 'INSTRUCTIONS';
      duration: number; // seconds
    }>;
    documents: Array<{
      url: string;
      description: string;
      type: 'SPECIFICATION' | 'REQUIREMENTS' | 'WIREFRAMES' | 'NOTES';
    }>;
  };
}

export interface RevisionResponse {
  success: boolean;
  revisionId?: string;
  estimatedCompletionTime?: number; // hours
  totalCost?: number; // ECE tokens
  freeRevisionsRemaining?: number;
  error?: string;
  timeline: {
    phases: Array<{
      name: string;
      estimatedHours: number;
      description: string;
    }>;
    totalEstimate: number;
  };
}

export interface RevisionStatus {
  id: string;
  orderId: string;
  status: 'PENDING' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED' | 'REQUIRES_PAYMENT';
  progress: number; // 0-100
  currentPhase: string;
  estimatedCompletion: Date;
  cost: number;
  isPaid: boolean;
  completedChanges: string[];
  remainingChanges: string[];
  deliverables: Array<{
    type: 'CODE' | 'PREVIEW' | 'DOCUMENTATION';
    url: string;
    description: string;
  }>;
}

export class RevisionApprovalService {
  
  static async submitRevisionRequest(request: RevisionRequest): Promise<RevisionResponse> {
    try {
      // Get current order and revision history
      const order = await prisma.appOrder.findUnique({
        where: { id: request.orderId },
        include: {
          revisions: true,
          user: true
        }
      });

      if (!order) {
        return { success: false, error: 'Order not found' };
      }

      if (order.userId !== request.userId) {
        return { success: false, error: 'Unauthorized to request revisions for this order' };
      }

      // Count free revisions used
      const freeRevisionsUsed = order.revisions.filter(r => r.revisionType === 'FREE').length;
      const freeRevisionsRemaining = Math.max(0, 3 - freeRevisionsUsed);

      // Determine if this revision requires payment
      const requiresPayment = request.revisionType === 'PAID' || freeRevisionsRemaining === 0;
      
      // Calculate revision cost and timeline
      const costCalculation = await this.calculateRevisionCost(request, requiresPayment);
      
      if (requiresPayment) {
        // Check user balance for paid revisions
        if (order.user.eceBalance < costCalculation.totalCost) {
          return { 
            success: false, 
            error: `Insufficient ECE balance. Required: ${costCalculation.totalCost}, Available: ${order.user.eceBalance}` 
          };
        }
      }

      // Process multimedia uploads
      const processedMultimedia = await this.processMultimedia(request.multimedia, request.orderId);

      // Create revision record
      const revision = await prisma.revision.create({
        data: {
          orderId: request.orderId,
          userId: request.userId,
          revisionType: requiresPayment ? 'PAID' : 'FREE',
          description: request.description,
          priority: request.priority,
          status: requiresPayment ? 'REQUIRES_PAYMENT' : 'PENDING',
          estimatedHours: costCalculation.totalEstimate,
          estimatedCost: costCalculation.totalCost,
          changes: request.changes,
          multimedia: processedMultimedia,
          metadata: {
            submittedAt: new Date().toISOString(),
            freeRevisionsRemaining: requiresPayment ? freeRevisionsRemaining : freeRevisionsRemaining - 1
          }
        }
      });

      // If paid revision, deduct ECE balance
      if (requiresPayment && costCalculation.totalCost > 0) {
        await prisma.user.update({
          where: { id: request.userId },
          data: {
            eceBalance: {
              decrement: costCalculation.totalCost
            }
          }
        });

        // Record transaction
        await prisma.transaction.create({
          data: {
            userId: request.userId,
            type: 'REVISION_PAYMENT',
            amount: costCalculation.totalCost,
            description: `Revision request for order ${request.orderId}`,
            metadata: {
              orderId: request.orderId,
              revisionId: revision.id
            }
          }
        });

        // Update revision status to approved since payment is made
        await prisma.revision.update({
          where: { id: revision.id },
          data: { status: 'APPROVED' }
        });
      }

      // Send notification to development team
      await this.notifyDevelopmentTeam(revision.id, request);

      return {
        success: true,
        revisionId: revision.id,
        estimatedCompletionTime: costCalculation.totalEstimate,
        totalCost: costCalculation.totalCost,
        freeRevisionsRemaining: requiresPayment ? freeRevisionsRemaining : freeRevisionsRemaining - 1,
        timeline: {
          phases: costCalculation.phases,
          totalEstimate: costCalculation.totalEstimate
        }
      };

    } catch (error) {
      console.error('Revision request submission error:', error);
      return { 
        success: false, 
        error: 'Failed to submit revision request. Please try again.' 
      };
    }
  }

  static async getRevisionStatus(revisionId: string, userId: string): Promise<RevisionStatus | null> {
    try {
      const revision = await prisma.revision.findUnique({
        where: { id: revisionId },
        include: {
          order: true,
          deliverables: true
        }
      });

      if (!revision || revision.userId !== userId) {
        return null;
      }

      // Calculate progress based on completed vs remaining changes
      const totalChanges = Array.isArray(revision.changes) ? revision.changes.length : 0;
      const completedChanges = Array.isArray(revision.completedChanges) ? revision.completedChanges.length : 0;
      const progress = totalChanges > 0 ? Math.round((completedChanges / totalChanges) * 100) : 0;

      return {
        id: revision.id,
        orderId: revision.orderId,
        status: revision.status as any,
        progress,
        currentPhase: revision.currentPhase || 'Analysis',
        estimatedCompletion: revision.estimatedCompletion || new Date(Date.now() + (revision.estimatedHours * 60 * 60 * 1000)),
        cost: revision.estimatedCost,
        isPaid: revision.revisionType === 'PAID',
        completedChanges: Array.isArray(revision.completedChanges) ? revision.completedChanges : [],
        remainingChanges: this.calculateRemainingChanges(revision.changes, revision.completedChanges),
        deliverables: (revision.deliverables || []).map((d: any) => ({
          type: d.type,
          url: d.url,
          description: d.description
        }))
      };

    } catch (error) {
      console.error('Error getting revision status:', error);
      return null;
    }
  }

  static async approveRevision(revisionId: string, developerId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const revision = await prisma.revision.findUnique({
        where: { id: revisionId }
      });

      if (!revision) {
        return { success: false, error: 'Revision not found' };
      }

      if (revision.status !== 'PENDING') {
        return { success: false, error: 'Revision is not in pending status' };
      }

      await prisma.revision.update({
        where: { id: revisionId },
        data: {
          status: 'APPROVED',
          approvedBy: developerId,
          approvedAt: new Date(),
          currentPhase: 'Planning'
        }
      });

      // Notify user of approval
      await this.notifyUserOfApproval(revisionId);

      return { success: true };

    } catch (error) {
      console.error('Error approving revision:', error);
      return { success: false, error: 'Failed to approve revision' };
    }
  }

  static async startRevisionWork(revisionId: string, developerId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await prisma.revision.update({
        where: { id: revisionId },
        data: {
          status: 'IN_PROGRESS',
          startedAt: new Date(),
          currentPhase: 'Development',
          assignedDeveloper: developerId
        }
      });

      return { success: true };

    } catch (error) {
      console.error('Error starting revision work:', error);
      return { success: false, error: 'Failed to start revision work' };
    }
  }

  static async updateRevisionProgress(
    revisionId: string,
    update: {
      progress?: number;
      currentPhase?: string;
      completedChanges?: string[];
      deliverables?: Array<{ type: string; url: string; description: string }>;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const updateData: any = {
        updatedAt: new Date()
      };

      if (update.progress !== undefined) {
        updateData.progress = update.progress;
      }

      if (update.currentPhase) {
        updateData.currentPhase = update.currentPhase;
      }

      if (update.completedChanges) {
        updateData.completedChanges = update.completedChanges;
      }

      await prisma.revision.update({
        where: { id: revisionId },
        data: updateData
      });

      // Add deliverables if provided
      if (update.deliverables && update.deliverables.length > 0) {
        await prisma.revisionDeliverable.createMany({
          data: update.deliverables.map(d => ({
            revisionId,
            type: d.type,
            url: d.url,
            description: d.description
          }))
        });
      }

      return { success: true };

    } catch (error) {
      console.error('Error updating revision progress:', error);
      return { success: false, error: 'Failed to update revision progress' };
    }
  }

  static async completeRevision(revisionId: string, deliverables: Array<{ type: string; url: string; description: string }>): Promise<{ success: boolean; error?: string }> {
    try {
      await prisma.revision.update({
        where: { id: revisionId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          currentPhase: 'Completed',
          progress: 100
        }
      });

      // Add final deliverables
      if (deliverables.length > 0) {
        await prisma.revisionDeliverable.createMany({
          data: deliverables.map(d => ({
            revisionId,
            type: d.type,
            url: d.url,
            description: d.description
          }))
        });
      }

      // Notify user of completion
      await this.notifyUserOfCompletion(revisionId);

      return { success: true };

    } catch (error) {
      console.error('Error completing revision:', error);
      return { success: false, error: 'Failed to complete revision' };
    }
  }

  private static async calculateRevisionCost(request: RevisionRequest, isPaid: boolean): Promise<{
    totalCost: number;
    totalEstimate: number;
    phases: Array<{ name: string; estimatedHours: number; description: string }>;
  }> {
    let totalHours = 0;

    // Calculate hours for each change
    request.changes.forEach(change => {
      totalHours += change.estimatedEffort;
    });

    // Add complexity multipliers
    const complexityMultiplier = this.getComplexityMultiplier(request.changes);
    const priorityMultiplier = this.getPriorityMultiplier(request.priority);
    
    totalHours *= complexityMultiplier * priorityMultiplier;

    // Phase breakdown
    const phases = [
      {
        name: 'Analysis & Planning',
        estimatedHours: Math.ceil(totalHours * 0.2),
        description: 'Requirements analysis and planning'
      },
      {
        name: 'Development',
        estimatedHours: Math.ceil(totalHours * 0.6),
        description: 'Code changes and implementation'
      },
      {
        name: 'Testing & QA',
        estimatedHours: Math.ceil(totalHours * 0.15),
        description: 'Testing and quality assurance'
      },
      {
        name: 'Deployment',
        estimatedHours: Math.ceil(totalHours * 0.05),
        description: 'Deployment and final verification'
      }
    ];

    // Cost calculation (50 ECE per hour for paid revisions)
    const hourlyRate = 50;
    const totalCost = isPaid ? totalHours * hourlyRate : 0;

    return {
      totalCost: Math.ceil(totalCost),
      totalEstimate: Math.ceil(totalHours),
      phases
    };
  }

  private static getComplexityMultiplier(changes: any[]): number {
    const complexChanges = changes.filter(c => 
      c.type === 'FEATURE_ADD' || c.type === 'DESIGN_CHANGE'
    ).length;
    
    if (complexChanges > 5) return 1.5;
    if (complexChanges > 2) return 1.3;
    return 1.1;
  }

  private static getPriorityMultiplier(priority: string): number {
    switch (priority) {
      case 'URGENT': return 2.0;
      case 'HIGH': return 1.5;
      case 'MEDIUM': return 1.2;
      default: return 1.0;
    }
  }

  private static async processMultimedia(multimedia: any, orderId: string): Promise<any> {
    // Process and validate multimedia files
    // In a real implementation, this would:
    // 1. Validate file types and sizes
    // 2. Upload to secure storage (AWS S3, etc.)
    // 3. Generate thumbnails/previews
    // 4. Scan for malware
    // 5. Return processed URLs

    const processed = {
      images: multimedia.images.map((img: any) => ({
        ...img,
        processedUrl: img.url, // Would be actual processed URL
        thumbnail: img.url.replace('.jpg', '_thumb.jpg')
      })),
      videos: multimedia.videos.map((vid: any) => ({
        ...vid,
        processedUrl: vid.url, // Would be actual processed URL
        thumbnail: vid.url.replace('.mp4', '_thumb.jpg')
      })),
      audio: multimedia.audio.map((aud: any) => ({
        ...aud,
        processedUrl: aud.url // Would be actual processed URL
      })),
      documents: multimedia.documents.map((doc: any) => ({
        ...doc,
        processedUrl: doc.url // Would be actual processed URL
      }))
    };

    return processed;
  }

  private static calculateRemainingChanges(allChanges: any, completedChanges: any): string[] {
    const all = Array.isArray(allChanges) ? allChanges : [];
    const completed = Array.isArray(completedChanges) ? completedChanges : [];
    
    return all
      .filter((change: any) => !completed.includes(change.description))
      .map((change: any) => change.description);
  }

  private static async notifyDevelopmentTeam(revisionId: string, request: RevisionRequest): Promise<void> {
    // Send notification to development team
    // Could integrate with Slack, email, or internal notification system
    console.log(`New revision request ${revisionId} submitted for order ${request.orderId}`);
  }

  private static async notifyUserOfApproval(revisionId: string): Promise<void> {
    // Notify user that revision has been approved
    console.log(`Revision ${revisionId} has been approved`);
  }

  private static async notifyUserOfCompletion(revisionId: string): Promise<void> {
    // Notify user that revision has been completed
    console.log(`Revision ${revisionId} has been completed`);
  }

  static async getUserRevisionHistory(userId: string, limit = 10): Promise<RevisionStatus[]> {
    try {
      const revisions = await prisma.revision.findMany({
        where: { userId },
        include: {
          order: true,
          deliverables: true
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      });

      return revisions.map(revision => {
        const totalChanges = Array.isArray(revision.changes) ? revision.changes.length : 0;
        const completedChanges = Array.isArray(revision.completedChanges) ? revision.completedChanges.length : 0;
        const progress = totalChanges > 0 ? Math.round((completedChanges / totalChanges) * 100) : 0;

        return {
          id: revision.id,
          orderId: revision.orderId,
          status: revision.status as any,
          progress,
          currentPhase: revision.currentPhase || 'Analysis',
          estimatedCompletion: revision.estimatedCompletion || new Date(Date.now() + (revision.estimatedHours * 60 * 60 * 1000)),
          cost: revision.estimatedCost,
          isPaid: revision.revisionType === 'PAID',
          completedChanges: Array.isArray(revision.completedChanges) ? revision.completedChanges : [],
          remainingChanges: this.calculateRemainingChanges(revision.changes, revision.completedChanges),
          deliverables: (revision.deliverables || []).map((d: any) => ({
            type: d.type,
            url: d.url,
            description: d.description
          }))
        };
      });

    } catch (error) {
      console.error('Error getting user revision history:', error);
      return [];
    }
  }
}
