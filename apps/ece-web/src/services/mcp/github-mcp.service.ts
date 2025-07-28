'use client';

import { Repository, PullRequest, Issue, Branch, Commit } from '@/types/github';

export interface MCPServerConfig {
  url: string;
  accessToken: string;
  timeout: number;
  retryAttempts: number;
  enableCache: boolean;
}

export interface RepositoryAnalysis {
  id: string;
  fullName: string;
  description: string;
  language: string;
  languages: Record<string, number>;
  framework: string;
  features: string[];
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedValue: number;
  quality: {
    codeQuality: number;
    documentation: number;
    testing: number;
    maintenance: number;
    security: number;
    overall: number;
  };
  metadata: {
    stars: number;
    forks: number;
    issues: number;
    pullRequests: number;
    contributors: number;
    lastCommit: Date;
    license: string;
    size: number;
  };
  appGeneration: {
    templateType: string;
    dependencies: string[];
    buildCommands: string[];
    deploymentConfig: Record<string, any>;
    environmentVariables: Record<string, string>;
  };
}

export interface MCPResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
}

export interface OrderIntegration {
  orderId: string;
  repositoryUrl: string;
  requirements: {
    framework?: string;
    features: string[];
    customizations: string[];
    deployment: {
      platform: string;
      configuration: Record<string, any>;
    };
  };
  progress: {
    status: 'analyzing' | 'generating' | 'customizing' | 'deploying' | 'completed' | 'failed';
    currentStep: string;
    completedSteps: string[];
    estimatedTimeRemaining: number;
  };
}

export class GitHubMCPService {
  private config: MCPServerConfig;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private activeConnections: Map<string, WebSocket> = new Map();

  constructor(config: MCPServerConfig) {
    this.config = config;
    this.setupCacheCleanup();
  }

