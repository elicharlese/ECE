'use client';

import { EnterpriseSSO } from '../enterprise/sso.service';
import { EnterpriseAPIGateway } from '../enterprise/api-gateway.service';
import { SocialFeaturesService } from '../social/social-features.service';
import { GitHubMCPService } from '../mcp/github-mcp.service';

export interface OrderStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  estimatedTime: string;
  dependencies: string[];
  data?: any;
}

export interface OrderFlow {
  id: string;
  userId: string;
  type: 'app_development' | 'trading_bot' | 'integration' | 'custom';
  status: 'draft' | 'submitted' | 'in_progress' | 'completed' | 'failed';
  steps: OrderStep[];
  metadata: {
    repositoryUrl?: string;
    requirements?: string;
    budget?: number;
    timeline?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  };
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

/**
 * Linear Order Flow Service
 * Orchestrates the complete order-to-delivery process
 * Integrates all Batch 2 services into a seamless workflow
 */
export class LinearOrderFlowService {
  private ssoService: SSOService;
  private apiGateway: EnterpriseAPIGateway;
  private socialService: SocialFeaturesService;
  private githubService: GitHubMCPService;
  
  private orders: Map<string, OrderFlow> = new Map();
  private activeConnections: Map<string, WebSocket> = new Map();

  constructor() {
    this.ssoService = new SSOService();
    this.apiGateway = new EnterpriseAPIGateway();
    this.socialService = new SocialFeaturesService();
    this.githubService = new GitHubMCPService();
  }

