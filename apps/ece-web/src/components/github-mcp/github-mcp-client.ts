'use client'

import { Octokit } from '@octokit/rest'

export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  clone_url: string
  ssh_url: string
  language: string | null
  languages_url: string
  stargazers_count: number
  forks_count: number
  size: number
  created_at: string
  updated_at: string
  pushed_at: string
  topics: string[]
  license: {
    key: string
    name: string
    url: string
  } | null
  owner: {
    login: string
    avatar_url: string
    type: string
  }
  default_branch: string
  visibility: string
}

export interface RepositoryAnalysis {
  repository: GitHubRepository
  complexity: 'simple' | 'moderate' | 'complex' | 'enterprise'
  techStack: string[]
  estimatedCost: number
  developmentTime: string
  features: string[]
  requirements: string[]
  frameworks: string[]
  deploymentOptions: string[]
}

export class GitHubMCPClient {
  private octokit: Octokit
  private baseUrl: string

  constructor(accessToken?: string) {
    this.octokit = new Octokit({
      auth: accessToken || process.env.NEXT_PUBLIC_GITHUB_TOKEN,
    })
    this.baseUrl = 'https://api.github.com'
  }

  // Parse GitHub URL to extract owner and repo
  parseGitHubUrl(url: string): { owner: string; repo: string } | null {
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/\?#]+)/,
      /^([^\/]+)\/([^\/\?#]+)$/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return {
          owner: match[1],
          repo: match[2].replace(/\.git$/, '')
        }
      }
    }
    return null
  }

  // Fetch repository information
  async fetchRepository(url: string): Promise<GitHubRepository | null> {
    const parsed = this.parseGitHubUrl(url)
    if (!parsed) {
      throw new Error('Invalid GitHub URL format')
    }

    try {
      const { data: repo } = await this.octokit.rest.repos.get({
        owner: parsed.owner,
        repo: parsed.repo,
      })

      const { data: topics } = await this.octokit.rest.repos.getAllTopics({
        owner: parsed.owner,
        repo: parsed.repo,
      })

      return {
        ...repo,
        topics: topics.names || []
      } as GitHubRepository
    } catch (error) {
      console.error('Failed to fetch repository:', error)
      return null
    }
  }

  // Analyze repository for app generation
  async analyzeRepository(repository: GitHubRepository): Promise<RepositoryAnalysis> {
    try {
      // Fetch languages
      const { data: languages } = await this.octokit.rest.repos.listLanguages({
        owner: repository.owner.login,
        repo: repository.name,
      })

      // Fetch package.json if it exists
      let packageJson = null
      try {
        const { data: packageData } = await this.octokit.rest.repos.getContent({
          owner: repository.owner.login,
          repo: repository.name,
          path: 'package.json',
        })
        
        if ('content' in packageData) {
          const content = Buffer.from(packageData.content, 'base64').toString()
          packageJson = JSON.parse(content)
        }
      } catch (e) {
        // package.json doesn't exist, that's okay
      }

      // Analyze tech stack
      const techStack = Object.keys(languages)
      const frameworks = this.detectFrameworks(packageJson, techStack, repository.topics)
      
      // Determine complexity
      const complexity = this.assessComplexity(repository, languages, packageJson)
      
      // Estimate cost and time
      const estimatedCost = this.calculateCost(complexity, repository.size)
      const developmentTime = this.estimateTime(complexity, repository.size)
      
      // Extract features and requirements
      const features = this.extractFeatures(repository, packageJson)
      const requirements = this.generateRequirements(complexity, frameworks)
      const deploymentOptions = this.getDeploymentOptions(frameworks)

      return {
        repository,
        complexity,
        techStack,
        estimatedCost,
        developmentTime,
        features,
        requirements,
        frameworks,
        deploymentOptions
      }
    } catch (error) {
      console.error('Failed to analyze repository:', error)
      throw error
    }
  }

  private detectFrameworks(packageJson: any, techStack: string[], topics: string[]): string[] {
    const frameworks: string[] = []
    
    // Check package.json dependencies
    if (packageJson?.dependencies || packageJson?.devDependencies) {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }
      
      if (deps.react) frameworks.push('React')
      if (deps.next) frameworks.push('Next.js')
      if (deps.vue) frameworks.push('Vue.js')
      if (deps.angular) frameworks.push('Angular')
      if (deps.express) frameworks.push('Express.js')
      if (deps.fastify) frameworks.push('Fastify')
      if (deps.nestjs) frameworks.push('NestJS')
      if (deps.tailwindcss) frameworks.push('Tailwind CSS')
      if (deps.bootstrap) frameworks.push('Bootstrap')
      if (deps.typescript) frameworks.push('TypeScript')
    }

    // Check languages
    if (techStack.includes('JavaScript')) frameworks.push('JavaScript')
    if (techStack.includes('TypeScript')) frameworks.push('TypeScript')
    if (techStack.includes('Python')) frameworks.push('Python')
    if (techStack.includes('Java')) frameworks.push('Java')
    if (techStack.includes('Go')) frameworks.push('Go')
    if (techStack.includes('Rust')) frameworks.push('Rust')

    // Check topics
    topics.forEach(topic => {
      const topicLower = topic.toLowerCase()
      if (topicLower.includes('react')) frameworks.push('React')
      if (topicLower.includes('vue')) frameworks.push('Vue.js')
      if (topicLower.includes('angular')) frameworks.push('Angular')
      if (topicLower.includes('nextjs') || topicLower.includes('next-js')) frameworks.push('Next.js')
    })

    return [...new Set(frameworks)] // Remove duplicates
  }

  private assessComplexity(
    repository: GitHubRepository, 
    languages: any, 
    packageJson: any
  ): 'simple' | 'moderate' | 'complex' | 'enterprise' {
    let score = 0

    // Size factor
    if (repository.size > 10000) score += 3
    else if (repository.size > 5000) score += 2
    else if (repository.size > 1000) score += 1

    // Language diversity
    const langCount = Object.keys(languages).length
    if (langCount > 5) score += 3
    else if (langCount > 3) score += 2
    else if (langCount > 1) score += 1

    // Dependencies
    if (packageJson?.dependencies) {
      const depCount = Object.keys(packageJson.dependencies).length
      if (depCount > 50) score += 3
      else if (depCount > 25) score += 2
      else if (depCount > 10) score += 1
    }

    // Stars and activity (popularity indicates complexity)
    if (repository.stargazers_count > 1000) score += 2
    if (repository.forks_count > 100) score += 1

    if (score >= 8) return 'enterprise'
    if (score >= 5) return 'complex'
    if (score >= 3) return 'moderate'
    return 'simple'
  }

  private calculateCost(complexity: string, size: number): number {
    const baseCosts = {
      simple: 50,
      moderate: 150,
      complex: 350,
      enterprise: 750
    }

    const sizeFactor = Math.min(size / 1000, 5) // Cap at 5x multiplier
    return Math.round(baseCosts[complexity as keyof typeof baseCosts] * (1 + sizeFactor * 0.2))
  }

  private estimateTime(complexity: string, size: number): string {
    const baseTimes = {
      simple: { min: 1, max: 3 },
      moderate: { min: 3, max: 7 },
      complex: { min: 7, max: 14 },
      enterprise: { min: 14, max: 30 }
    }

    const times = baseTimes[complexity as keyof typeof baseTimes]
    const sizeFactor = Math.min(size / 5000, 2) // Cap at 2x multiplier
    
    const minDays = Math.round(times.min * (1 + sizeFactor * 0.3))
    const maxDays = Math.round(times.max * (1 + sizeFactor * 0.3))

    if (maxDays <= 7) return `${minDays}-${maxDays} days`
    if (maxDays <= 30) return `${Math.round(minDays / 7)}-${Math.round(maxDays / 7)} weeks`
    return `${Math.round(minDays / 30)}-${Math.round(maxDays / 30)} months`
  }

  private extractFeatures(repository: GitHubRepository, packageJson: any): string[] {
    const features: string[] = []

    // Basic features from repository info
    if (repository.description) {
      const desc = repository.description.toLowerCase()
      if (desc.includes('api')) features.push('REST API')
      if (desc.includes('auth')) features.push('Authentication')
      if (desc.includes('database') || desc.includes('db')) features.push('Database Integration')
      if (desc.includes('real-time') || desc.includes('websocket')) features.push('Real-time Features')
      if (desc.includes('mobile')) features.push('Mobile Support')
      if (desc.includes('admin')) features.push('Admin Panel')
    }

    // Features from package.json
    if (packageJson?.dependencies) {
      const deps = packageJson.dependencies
      if (deps['socket.io']) features.push('Real-time Communication')
      if (deps.stripe) features.push('Payment Processing')
      if (deps.passport || deps['next-auth']) features.push('Authentication')
      if (deps.prisma || deps.mongoose) features.push('Database ORM')
      if (deps.redis) features.push('Caching')
      if (deps.nodemailer) features.push('Email Service')
    }

    // Features from topics
    repository.topics.forEach(topic => {
      const topicLower = topic.toLowerCase()
      if (topicLower === 'pwa') features.push('Progressive Web App')
      if (topicLower === 'sso') features.push('Single Sign-On')
      if (topicLower === 'microservices') features.push('Microservices Architecture')
      if (topicLower === 'serverless') features.push('Serverless Functions')
    })

    return features.length > 0 ? features : ['Custom Application Logic', 'User Interface', 'Data Management']
  }

  private generateRequirements(complexity: string, frameworks: string[]): string[] {
    const baseRequirements = [
      'Modern web browser support',
      'Responsive design',
      'Performance optimization'
    ]

    const complexityRequirements = {
      simple: ['Basic hosting', 'SSL certificate'],
      moderate: ['Database setup', 'CDN integration', 'Basic monitoring'],
      complex: ['Load balancing', 'Advanced monitoring', 'CI/CD pipeline', 'Error tracking'],
      enterprise: ['High availability setup', 'Advanced security', 'Scalable infrastructure', 'Compliance requirements']
    }

    const frameworkRequirements: Record<string, string[]> = {
      'React': ['Node.js runtime'],
      'Next.js': ['Vercel or similar hosting'],
      'Python': ['Python runtime environment'],
      'Java': ['JVM hosting'],
      'Go': ['Binary hosting'],
      'TypeScript': ['Node.js with TypeScript support']
    }

    let requirements = [...baseRequirements, ...complexityRequirements[complexity as keyof typeof complexityRequirements]]

    frameworks.forEach(framework => {
      if (frameworkRequirements[framework]) {
        requirements.push(...frameworkRequirements[framework])
      }
    })

    return [...new Set(requirements)]
  }

  private getDeploymentOptions(frameworks: string[]): string[] {
    const options = ['Vercel', 'Netlify', 'GitHub Pages']

    if (frameworks.includes('Next.js') || frameworks.includes('React')) {
      options.push('Vercel (Recommended)', 'Netlify')
    }

    if (frameworks.includes('Node.js') || frameworks.includes('Express.js')) {
      options.push('Railway', 'Render', 'Heroku', 'AWS EC2')
    }

    if (frameworks.includes('Python')) {
      options.push('Railway', 'Render', 'PythonAnywhere', 'AWS Lambda')
    }

    if (frameworks.includes('Java')) {
      options.push('AWS Elastic Beanstalk', 'Google Cloud Run', 'Azure App Service')
    }

    return [...new Set(options)]
  }

  // Search repositories
  async searchRepositories(query: string, options?: {
    sort?: 'stars' | 'forks' | 'updated'
    order?: 'asc' | 'desc'
    per_page?: number
  }): Promise<GitHubRepository[]> {
    try {
      const { data } = await this.octokit.rest.search.repos({
        q: query,
        sort: options?.sort || 'stars',
        order: options?.order || 'desc',
        per_page: options?.per_page || 10,
      })

      return data.items as GitHubRepository[]
    } catch (error) {
      console.error('Failed to search repositories:', error)
      return []
    }
  }

  // Get user repositories
  async getUserRepositories(username: string): Promise<GitHubRepository[]> {
    try {
      const { data } = await this.octokit.rest.repos.listForUser({
        username,
        sort: 'updated',
        per_page: 100,
      })

      return data as GitHubRepository[]
    } catch (error) {
      console.error('Failed to fetch user repositories:', error)
      return []
    }
  }
}

// Create singleton instance
export const githubMCP = new GitHubMCPClient()
