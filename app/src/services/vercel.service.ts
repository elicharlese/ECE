/**
 * Vercel Integration Service
 * Handles Vercel deployment, domain management, and hosting operations
 */

export interface VercelProject {
  id: string
  name: string
  accountId: string
  framework: string
  devCommand?: string
  buildCommand?: string
  outputDirectory?: string
  installCommand?: string
  rootDirectory?: string
  createdAt: Date
  updatedAt: Date
  link?: {
    type: 'github'
    repo: string
    repoId: number
    org?: string
    gitCredentialId?: string
    productionBranch?: string
  }
}

export interface VercelDeployment {
  id: string
  uid: string
  name: string
  url: string
  status: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED'
  type: 'LAMBDAS'
  state: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED'
  readyState: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED'
  createdAt: Date
  buildingAt?: Date
  readyAt?: Date
  creator: {
    uid: string
    email: string
    username: string
  }
  meta: {
    githubCommitSha?: string
    githubCommitMessage?: string
    githubCommitAuthorName?: string
    githubCommitRef?: string
  }
  target?: 'production' | 'staging'
  aliasAssigned?: boolean
  aliasError?: {
    code: string
    message: string
  }
}

export interface VercelDomain {
  name: string
  apexName: string
  projectId: string
  redirect?: string
  redirectStatusCode?: number
  gitBranch?: string
  updatedAt: Date
  createdAt: Date
  verified: boolean
  verification: Array<{
    type: string
    domain: string
    value: string
    reason: string
  }>
}

export interface VercelEnvironmentVariable {
  id: string
  key: string
  value: string
  target: Array<'production' | 'preview' | 'development'>
  type: 'secret' | 'system' | 'encrypted' | 'plain'
  configurationId?: string
  updatedAt: Date
  createdAt: Date
}

export class VercelService {
  private readonly apiUrl = 'https://api.vercel.com'
  private readonly token = process.env.VERCEL_TOKEN
  private readonly teamId = process.env.VERCEL_TEAM_ID
  
  // Project operations
  
  /**
   * Create new Vercel project
   */
  async createProject(
    name: string,
    framework: string = 'nextjs',
    gitRepo?: {
      type: 'github'
      repo: string
      org?: string
    },
    buildSettings?: {
      buildCommand?: string
      devCommand?: string
      installCommand?: string
      outputDirectory?: string
      rootDirectory?: string
    }
  ): Promise<VercelProject> {
    try {
      const projectData: any = {
        name: this.sanitizeProjectName(name),
        framework,
        ...buildSettings
      }
      
      if (gitRepo) {
        projectData.gitRepository = gitRepo
      }
      
      const response = await this.makeRequest('POST', '/v9/projects', projectData)
      
      const project: VercelProject = {
        id: response.id,
        name: response.name,
        accountId: response.accountId,
        framework: response.framework,
        devCommand: response.devCommand,
        buildCommand: response.buildCommand,
        outputDirectory: response.outputDirectory,
        installCommand: response.installCommand,
        rootDirectory: response.rootDirectory,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        link: response.link ? {
          type: response.link.type,
          repo: response.link.repo,
          repoId: response.link.repoId,
          org: response.link.org,
          gitCredentialId: response.link.gitCredentialId,
          productionBranch: response.link.productionBranch
        } : undefined
      }
      
      console.log(`🚀 Vercel project created: ${project.name}`)
      
      return project
    } catch (error) {
      console.error('Failed to create Vercel project:', error)
      throw new Error(`Vercel project creation failed: ${error}`)
    }
  }
  