  /**
   * Initialize connection to GitHub MCP server
   */
  async connect(): Promise<boolean> {
    try {
      const ws = new WebSocket(this.config.url);
      
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, this.config.timeout);

        ws.onopen = () => {
          clearTimeout(timeout);
          this.activeConnections.set('primary', ws);
          
          // Send authentication
          ws.send(JSON.stringify({
            type: 'auth',
            token: this.config.accessToken
          }));
          
          resolve(true);
        };

        ws.onerror = (error) => {
          clearTimeout(timeout);
          reject(error);
        };

        ws.onmessage = (event) => {
          this.handleMessage(JSON.parse(event.data));
        };

        ws.onclose = () => {
          this.activeConnections.delete('primary');
          this.reconnect();
        };
      });
    } catch (error) {
      console.error('Failed to connect to GitHub MCP server:', error);
      return false;
    }
  }

  /**
   * Analyze GitHub repository for app generation
   */
  async analyzeRepository(repositoryUrl: string): Promise<MCPResponse<RepositoryAnalysis>> {
    const cacheKey = `repo_analysis_${repositoryUrl}`;
    
    // Check cache first
    if (this.config.enableCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }
    }

    try {
      const response = await this.sendMCPRequest('analyze_repository', {
        repository_url: repositoryUrl,
        include_languages: true,
        include_dependencies: true,
        include_security_analysis: true,
        include_quality_metrics: true
      });

      if (!response.success) {
        return response;
      }

      const analysis = this.processRepositoryAnalysis(response.data);
      
      // Cache the result
      if (this.config.enableCache) {
        this.setCache(cacheKey, analysis, 3600000); // 1 hour TTL
      }

      return { success: true, data: analysis };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Repository analysis failed'
      };
    }
  }

  /**
   * Connect repository to order flow
   */
  async connectRepositoryToOrder(
    orderId: string,
    repositoryUrl: string,
    requirements: OrderIntegration['requirements']
  ): Promise<MCPResponse<OrderIntegration>> {
    try {
      // First analyze the repository
      const analysisResponse = await this.analyzeRepository(repositoryUrl);
      if (!analysisResponse.success) {
        return analysisResponse;
      }

      const analysis = analysisResponse.data!;

      // Create order integration
      const integration: OrderIntegration = {
        orderId,
        repositoryUrl,
        requirements,
        progress: {
          status: 'analyzing',
          currentStep: 'Repository analysis complete',
          completedSteps: ['repository_analysis'],
          estimatedTimeRemaining: this.estimateGenerationTime(analysis, requirements)
        }
      };

      // Send to MCP server for processing
      const response = await this.sendMCPRequest('create_order_integration', {
        order_id: orderId,
        repository_url: repositoryUrl,
        repository_analysis: analysis,
        requirements,
        integration_settings: {
          preserve_git_history: true,
          create_deployment_branch: true,
          setup_ci_cd: true,
          enable_monitoring: true
        }
      });

      if (!response.success) {
        return response;
      }

      integration.progress.status = 'generating';
      integration.progress.currentStep = 'Generating application from repository';
      integration.progress.completedSteps.push('order_integration_created');

      return { success: true, data: integration };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Order integration failed'
      };
    }
  }

  /**
   * Get repository list for user
   */
  async getUserRepositories(username: string, includePrivate: boolean = false): Promise<MCPResponse<Repository[]>> {
    const cacheKey = `user_repos_${username}_${includePrivate}`;
    
    if (this.config.enableCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }
    }

    try {
      const response = await this.sendMCPRequest('get_user_repositories', {
        username,
        include_private: includePrivate,
        sort: 'updated',
        per_page: 100
      });

      if (!response.success) {
        return response;
      }

      const repositories = response.data.map(this.processRepository);
      
      if (this.config.enableCache) {
        this.setCache(cacheKey, repositories, 600000); // 10 minutes TTL
      }

      return { success: true, data: repositories };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch repositories'
      };
    }
  }

  /**
   * Create new repository from generated app
   */
  async createRepositoryFromApp(
    appName: string,
    appData: {
      files: Record<string, string>;
      framework: string;
      dependencies: Record<string, string>;
      scripts: Record<string, string>;
    },
    options: {
      private: boolean;
      description: string;
      license: string;
      setupCI: boolean;
    }
  ): Promise<MCPResponse<Repository>> {
    try {
      const response = await this.sendMCPRequest('create_repository_from_app', {
        name: appName,
        description: options.description,
        private: options.private,
        license: options.license,
        app_data: appData,
        setup_options: {
          create_readme: true,
          setup_gitignore: true,
          setup_ci_cd: options.setupCI,
          initial_commit_message: `Initial commit - Generated by ECE Platform`,
          branch_protection: options.setupCI
        }
      });

      if (!response.success) {
        return response;
      }

      const repository = this.processRepository(response.data);
      return { success: true, data: repository };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Repository creation failed'
      };
    }
  }

  /**
   * Setup CI/CD pipeline for repository
   */
  async setupCICD(
    repositoryUrl: string,
    config: {
      platform: 'github-actions' | 'vercel' | 'netlify' | 'heroku';
      buildCommand: string;
      testCommand?: string;
      deploymentConfig: Record<string, any>;
      environmentVariables: Record<string, string>;
    }
  ): Promise<MCPResponse<{ workflowId: string; deploymentUrl?: string }>> {
    try {
      const response = await this.sendMCPRequest('setup_cicd', {
        repository_url: repositoryUrl,
        platform: config.platform,
        build_command: config.buildCommand,
        test_command: config.testCommand,
        deployment_config: config.deploymentConfig,
        environment_variables: config.environmentVariables,
        workflow_settings: {
          trigger_on_push: true,
          trigger_on_pr: true,
          enable_caching: true,
          parallel_jobs: true
        }
      });

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'CI/CD setup failed'
      };
    }
  }

  /**
   * Get order integration status
   */
  async getOrderIntegrationStatus(orderId: string): Promise<MCPResponse<OrderIntegration>> {
    try {
      const response = await this.sendMCPRequest('get_order_status', {
        order_id: orderId
      });

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get order status'
      };
    }
  }

  /**
   * Clone repository to ECE workspace
   */
  async cloneRepository(repositoryUrl: string, targetPath: string): Promise<MCPResponse<{ path: string; files: string[] }>> {
    try {
      const response = await this.sendMCPRequest('clone_repository', {
        repository_url: repositoryUrl,
        target_path: targetPath,
        options: {
          shallow: false,
          include_submodules: true,
          checkout_branch: 'main'
        }
      });

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Repository clone failed'
      };
    }
  }

  /**
   * Generate app from repository analysis
   */
  async generateAppFromRepository(
    analysis: RepositoryAnalysis,
    customizations: {
      features: string[];
      styling: Record<string, any>;
      integrations: string[];
      deployment: {
        platform: string;
        configuration: Record<string, any>;
      };
    }
  ): Promise<MCPResponse<{
    files: Record<string, string>;
    structure: Record<string, any>;
    dependencies: Record<string, string>;
    scripts: Record<string, string>;
    deploymentConfig: Record<string, any>;
  }>> {
    try {
      const response = await this.sendMCPRequest('generate_app_from_analysis', {
        repository_analysis: analysis,
        customizations,
        generation_settings: {
          preserve_structure: true,
          modernize_dependencies: true,
          add_typescript: true,
          add_testing: true,
          optimize_performance: true,
          add_documentation: true
        }
      });

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'App generation failed'
      };
    }
  }

  // Private helper methods

  private async sendMCPRequest(action: string, data: any): Promise<MCPResponse> {
    const connection = this.activeConnections.get('primary');
    if (!connection || connection.readyState !== WebSocket.OPEN) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      const requestId = this.generateRequestId();
      const message = {
        id: requestId,
        type: 'request',
        action,
        data
      };

      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, this.config.timeout);

      const handleResponse = (event: MessageEvent) => {
        const response = JSON.parse(event.data);
        if (response.id === requestId) {
          clearTimeout(timeout);
          connection!.removeEventListener('message', handleResponse);
          
          if (response.success) {
            resolve(response);
          } else {
            reject(new Error(response.error || 'Request failed'));
          }
        }
      };

      connection!.addEventListener('message', handleResponse);
      connection!.send(JSON.stringify(message));
    });
  }

  private handleMessage(message: any): void {
    switch (message.type) {
      case 'progress_update':
        this.handleProgressUpdate(message.data);
        break;
      case 'error':
        console.error('MCP Server Error:', message.error);
        break;
      case 'notification':
        this.handleNotification(message.data);
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  private handleProgressUpdate(data: any): void {
    // Emit progress update event
    window.dispatchEvent(new CustomEvent('mcp_progress_update', { detail: data }));
  }

  private handleNotification(data: any): void {
    // Emit notification event
    window.dispatchEvent(new CustomEvent('mcp_notification', { detail: data }));
  }

  private async reconnect(): Promise<void> {
    let attempts = 0;
    const maxAttempts = this.config.retryAttempts;

    while (attempts < maxAttempts) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts)));
        const connected = await this.connect();
        if (connected) {
          console.log('Reconnected to MCP server');
          return;
        }
      } catch (error) {
        console.error(`Reconnection attempt ${attempts + 1} failed:`, error);
      }
      attempts++;
    }

    console.error('Failed to reconnect to MCP server after', maxAttempts, 'attempts');
  }

  private processRepositoryAnalysis(rawData: any): RepositoryAnalysis {
    return {
      id: rawData.id,
      fullName: rawData.full_name,
      description: rawData.description || '',
      language: rawData.language || 'Unknown',
      languages: rawData.languages || {},
      framework: this.detectFramework(rawData),
      features: this.extractFeatures(rawData),
      complexity: this.calculateComplexity(rawData),
      estimatedValue: this.calculateEstimatedValue(rawData),
      quality: {
        codeQuality: rawData.quality?.code_quality || 75,
        documentation: rawData.quality?.documentation || 60,
        testing: rawData.quality?.testing || 50,
        maintenance: rawData.quality?.maintenance || 70,
        security: rawData.quality?.security || 80,
        overall: rawData.quality?.overall || 65
      },
      metadata: {
        stars: rawData.stargazers_count || 0,
        forks: rawData.forks_count || 0,
        issues: rawData.open_issues_count || 0,
        pullRequests: rawData.pull_requests_count || 0,
        contributors: rawData.contributors_count || 1,
        lastCommit: new Date(rawData.pushed_at || Date.now()),
        license: rawData.license?.name || 'None',
        size: rawData.size || 0
      },
      appGeneration: {
        templateType: this.determineTemplateType(rawData),
        dependencies: rawData.dependencies || [],
        buildCommands: rawData.build_commands || [],
        deploymentConfig: rawData.deployment_config || {},
        environmentVariables: rawData.env_variables || {}
      }
    };
  }

  private processRepository(rawData: any): Repository {
    return {
      id: rawData.id,
      name: rawData.name,
      fullName: rawData.full_name,
      description: rawData.description,
      private: rawData.private,
      htmlUrl: rawData.html_url,
      cloneUrl: rawData.clone_url,
      language: rawData.language,
      stargazersCount: rawData.stargazers_count,
      forksCount: rawData.forks_count,
      openIssuesCount: rawData.open_issues_count,
      defaultBranch: rawData.default_branch,
      createdAt: new Date(rawData.created_at),
      updatedAt: new Date(rawData.updated_at),
      pushedAt: new Date(rawData.pushed_at),
      size: rawData.size,
      license: rawData.license,
      topics: rawData.topics || []
    };
  }

  private detectFramework(repoData: any): string {
    const packageJson = repoData.files?.['package.json'];
    if (packageJson) {
      const pkg = JSON.parse(packageJson);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      
      if (deps.next) return 'Next.js';
      if (deps.nuxt) return 'Nuxt.js';
      if (deps.react) return 'React';
      if (deps.vue) return 'Vue.js';
      if (deps.angular) return 'Angular';
      if (deps.svelte) return 'Svelte';
    }

    const language = repoData.language?.toLowerCase();
    if (language === 'python') return 'Python';
    if (language === 'java') return 'Java';
    if (language === 'c#') return '.NET';
    if (language === 'go') return 'Go';
    if (language === 'rust') return 'Rust';
    
    return 'Unknown';
  }

  private extractFeatures(repoData: any): string[] {
    const features: string[] = [];
    const files = repoData.files || {};
    const dependencies = repoData.dependencies || {};

    // Check for common features based on files and dependencies
    if (files['Dockerfile'] || dependencies.docker) features.push('Docker');
    if (files['.github/workflows'] || files['.gitlab-ci.yml']) features.push('CI/CD');
    if (dependencies.typescript || files['tsconfig.json']) features.push('TypeScript');
    if (dependencies.tailwindcss || files['tailwind.config.js']) features.push('Tailwind CSS');
    if (dependencies.prisma || files['prisma/schema.prisma']) features.push('Database');
    if (dependencies['@auth0/nextjs-auth0'] || dependencies['next-auth']) features.push('Authentication');
    if (dependencies.stripe || dependencies['@stripe/stripe-js']) features.push('Payments');
    if (files['vercel.json'] || files['netlify.toml']) features.push('Deployment Config');

    return features;
  }

  private calculateComplexity(repoData: any): 'simple' | 'moderate' | 'complex' {
    const fileCount = Object.keys(repoData.files || {}).length;
    const dependencyCount = Object.keys(repoData.dependencies || {}).length;
    const linesOfCode = repoData.lines_of_code || 0;

    const complexityScore = fileCount * 0.1 + dependencyCount * 0.5 + linesOfCode * 0.001;

    if (complexityScore < 50) return 'simple';
    if (complexityScore < 150) return 'moderate';
    return 'complex';
  }

  private calculateEstimatedValue(repoData: any): number {
    const baseValue = 100; // Base value in ECE tokens
    const stars = repoData.stargazers_count || 0;
    const forks = repoData.forks_count || 0;
    const quality = repoData.quality?.overall || 50;
    
    // Value calculation based on popularity and quality
    const popularityBonus = Math.min(stars * 0.1 + forks * 0.2, 500);
    const qualityMultiplier = quality / 100;
    
    return Math.round((baseValue + popularityBonus) * qualityMultiplier);
  }

  private determineTemplateType(repoData: any): string {
    const framework = this.detectFramework(repoData);
    const features = this.extractFeatures(repoData);
    
    if (framework === 'Next.js') {
      if (features.includes('Authentication') && features.includes('Database')) {
        return 'full_stack_nextjs';
      }
      return 'nextjs_app';
    }
    
    if (framework === 'React') return 'react_app';
    if (framework === 'Vue.js') return 'vue_app';
    if (framework === 'Python') return 'python_app';
    
    return 'custom_app';
  }

  private estimateGenerationTime(analysis: RepositoryAnalysis, requirements: OrderIntegration['requirements']): number {
    let baseTime = 300; // 5 minutes base time
    
    // Add time based on complexity
    switch (analysis.complexity) {
      case 'simple': baseTime += 300; break;
      case 'moderate': baseTime += 600; break;
      case 'complex': baseTime += 1200; break;
    }
    
    // Add time for features
    baseTime += requirements.features.length * 60;
    baseTime += requirements.customizations.length * 120;
    
    return baseTime; // Return in seconds
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private setupCacheCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (now > entry.timestamp + entry.ttl) {
          this.cache.delete(key);
        }
      }
    }, 300000); // Clean up every 5 minutes
  }

  private getFromCache(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.timestamp + entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
}

// Export singleton instance with default configuration
export const githubMCPService = new GitHubMCPService({
  url: process.env.NEXT_PUBLIC_GITHUB_MCP_URL || 'wss://github-mcp.ece.app',
  accessToken: process.env.GITHUB_ACCESS_TOKEN || '',
  timeout: 30000,
  retryAttempts: 3,
  enableCache: true
});
