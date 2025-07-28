'use client';

import { NextApiRequest, NextApiResponse } from 'next';

// Rate Limiting Types
export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: NextApiRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  message?: string;
}

export interface APIKeyConfig {
  id: string;
  name: string;
  key: string;
  tenantId: string;
  permissions: string[];
  rateLimit?: RateLimitConfig;
  enabled: boolean;
  expiresAt?: Date;
  lastUsed?: Date;
  metadata: Record<string, any>;
}

export interface WebhookConfig {
  id: string;
  tenantId: string;
  url: string;
  events: string[];
  secret: string;
  enabled: boolean;
  retryConfig: {
    maxRetries: number;
    retryDelay: number;
    backoffMultiplier: number;
  };
  headers?: Record<string, string>;
  createdAt: Date;
  lastTriggered?: Date;
}

export interface AuditLogEntry {
  id: string;
  tenantId: string;
  userId?: string;
  apiKeyId?: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  userAgent?: string;
  ipAddress: string;
  requestBody?: any;
  responseBody?: any;
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface APIMetrics {
  requests: number;
  errors: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  topEndpoints: Array<{ endpoint: string; count: number }>;
  errorsByStatus: Record<number, number>;
  requestsByHour: Array<{ hour: string; count: number }>;
}

export class EnterpriseAPIGateway {
  private rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map();
  private apiKeys: Map<string, APIKeyConfig> = new Map();
  private webhooks: Map<string, WebhookConfig> = new Map();
  private auditLogs: AuditLogEntry[] = [];
  private metrics: Map<string, number[]> = new Map();

  /**
   * Rate limiting middleware
   */
  async rateLimitMiddleware(
    req: NextApiRequest,
    res: NextApiResponse,
    config: RateLimitConfig
  ): Promise<boolean> {
    const key = config.keyGenerator ? config.keyGenerator(req) : this.getDefaultKey(req);
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Clean up old entries
    const existing = this.rateLimitStore.get(key);
    if (existing && existing.resetTime <= now) {
      this.rateLimitStore.delete(key);
    }

    // Get current count
    const current = this.rateLimitStore.get(key) || { count: 0, resetTime: now + config.windowMs };
    
    if (current.count >= config.maxRequests) {
      res.status(429).json({
        error: 'Rate limit exceeded',
        message: config.message || 'Too many requests, please try again later.',
        retryAfter: Math.ceil((current.resetTime - now) / 1000)
      });
      return false;
    }

    // Increment count
    current.count++;
    this.rateLimitStore.set(key, current);

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', config.maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, config.maxRequests - current.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(current.resetTime / 1000));

    return true;
  }