  /**
   * Get project information
   */
  async getProject(projectId: string): Promise<VercelProject> {
    try {
      const response = await this.makeRequest('GET', `/v9/projects/${projectId}`)
      
      return {
        id: response.id,
        name: response.name,
        accountId: response.accountId,
        framework: response.framework,
        devCommand: response.devCommand,
        buildCommand: response.buildCommand,
        outputDirectory: response.outputDirectory,
        installCommand: response.installCommand,
        rootDirectory: response.rootDirectory,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt),
        link: response.link ? {
          type: response.link.type,
          repo: response.link.repo,
          repoId: response.link.repoId,
          org: response.link.org,
          gitCredentialId: response.link.gitCredentialId,
          productionBranch: response.link.productionBranch
        } : undefined
      }
    } catch (error) {
      console.error('Failed to get Vercel project:', error)
      throw new Error(`Vercel project fetch failed: ${error}`)
    }
  }
  
  /**
   * Link project to GitHub repository
   */
  async linkToGitHub(
    projectId: string,
    gitRepo: {
      type: 'github'
      repo: string
      org?: string
    },
    productionBranch: string = 'main'
  ): Promise<void> {
    try {
      await this.makeRequest('PATCH', `/v9/projects/${projectId}`, {
        link: {
          ...gitRepo,
          productionBranch
        }
      })
      
      console.log(`🔗 Project linked to GitHub: ${projectId} -> ${gitRepo.repo}`)
    } catch (error) {
      console.error('Failed to link Vercel project to GitHub:', error)
      throw new Error(`Vercel GitHub linking failed: ${error}`)
    }
  }
  
  // Deployment operations
  
  /**
   * Create deployment
   */
  async createDeployment(
    projectName: string,
    files: Array<{ file: string; data: string }>,
    target: 'production' | 'staging' = 'production',
    gitMetadata?: {
      commitSha: string
      commitMessage: string
      commitAuthorName: string
      commitRef: string
    }
  ): Promise<VercelDeployment> {
    try {
      const deploymentData: any = {
        name: projectName,
        files,
        target,
        projectSettings: {
          framework: 'nextjs'
        }
      }
      
      if (gitMetadata) {
        deploymentData.gitSource = {
          type: 'github',
          sha: gitMetadata.commitSha,
          ref: gitMetadata.commitRef
        }
        deploymentData.meta = {
          githubCommitSha: gitMetadata.commitSha,
          githubCommitMessage: gitMetadata.commitMessage,
          githubCommitAuthorName: gitMetadata.commitAuthorName,
          githubCommitRef: gitMetadata.commitRef
        }
      }
      
      const response = await this.makeRequest('POST', '/v13/deployments', deploymentData)
      
      const deployment: VercelDeployment = {
        id: response.id,
        uid: response.uid,
        name: response.name,
        url: response.url,
        status: response.status,
        type: response.type,
        state: response.state,
        readyState: response.readyState,
        createdAt: new Date(response.createdAt),
        buildingAt: response.buildingAt ? new Date(response.buildingAt) : undefined,
        readyAt: response.readyAt ? new Date(response.readyAt) : undefined,
        creator: response.creator,
        meta: response.meta || {},
        target: response.target,
        aliasAssigned: response.aliasAssigned,
        aliasError: response.aliasError
      }
      
      console.log(`🚀 Vercel deployment created: ${deployment.url}`)
      
      // Wait for deployment to be ready
      await this.waitForDeployment(deployment.id)
      
      return deployment
    } catch (error) {
      console.error('Failed to create Vercel deployment:', error)
      throw new Error(`Vercel deployment failed: ${error}`)
    }
  }
  
  /**
   * Get deployment status
   */
  async getDeployment(deploymentId: string): Promise<VercelDeployment> {
    try {
      const response = await this.makeRequest('GET', `/v13/deployments/${deploymentId}`)
      
      return {
        id: response.id,
        uid: response.uid,
        name: response.name,
        url: response.url,
        status: response.status,
        type: response.type,
        state: response.state,
        readyState: response.readyState,
        createdAt: new Date(response.createdAt),
        buildingAt: response.buildingAt ? new Date(response.buildingAt) : undefined,
        readyAt: response.readyAt ? new Date(response.readyAt) : undefined,
        creator: response.creator,
        meta: response.meta || {},
        target: response.target,
        aliasAssigned: response.aliasAssigned,
        aliasError: response.aliasError
      }
    } catch (error) {
      console.error('Failed to get Vercel deployment:', error)
      throw new Error(`Vercel deployment fetch failed: ${error}`)
    }
  }
  
  /**
   * Get project deployments
   */
  async getProjectDeployments(projectId: string, limit: number = 20): Promise<VercelDeployment[]> {
    try {
      const response = await this.makeRequest('GET', `/v6/deployments?projectId=${projectId}&limit=${limit}`)
      
      return response.deployments.map((deployment: any) => ({
        id: deployment.id,
        uid: deployment.uid,
        name: deployment.name,
        url: deployment.url,
        status: deployment.status,
        type: deployment.type,
        state: deployment.state,
        readyState: deployment.readyState,
        createdAt: new Date(deployment.createdAt),
        buildingAt: deployment.buildingAt ? new Date(deployment.buildingAt) : undefined,
        readyAt: deployment.readyAt ? new Date(deployment.readyAt) : undefined,
        creator: deployment.creator,
        meta: deployment.meta || {},
        target: deployment.target,
        aliasAssigned: deployment.aliasAssigned,
        aliasError: deployment.aliasError
      }))
    } catch (error) {
      console.error('Failed to get Vercel deployments:', error)
      throw new Error(`Vercel deployments fetch failed: ${error}`)
    }
  }
  
  /**
   * Cancel deployment
   */
  async cancelDeployment(deploymentId: string): Promise<void> {
    try {
      await this.makeRequest('PATCH', `/v12/deployments/${deploymentId}/cancel`)
      console.log(`❌ Vercel deployment cancelled: ${deploymentId}`)
    } catch (error) {
      console.error('Failed to cancel Vercel deployment:', error)
      throw new Error(`Vercel deployment cancellation failed: ${error}`)
    }
  }
  
  // Domain operations
  
  /**
   * Add domain to project
   */
  async addDomain(
    projectId: string,
    domain: string,
    gitBranch?: string,
    redirect?: string,
    redirectStatusCode?: number
  ): Promise<VercelDomain> {
    try {
      const domainData: any = {
        name: domain
      }
      
      if (gitBranch) domainData.gitBranch = gitBranch
      if (redirect) {
        domainData.redirect = redirect
        domainData.redirectStatusCode = redirectStatusCode || 308
      }
      
      const response = await this.makeRequest('POST', `/v9/projects/${projectId}/domains`, domainData)
      
      const vercelDomain: VercelDomain = {
        name: response.name,
        apexName: response.apexName,
        projectId: response.projectId,
        redirect: response.redirect,
        redirectStatusCode: response.redirectStatusCode,
        gitBranch: response.gitBranch,
        updatedAt: new Date(response.updatedAt),
        createdAt: new Date(response.createdAt),
        verified: response.verified,
        verification: response.verification || []
      }
      
      console.log(`🌐 Domain added to Vercel project: ${domain}`)
      
      return vercelDomain
    } catch (error) {
      console.error('Failed to add domain to Vercel project:', error)
      throw new Error(`Vercel domain addition failed: ${error}`)
    }
  }
  
  /**
   * Get project domains
   */
  async getProjectDomains(projectId: string): Promise<VercelDomain[]> {
    try {
      const response = await this.makeRequest('GET', `/v9/projects/${projectId}/domains`)
      
      return response.domains.map((domain: any) => ({
        name: domain.name,
        apexName: domain.apexName,
        projectId: domain.projectId,
        redirect: domain.redirect,
        redirectStatusCode: domain.redirectStatusCode,
        gitBranch: domain.gitBranch,
        updatedAt: new Date(domain.updatedAt),
        createdAt: new Date(domain.createdAt),
        verified: domain.verified,
        verification: domain.verification || []
      }))
    } catch (error) {
      console.error('Failed to get Vercel project domains:', error)
      throw new Error(`Vercel domains fetch failed: ${error}`)
    }
  }
  
  /**
   * Verify domain
   */
  async verifyDomain(projectId: string, domain: string): Promise<VercelDomain> {
    try {
      const response = await this.makeRequest('POST', `/v9/projects/${projectId}/domains/${domain}/verify`)
      
      return {
        name: response.name,
        apexName: response.apexName,
        projectId: response.projectId,
        redirect: response.redirect,
        redirectStatusCode: response.redirectStatusCode,
        gitBranch: response.gitBranch,
        updatedAt: new Date(response.updatedAt),
        createdAt: new Date(response.createdAt),
        verified: response.verified,
        verification: response.verification || []
      }
    } catch (error) {
      console.error('Failed to verify Vercel domain:', error)
      throw new Error(`Vercel domain verification failed: ${error}`)
    }
  }
  
  // Environment variables
  
  /**
   * Add environment variable
   */
  async addEnvironmentVariable(
    projectId: string,
    key: string,
    value: string,
    target: Array<'production' | 'preview' | 'development'> = ['production', 'preview', 'development'],
    type: 'secret' | 'system' | 'encrypted' | 'plain' = 'encrypted'
  ): Promise<VercelEnvironmentVariable> {
    try {
      const response = await this.makeRequest('POST', `/v9/projects/${projectId}/env`, {
        key,
        value,
        target,
        type
      })
      
      const envVar: VercelEnvironmentVariable = {
        id: response.id,
        key: response.key,
        value: response.value,
        target: response.target,
        type: response.type,
        configurationId: response.configurationId,
        updatedAt: new Date(response.updatedAt),
        createdAt: new Date(response.createdAt)
      }
      
      console.log(`🔐 Environment variable added: ${key}`)
      
      return envVar
    } catch (error) {
      console.error('Failed to add Vercel environment variable:', error)
      throw new Error(`Vercel environment variable addition failed: ${error}`)
    }
  }
  
  /**
   * Get environment variables
   */
  async getEnvironmentVariables(projectId: string): Promise<VercelEnvironmentVariable[]> {
    try {
      const response = await this.makeRequest('GET', `/v9/projects/${projectId}/env`)
      
      return response.envs.map((env: any) => ({
        id: env.id,
        key: env.key,
        value: env.value,
        target: env.target,
        type: env.type,
        configurationId: env.configurationId,
        updatedAt: new Date(env.updatedAt),
        createdAt: new Date(env.createdAt)
      }))
    } catch (error) {
      console.error('Failed to get Vercel environment variables:', error)
      throw new Error(`Vercel environment variables fetch failed: ${error}`)
    }
  }
  
  /**
   * Delete environment variable
   */
  async deleteEnvironmentVariable(projectId: string, envId: string): Promise<void> {
    try {
      await this.makeRequest('DELETE', `/v9/projects/${projectId}/env/${envId}`)
      console.log(`🗑️ Environment variable deleted: ${envId}`)
    } catch (error) {
      console.error('Failed to delete Vercel environment variable:', error)
      throw new Error(`Vercel environment variable deletion failed: ${error}`)
    }
  }
  
  /**
   * Wait for deployment to complete
   */
  async waitForDeployment(deploymentId: string, maxWaitTime: number = 300000): Promise<VercelDeployment> {
    const startTime = Date.now()
    const pollInterval = 5000 // 5 seconds
    
    while (Date.now() - startTime < maxWaitTime) {
      const deployment = await this.getDeployment(deploymentId)
      
      if (deployment.readyState === 'READY') {
        console.log(`✅ Deployment ready: ${deployment.url}`)
        return deployment
      }
      
      if (deployment.readyState === 'ERROR' || deployment.readyState === 'CANCELED') {
        throw new Error(`Deployment failed with state: ${deployment.readyState}`)
      }
      
      console.log(`⏳ Deployment building: ${deployment.readyState}`)
      await new Promise(resolve => setTimeout(resolve, pollInterval))
    }
    
    throw new Error('Deployment timeout - taking longer than expected')
  }
  
  /**
   * Get deployment analytics
   */
  async getDeploymentAnalytics(projectId: string, timeframe: 'day' | 'week' | 'month' = 'week'): Promise<{
    totalDeployments: number
    successfulDeployments: number
    failedDeployments: number
    averageBuildTime: number
    deploymentsByDay: Array<{ date: string; count: number }>
    buildTimeDistribution: Array<{ range: string; count: number }>
  }> {
    const deployments = await this.getProjectDeployments(projectId, 100)
    
    const timeRange = this.getTimeRange(timeframe)
    const recentDeployments = deployments.filter(d => 
      d.createdAt >= timeRange.start && d.createdAt <= timeRange.end
    )
    
    const successfulDeployments = recentDeployments.filter(d => d.readyState === 'READY')
    const failedDeployments = recentDeployments.filter(d => d.readyState === 'ERROR')
    
    // Calculate average build time
    const buildTimes = successfulDeployments
      .filter(d => d.buildingAt && d.readyAt)
      .map(d => d.readyAt!.getTime() - d.buildingAt!.getTime())
    
    const averageBuildTime = buildTimes.length > 0
      ? buildTimes.reduce((sum, time) => sum + time, 0) / buildTimes.length / 1000 // Convert to seconds
      : 0
    
    // Group deployments by day
    const deploymentsByDay = this.groupDeploymentsByDay(recentDeployments)
    
    // Build time distribution
    const buildTimeDistribution = this.calculateBuildTimeDistribution(buildTimes)
    
    return {
      totalDeployments: recentDeployments.length,
      successfulDeployments: successfulDeployments.length,
      failedDeployments: failedDeployments.length,
      averageBuildTime: Math.round(averageBuildTime),
      deploymentsByDay,
      buildTimeDistribution
    }
  }
  
  // Private helper methods
  
  private async makeRequest(method: string, endpoint: string, data?: any): Promise<any> {
    const url = `${this.apiUrl}${endpoint}`
    
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    }
    
    if (this.teamId) {
      options.headers = {
        ...options.headers,
        'X-Vercel-Team-Id': this.teamId
      }
    }
    
    if (data) {
      options.body = JSON.stringify(data)
    }
    
    const response = await fetch(url, options)
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Vercel API error: ${response.status} ${response.statusText} - ${errorText}`)
    }
    
    return response.json()
  }
  
  private sanitizeProjectName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 52) // Vercel project name limit
  }
  
  private getTimeRange(timeframe: string): { start: Date; end: Date } {
    const now = new Date()
    const start = new Date()
    
    switch (timeframe) {
      case 'day':
        start.setHours(0, 0, 0, 0)
        break
      case 'week':
        start.setDate(now.getDate() - 7)
        break
      case 'month':
        start.setMonth(now.getMonth() - 1)
        break
    }
    
    return { start, end: now }
  }
  
  private groupDeploymentsByDay(deployments: VercelDeployment[]) {
    const dailyCount = new Map<string, number>()
    
    deployments.forEach(deployment => {
      const dateKey = deployment.createdAt.toISOString().split('T')[0]
      dailyCount.set(dateKey, (dailyCount.get(dateKey) || 0) + 1)
    })
    
    return Array.from(dailyCount.entries()).map(([date, count]) => ({
      date,
      count
    })).sort((a, b) => a.date.localeCompare(b.date))
  }
  
  private calculateBuildTimeDistribution(buildTimes: number[]) {
    const ranges = [
      { label: '0-30s', min: 0, max: 30000 },
      { label: '30s-1m', min: 30000, max: 60000 },
      { label: '1-2m', min: 60000, max: 120000 },
      { label: '2-5m', min: 120000, max: 300000 },
      { label: '5m+', min: 300000, max: Infinity }
    ]
    
    return ranges.map(range => ({
      range: range.label,
      count: buildTimes.filter(time => time >= range.min && time < range.max).length
    }))
  }
}

// Export singleton instance
export const vercelService = new VercelService()