  /**
   * Step 1: Repository Selection & Analysis
   */
  async initializeOrderFlow(userId: string, type: OrderFlow['type']): Promise<string> {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const orderFlow: OrderFlow = {
      id: orderId,
      userId,
      type,
      status: 'draft',
      steps: this.generateOrderSteps(type),
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.orders.set(orderId, orderFlow);
    
    // Track order creation in social feed
    await this.socialService.createActivity({
      userId,
      type: 'order_created',
      content: `Started new ${type.replace('_', ' ')} order`,
      metadata: { orderId, orderType: type }
    });

    return orderId;
  }

  /**
   * Step 2: Requirements & Configuration
   */
  async configureOrder(orderId: string, configuration: {
    repositoryUrl?: string;
    requirements: string;
    budget?: number;
    timeline?: string;
    priority?: OrderFlow['metadata']['priority'];
  }): Promise<boolean> {
    const order = this.orders.get(orderId);
    if (!order) throw new Error('Order not found');

    // Update order metadata
    order.metadata = { ...order.metadata, ...configuration };
    order.updatedAt = new Date();

    // Update step status
    const configStep = order.steps.find(step => step.id === 'configuration');
    if (configStep) {
      configStep.status = 'completed';
      configStep.progress = 100;
    }

    // If repository provided, analyze it
    if (configuration.repositoryUrl) {
      await this.analyzeRepository(orderId, configuration.repositoryUrl);
    }

    this.orders.set(orderId, order);
    return true;
  }

  /**
   * Step 3: Repository Analysis (GitHub MCP Integration)
   */
  private async analyzeRepository(orderId: string, repositoryUrl: string): Promise<void> {
    const order = this.orders.get(orderId);
    if (!order) throw new Error('Order not found');

    const analysisStep = order.steps.find(step => step.id === 'repository_analysis');
    if (analysisStep) {
      analysisStep.status = 'in_progress';
      analysisStep.progress = 20;
    }

    try {
      // Connect to GitHub MCP server
      await this.githubService.connectToMCPServer();
      
      // Analyze repository
      const analysis = await this.githubService.analyzeRepository(repositoryUrl);
      
      // Store analysis results
      if (analysisStep) {
        analysisStep.data = analysis;
        analysisStep.status = 'completed';
        analysisStep.progress = 100;
      }

      // Update order with analysis insights
      order.metadata.repositoryAnalysis = analysis;
      order.updatedAt = new Date();

      this.orders.set(orderId, order);
      
      // Notify user via social feed
      await this.socialService.createActivity({
        userId: order.userId,
        type: 'repository_analyzed',
        content: `Repository analysis completed for order ${orderId}`,
        metadata: { orderId, repositoryUrl, analysis }
      });

    } catch (error) {
      if (analysisStep) {
        analysisStep.status = 'failed';
        analysisStep.progress = 0;
      }
      throw error;
    }
  }

  /**
   * Step 4: Review & Approval
   */
  async reviewOrder(orderId: string, approved: boolean, feedback?: string): Promise<boolean> {
    const order = this.orders.get(orderId);
    if (!order) throw new Error('Order not found');

    const reviewStep = order.steps.find(step => step.id === 'review_approval');
    if (reviewStep) {
      reviewStep.status = approved ? 'completed' : 'failed';
      reviewStep.progress = approved ? 100 : 0;
      reviewStep.data = { approved, feedback };
    }

    if (approved) {
      order.status = 'submitted';
      
      // Create social notification
      await this.socialService.createActivity({
        userId: order.userId,
        type: 'order_approved',
        content: `Order ${orderId} has been approved and is ready for payment`,
        metadata: { orderId }
      });
    } else {
      order.status = 'draft';
      
      // Notify about required changes
      await this.socialService.createNotification({
        userId: order.userId,
        type: 'order_feedback',
        title: 'Order Review Feedback',
        content: feedback || 'Your order requires some changes before approval',
        metadata: { orderId, feedback }
      });
    }

    order.updatedAt = new Date();
    this.orders.set(orderId, order);
    
    return approved;
  }

  /**
   * Step 5: Payment & Execution
   */
  async processPayment(orderId: string, paymentData: {
    method: 'credit_card' | 'crypto' | 'wire_transfer';
    amount: number;
    currency: string;
    token?: string;
  }): Promise<boolean> {
    const order = this.orders.get(orderId);
    if (!order) throw new Error('Order not found');

    const paymentStep = order.steps.find(step => step.id === 'payment');
    if (paymentStep) {
      paymentStep.status = 'in_progress';
      paymentStep.progress = 50;
    }

    try {
      // Process payment through API gateway
      const paymentResult = await this.apiGateway.processPayment({
        orderId,
        userId: order.userId,
        ...paymentData
      });

      if (paymentResult.success) {
        if (paymentStep) {
          paymentStep.status = 'completed';
          paymentStep.progress = 100;
          paymentStep.data = paymentResult;
        }

        // Start execution
        await this.executeOrder(orderId);
        
        return true;
      } else {
        throw new Error(paymentResult.error || 'Payment failed');
      }

    } catch (error) {
      if (paymentStep) {
        paymentStep.status = 'failed';
        paymentStep.progress = 0;
      }
      
      await this.socialService.createNotification({
        userId: order.userId,
        type: 'payment_failed',
        title: 'Payment Failed',
        content: `Payment for order ${orderId} failed: ${error}`,
        metadata: { orderId, error: error.toString() }
      });
      
      throw error;
    }
  }

  /**
   * Order Execution Phase
   */
  private async executeOrder(orderId: string): Promise<void> {
    const order = this.orders.get(orderId);
    if (!order) throw new Error('Order not found');

    order.status = 'in_progress';
    
    const executionStep = order.steps.find(step => step.id === 'execution');
    if (executionStep) {
      executionStep.status = 'in_progress';
      executionStep.progress = 10;
    }

    try {
      // Start real-time progress tracking
      await this.setupRealtimeTracking(orderId);

      // Execute based on order type
      switch (order.type) {
        case 'app_development':
          await this.executeAppDevelopment(orderId);
          break;
        case 'trading_bot':
          await this.executeTradingBot(orderId);
          break;
        case 'integration':
          await this.executeIntegration(orderId);
          break;
        case 'custom':
          await this.executeCustomOrder(orderId);
          break;
      }

      // Mark as completed
      if (executionStep) {
        executionStep.status = 'completed';
        executionStep.progress = 100;
      }

      order.status = 'completed';
      order.completedAt = new Date();
      order.updatedAt = new Date();

      // Create completion notification
      await this.socialService.createActivity({
        userId: order.userId,
        type: 'order_completed',
        content: `Order ${orderId} has been successfully completed!`,
        metadata: { orderId, orderType: order.type }
      });

      // Award completion badge
      await this.socialService.awardBadge(order.userId, {
        id: `order_completion_${order.type}`,
        name: `${order.type.replace('_', ' ')} Master`,
        description: `Successfully completed a ${order.type.replace('_', ' ')} order`,
        rarity: 'rare',
        imageUrl: `/badges/${order.type}_completion.png`
      });

    } catch (error) {
      if (executionStep) {
        executionStep.status = 'failed';
      }
      
      order.status = 'failed';
      order.updatedAt = new Date();
      
      await this.socialService.createNotification({
        userId: order.userId,
        type: 'order_failed',
        title: 'Order Execution Failed',
        content: `Order ${orderId} execution failed: ${error}`,
        metadata: { orderId, error: error.toString() }
      });
      
      throw error;
    }

    this.orders.set(orderId, order);
  }

  /**
   * Real-time progress tracking
   */
  private async setupRealtimeTracking(orderId: string): Promise<void> {
    const order = this.orders.get(orderId);
    if (!order) return;

    // Create WebSocket connection for real-time updates
    const ws = new WebSocket(`ws://localhost:3001/orders/${orderId}/progress`);
    
    ws.onopen = () => {
      console.log(`Real-time tracking established for order ${orderId}`);
    };

    ws.onmessage = async (event) => {
      const update = JSON.parse(event.data);
      await this.updateOrderProgress(orderId, update);
    };

    ws.onerror = (error) => {
      console.error(`WebSocket error for order ${orderId}:`, error);
    };

    this.activeConnections.set(orderId, ws);
  }

  /**
   * Execute App Development Order
   */
  private async executeAppDevelopment(orderId: string): Promise<void> {
    const order = this.orders.get(orderId);
    if (!order) throw new Error('Order not found');

    // Use GitHub MCP service to generate app
    await this.githubService.generateApp({
      repositoryUrl: order.metadata.repositoryUrl!,
      requirements: order.metadata.requirements!,
      type: 'nextjs',
      orderId
    });

    // Setup CI/CD pipeline
    await this.githubService.setupCICD(order.metadata.repositoryUrl!, {
      framework: 'nextjs',
      deploymentTarget: 'vercel',
      testingEnabled: true
    });
  }

  /**
   * Execute Trading Bot Order
   */
  private async executeTradingBot(orderId: string): Promise<void> {
    const order = this.orders.get(orderId);
    if (!order) throw new Error('Order not found');

    // Generate trading bot using templates and requirements
    await this.githubService.generateApp({
      repositoryUrl: order.metadata.repositoryUrl!,
      requirements: order.metadata.requirements!,
      type: 'trading_bot',
      orderId
    });

    // Setup trading bot specific CI/CD
    await this.githubService.setupCICD(order.metadata.repositoryUrl!, {
      framework: 'python',
      deploymentTarget: 'cloud_run',
      testingEnabled: true,
      secrets: ['TRADING_API_KEYS', 'DATABASE_URL']
    });
  }

  /**
   * Execute Integration Order
   */
  private async executeIntegration(orderId: string): Promise<void> {
    const order = this.orders.get(orderId);
    if (!order) throw new Error('Order not found');

    // Setup integration using existing codebase
    await this.githubService.setupIntegration(order.metadata.repositoryUrl!, {
      integrationType: 'api',
      requirements: order.metadata.requirements!,
      orderId
    });
  }

  /**
   * Execute Custom Order
   */
  private async executeCustomOrder(orderId: string): Promise<void> {
    const order = this.orders.get(orderId);
    if (!order) throw new Error('Order not found');

    // Handle custom requirements
    await this.githubService.processCustomOrder(orderId, {
      requirements: order.metadata.requirements!,
      repositoryUrl: order.metadata.repositoryUrl,
      customInstructions: order.metadata
    });
  }

  /**
   * Update order progress
   */
  private async updateOrderProgress(orderId: string, update: {
    stepId?: string;
    progress?: number;
    status?: OrderStep['status'];
    message?: string;
  }): Promise<void> {
    const order = this.orders.get(orderId);
    if (!order) return;

    if (update.stepId) {
      const step = order.steps.find(s => s.id === update.stepId);
      if (step) {
        if (update.progress !== undefined) step.progress = update.progress;
        if (update.status) step.status = update.status;
      }
    }

    order.updatedAt = new Date();
    this.orders.set(orderId, order);

    // Broadcast update to client
    const ws = this.activeConnections.get(orderId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'progress_update',
        orderId,
        update,
        timestamp: new Date().toISOString()
      }));
    }