  /**
   * API Key authentication middleware
   */
  async authenticateAPIKey(req: NextApiRequest, res: NextApiResponse): Promise<APIKeyConfig | null> {
    const apiKey = this.extractAPIKey(req);
    
    if (!apiKey) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'API key is required. Provide it in the Authorization header or x-api-key header.'
      });
      return null;
    }

    const keyConfig = this.apiKeys.get(apiKey);
    
    if (!keyConfig) {
      res.status(401).json({
        error: 'Invalid API key',
        message: 'The provided API key is not valid.'
      });
      return null;
    }

    if (!keyConfig.enabled) {
      res.status(401).json({
        error: 'API key disabled',
        message: 'The provided API key has been disabled.'
      });
      return null;
    }

    if (keyConfig.expiresAt && keyConfig.expiresAt <= new Date()) {
      res.status(401).json({
        error: 'API key expired',
        message: 'The provided API key has expired.'
      });
      return null;
    }

    // Update last used timestamp
    keyConfig.lastUsed = new Date();
    this.apiKeys.set(apiKey, keyConfig);

    return keyConfig;
  }

  /**
   * Permission authorization middleware
   */
  async authorizePermissions(
    keyConfig: APIKeyConfig,
    requiredPermissions: string[],
    res: NextApiResponse
  ): Promise<boolean> {
    const hasPermissions = requiredPermissions.every(permission => 
      keyConfig.permissions.includes(permission) || keyConfig.permissions.includes('*')
    );

    if (!hasPermissions) {
      res.status(403).json({
        error: 'Insufficient permissions',
        message: `This operation requires the following permissions: ${requiredPermissions.join(', ')}`,
        required: requiredPermissions,
        granted: keyConfig.permissions
      });
      return false;
    }

    return true;
  }

  /**
   * Complete API gateway middleware
   */
  async gatewayMiddleware(
    req: NextApiRequest,
    res: NextApiResponse,
    options: {
      rateLimit?: RateLimitConfig;
      requiredPermissions?: string[];
      enableAuditLog?: boolean;
    } = {}
  ): Promise<{ keyConfig?: APIKeyConfig; continue: boolean }> {
    const startTime = Date.now();

    try {
      // 1. Rate limiting
      if (options.rateLimit) {
        const rateLimitPassed = await this.rateLimitMiddleware(req, res, options.rateLimit);
        if (!rateLimitPassed) {
          return { continue: false };
        }
      }

      // 2. API key authentication
      const keyConfig = await this.authenticateAPIKey(req, res);
      if (!keyConfig) {
        return { continue: false };
      }

      // 3. Permission authorization
      if (options.requiredPermissions && options.requiredPermissions.length > 0) {
        const hasPermissions = await this.authorizePermissions(
          keyConfig,
          options.requiredPermissions,
          res
        );
        if (!hasPermissions) {
          return { continue: false };
        }
      }

      // 4. Additional rate limiting per API key
      if (keyConfig.rateLimit) {
        const keyRateLimitPassed = await this.rateLimitMiddleware(req, res, keyConfig.rateLimit);
        if (!keyRateLimitPassed) {
          return { continue: false };
        }
      }

      return { keyConfig, continue: true };

    } catch (error) {
      console.error('Gateway middleware error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred while processing the request.'
      });
      return { continue: false };
    } finally {
      // 5. Audit logging
      if (options.enableAuditLog) {
        await this.logRequest(req, res, startTime);
      }
    }
  }

  /**
   * Create API key
   */
  async createAPIKey(config: Omit<APIKeyConfig, 'id' | 'key' | 'lastUsed'>): Promise<APIKeyConfig> {
    const apiKey: APIKeyConfig = {
      id: this.generateId(),
      key: this.generateAPIKey(),
      lastUsed: undefined,
      ...config
    };

    this.apiKeys.set(apiKey.key, apiKey);
    return apiKey;
  }

  /**
   * Revoke API key
   */
  async revokeAPIKey(keyId: string): Promise<boolean> {
    for (const [key, config] of this.apiKeys.entries()) {
      if (config.id === keyId) {
        this.apiKeys.delete(key);
        return true;
      }
    }
    return false;
  }

  /**
   * Update API key
   */
  async updateAPIKey(keyId: string, updates: Partial<APIKeyConfig>): Promise<APIKeyConfig | null> {
    for (const [key, config] of this.apiKeys.entries()) {
      if (config.id === keyId) {
        const updatedConfig = { ...config, ...updates };
        this.apiKeys.set(key, updatedConfig);
        return updatedConfig;
      }
    }
    return null;
  }

  /**
   * List API keys for tenant
   */
  async listAPIKeys(tenantId: string): Promise<APIKeyConfig[]> {
    return Array.from(this.apiKeys.values())
      .filter(config => config.tenantId === tenantId)
      .map(config => ({
        ...config,
        key: `${config.key.substring(0, 8)}...` // Mask the key
      }));
  }

  /**
   * Configure webhook
   */
  async configureWebhook(webhook: Omit<WebhookConfig, 'id' | 'createdAt' | 'lastTriggered'>): Promise<WebhookConfig> {
    const config: WebhookConfig = {
      id: this.generateId(),
      createdAt: new Date(),
      lastTriggered: undefined,
      ...webhook
    };

    this.webhooks.set(config.id, config);
    return config;
  }

  /**
   * Trigger webhook
   */
  async triggerWebhook(tenantId: string, event: string, payload: any): Promise<void> {
    const relevantWebhooks = Array.from(this.webhooks.values())
      .filter(webhook => 
        webhook.tenantId === tenantId && 
        webhook.enabled && 
        webhook.events.includes(event)
      );

    const promises = relevantWebhooks.map(webhook => this.sendWebhook(webhook, event, payload));
    await Promise.allSettled(promises);
  }

  /**
   * Get audit logs
   */
  async getAuditLogs(
    tenantId: string,
    options: {
      startDate?: Date;
      endDate?: Date;
      endpoint?: string;
      userId?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{ logs: AuditLogEntry[]; total: number }> {
    let filteredLogs = this.auditLogs.filter(log => log.tenantId === tenantId);

    if (options.startDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= options.startDate!);
    }

    if (options.endDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= options.endDate!);
    }

    if (options.endpoint) {
      filteredLogs = filteredLogs.filter(log => log.endpoint.includes(options.endpoint!));
    }

    if (options.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === options.userId);
    }

    const total = filteredLogs.length;
    const offset = options.offset || 0;
    const limit = options.limit || 100;
    
    const logs = filteredLogs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(offset, offset + limit);

    return { logs, total };
  }

  /**
   * Get API metrics
   */
  async getAPIMetrics(
    tenantId: string,
    timeRange: { start: Date; end: Date }
  ): Promise<APIMetrics> {
    const logs = this.auditLogs.filter(log => 
      log.tenantId === tenantId &&
      log.timestamp >= timeRange.start &&
      log.timestamp <= timeRange.end
    );

    const requests = logs.length;
    const errors = logs.filter(log => log.statusCode >= 400).length;
    const responseTimes = logs.map(log => log.responseTime);
    
    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
      : 0;

    const sortedResponseTimes = responseTimes.sort((a, b) => a - b);
    const p95Index = Math.floor(sortedResponseTimes.length * 0.95);
    const p99Index = Math.floor(sortedResponseTimes.length * 0.99);
    
    const p95ResponseTime = sortedResponseTimes[p95Index] || 0;
    const p99ResponseTime = sortedResponseTimes[p99Index] || 0;

    // Top endpoints
    const endpointCounts = logs.reduce((acc, log) => {
      acc[log.endpoint] = (acc[log.endpoint] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topEndpoints = Object.entries(endpointCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([endpoint, count]) => ({ endpoint, count }));

    // Errors by status code
    const errorsByStatus = logs
      .filter(log => log.statusCode >= 400)
      .reduce((acc, log) => {
        acc[log.statusCode] = (acc[log.statusCode] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

    // Requests by hour
    const hourCounts = logs.reduce((acc, log) => {
      const hour = new Date(log.timestamp).toISOString().substring(0, 13) + ':00:00.000Z';
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const requestsByHour = Object.entries(hourCounts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([hour, count]) => ({ hour, count }));

    return {
      requests,
      errors,
      averageResponseTime,
      p95ResponseTime,
      p99ResponseTime,
      topEndpoints,
      errorsByStatus,
      requestsByHour
    };
  }

  // Private helper methods

  private getDefaultKey(req: NextApiRequest): string {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress;
    return `${ip}:${req.url}`;
  }

  private extractAPIKey(req: NextApiRequest): string | null {
    // Check Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Check x-api-key header
    const apiKeyHeader = req.headers['x-api-key'];
    if (apiKeyHeader && typeof apiKeyHeader === 'string') {
      return apiKeyHeader;
    }

    // Check query parameter
    const queryApiKey = req.query.api_key;
    if (queryApiKey && typeof queryApiKey === 'string') {
      return queryApiKey;
    }

    return null;
  }

  private generateId(): string {
    return `ece_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private generateAPIKey(): string {
    const prefix = 'ece_live_';
    const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return prefix + random;
  }

  private async sendWebhook(webhook: WebhookConfig, event: string, payload: any): Promise<void> {
    const webhookPayload = {
      id: this.generateId(),
      event,
      timestamp: new Date().toISOString(),
      data: payload
    };

    let attempt = 0;
    let delay = webhook.retryConfig.retryDelay;

    while (attempt <= webhook.retryConfig.maxRetries) {
      try {
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-ECE-Signature': this.generateWebhookSignature(webhookPayload, webhook.secret),
            'X-ECE-Event': event,
            ...webhook.headers
          },
          body: JSON.stringify(webhookPayload)
        });

        if (response.ok) {
          webhook.lastTriggered = new Date();
          this.webhooks.set(webhook.id, webhook);
          return;
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      } catch (error) {
        console.error(`Webhook delivery attempt ${attempt + 1} failed:`, error);
        
        if (attempt === webhook.retryConfig.maxRetries) {
          console.error(`Webhook delivery failed after ${attempt + 1} attempts`);
          return;
        }

        attempt++;
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= webhook.retryConfig.backoffMultiplier;
      }
    }
  }

  private generateWebhookSignature(payload: any, secret: string): string {
    // In production, use crypto.createHmac with SHA-256
    // This is a simplified version
    return Buffer.from(`${JSON.stringify(payload)}:${secret}`).toString('base64');
  }

  private async logRequest(req: NextApiRequest, res: NextApiResponse, startTime: number): Promise<void> {
    const responseTime = Date.now() - startTime;
    const forwarded = req.headers['x-forwarded-for'];
    const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress || 'unknown';

    const auditEntry: AuditLogEntry = {
      id: this.generateId(),
      tenantId: (req as any).tenantId || 'unknown',
      userId: (req as any).userId,
      apiKeyId: (req as any).apiKeyId,
      endpoint: req.url || '',
      method: req.method || '',
      statusCode: res.statusCode,
      responseTime,
      userAgent: req.headers['user-agent'],
      ipAddress: ip,
      timestamp: new Date(),
      metadata: {
        query: req.query,
        headers: this.sanitizeHeaders(req.headers)
      }
    };

    this.auditLogs.push(auditEntry);

    // Keep only last 10000 entries in memory
    if (this.auditLogs.length > 10000) {
      this.auditLogs = this.auditLogs.slice(-10000);
    }
  }

  private sanitizeHeaders(headers: any): Record<string, string> {
    const sanitized = { ...headers };
    
    // Remove sensitive headers
    delete sanitized.authorization;
    delete sanitized['x-api-key'];
    delete sanitized.cookie;
    
    return sanitized;
  }
}

// Export singleton instance
export const enterpriseAPIGateway = new EnterpriseAPIGateway();