    // Update social feed if significant progress
    if (update.progress && update.progress % 25 === 0) {
      await this.socialService.createActivity({
        userId: order.userId,
        type: 'order_progress',
        content: `Order ${orderId} is ${update.progress}% complete`,
        metadata: { orderId, progress: update.progress }
      });
    }
  }

  /**
   * Generate order steps based on type
   */
  private generateOrderSteps(type: OrderFlow['type']): OrderStep[] {
    const baseSteps: OrderStep[] = [
      {
        id: 'configuration',
        title: 'Requirements & Configuration',
        description: 'Define your project requirements and configuration',
        status: 'pending',
        progress: 0,
        estimatedTime: '10 minutes',
        dependencies: []
      },
      {
        id: 'repository_analysis',
        title: 'Repository Analysis',
        description: 'Analyze your repository structure and dependencies',
        status: 'pending',
        progress: 0,
        estimatedTime: '5 minutes',
        dependencies: ['configuration']
      },
      {
        id: 'review_approval',
        title: 'Review & Approval',
        description: 'Review your order details and approve for processing',
        status: 'pending',
        progress: 0,
        estimatedTime: '5 minutes',
        dependencies: ['repository_analysis']
      },
      {
        id: 'payment',
        title: 'Payment Processing',
        description: 'Process payment for your order',
        status: 'pending',
        progress: 0,
        estimatedTime: '2 minutes',
        dependencies: ['review_approval']
      },
      {
        id: 'execution',
        title: 'Order Execution',
        description: 'Execute your order and deliver results',
        status: 'pending',
        progress: 0,
        estimatedTime: '30-120 minutes',
        dependencies: ['payment']
      }
    ];

    // Add type-specific steps
    switch (type) {
      case 'app_development':
        baseSteps.splice(4, 0, {
          id: 'app_generation',
          title: 'App Generation',
          description: 'Generate your application code and structure',
          status: 'pending',
          progress: 0,
          estimatedTime: '45 minutes',
          dependencies: ['payment']
        });
        break;
        
      case 'trading_bot':
        baseSteps.splice(4, 0, {
          id: 'bot_configuration',
          title: 'Bot Configuration',
          description: 'Configure trading strategies and parameters',
          status: 'pending',
          progress: 0,
          estimatedTime: '20 minutes',
          dependencies: ['payment']
        });
        break;
    }

    return baseSteps;
  }

  /**
   * Get order status
   */
  getOrder(orderId: string): OrderFlow | undefined {
    return this.orders.get(orderId);
  }

  /**
   * List user orders
   */
  getUserOrders(userId: string): OrderFlow[] {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, reason?: string): Promise<boolean> {
    const order = this.orders.get(orderId);
    if (!order) throw new Error('Order not found');

    if (order.status === 'in_progress') {
      // Cannot cancel orders in progress
      return false;
    }

    order.status = 'failed';
    order.updatedAt = new Date();

    // Close WebSocket connection
    const ws = this.activeConnections.get(orderId);
    if (ws) {
      ws.close();
      this.activeConnections.delete(orderId);
    }

    // Notify user
    await this.socialService.createNotification({
      userId: order.userId,
      type: 'order_cancelled',
      title: 'Order Cancelled',
      content: `Order ${orderId} has been cancelled. ${reason || ''}`,
      metadata: { orderId, reason }
    });

    this.orders.set(orderId, order);
    return true;
  }

  /**
   * Get real-time progress
   */
  subscribeToProgress(orderId: string, callback: (update: any) => void): () => void {
    const ws = this.activeConnections.get(orderId);
    if (!ws) throw new Error('No active connection for order');

    const handler = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    ws.addEventListener('message', handler);

    // Return unsubscribe function
    return () => {
      ws.removeEventListener('message', handler);
    };
  }
}

// Export singleton instance
export const linearOrderFlow = new LinearOrderFlowService();
