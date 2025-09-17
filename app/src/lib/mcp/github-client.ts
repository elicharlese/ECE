import { Octokit } from '@octokit/rest'

interface Repository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  languages_url: string
  size: number
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  created_at: string
  updated_at: string
  pushed_at: string
  topics: string[]
  license: {
    key: string
    name: string
  } | null
  owner: {
    login: string
    avatar_url: string
    type: string
  }
}

interface RepositoryAnalysis {
  repository: Repository
  complexity: number
  quality: number
  languages: Record<string, number>
  framework: string | null
  category: 'web' | 'mobile' | 'desktop' | 'api' | 'library' | 'other'
  deploymentReady: boolean
  cardTier: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
  estimatedValue: number
}

interface MCPClientConfig {
  githubToken?: string
  baseUrl?: string
  timeout?: number
}

export class GitHubMCPClient {
  private octokit: Octokit
  private config: MCPClientConfig

  constructor(config: MCPClientConfig = {}) {
    this.config = config
    this.octokit = new Octokit({
      auth: config.githubToken,
      baseUrl: config.baseUrl || 'https://api.github.com',
      request: {
        timeout: config.timeout || 30000
      }
    })
  }

  async authenticateUser(token: string): Promise<any> {
    try {
      this.octokit = new Octokit({ auth: token })
      const { data: user } = await this.octokit.rest.users.getAuthenticated()
      return user
    } catch (error) {
      console.error('GitHub authentication failed:', error)
      throw new Error('Failed to authenticate with GitHub')
    }
  }

  async getUserRepositories(username?: string): Promise<Repository[]> {
    try {
      const { data: repos } = username 
        ? await this.octokit.rest.repos.listForUser({ username, per_page: 100 })
        : await this.octokit.rest.repos.listForAuthenticatedUser({ per_page: 100 })
      
      return repos as Repository[]
    } catch (error) {
      console.error('Failed to fetch repositories:', error)
      throw new Error('Failed to fetch repositories')
    }
  }

  async getRepository(owner: string, repo: string): Promise<Repository> {
    try {
      const { data: repository } = await this.octokit.rest.repos.get({ owner, repo })
      return repository as Repository
    } catch (error) {
      console.error(`Failed to fetch repository ${owner}/${repo}:`, error)
      throw new Error(`Failed to fetch repository ${owner}/${repo}`)
    }
  }

  async getRepositoryLanguages(owner: string, repo: string): Promise<Record<string, number>> {
    try {
      const { data: languages } = await this.octokit.rest.repos.listLanguages({ owner, repo })
      return languages
    } catch (error) {
      console.error(`Failed to fetch languages for ${owner}/${repo}:`, error)
      return {}
    }
  }

  async analyzeRepository(owner: string, repo: string): Promise<RepositoryAnalysis> {
    try {
      const repository = await this.getRepository(owner, repo)
      const languages = await this.getRepositoryLanguages(owner, repo)

      // Calculate complexity based on size, languages, and activity
      const complexity = this.calculateComplexity(repository, languages)
      
      // Calculate quality based on stars, forks, and maintenance
      const quality = this.calculateQuality(repository)
      
      // Detect framework and category
      const framework = this.detectFramework(languages, repository.topics)
      const category = this.categorizeRepository(languages, repository.topics, framework)
      
      // Determine deployment readiness
      const deploymentReady = this.assessDeploymentReadiness(repository, languages)
      
      // Calculate card tier based on various factors
      const cardTier = this.determineCardTier(repository, complexity, quality)
      
      // Estimate market value
      const estimatedValue = this.estimateValue(repository, complexity, quality, cardTier)

      return {
        repository,
        complexity,
        quality,
        languages,
        framework,
        category,
        deploymentReady,
        cardTier,
        estimatedValue
      }
    } catch (error) {
      console.error(`Failed to analyze repository ${owner}/${repo}:`, error)
      throw new Error(`Failed to analyze repository ${owner}/${repo}`)
    }
  }

  private calculateComplexity(repo: Repository, languages: Record<string, number>): number {
    let score = 0
    
    // Size factor (0-30 points)
    score += Math.min(repo.size / 1000, 30)
    
    // Language diversity (0-25 points)
    const languageCount = Object.keys(languages).length
    score += Math.min(languageCount * 5, 25)
    
    // Activity factor (0-20 points)
    const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24)
    score += Math.max(20 - daysSinceUpdate / 30, 0)
    
    // Popularity factor (0-25 points)
    score += Math.min(repo.stargazers_count / 10, 25)
    
    return Math.min(Math.round(score), 100)
  }

  private calculateQuality(repo: Repository): number {
    let score = 0
    
    // Stars to forks ratio (0-25 points)
    const starForkRatio = repo.forks_count > 0 ? repo.stargazers_count / repo.forks_count : repo.stargazers_count
    score += Math.min(starForkRatio, 25)
    
    // Maintenance score (0-25 points)
    const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24)
    score += Math.max(25 - daysSinceUpdate / 7, 0)
    
    // Community engagement (0-25 points)
    score += Math.min(repo.stargazers_count / 5, 25)
    
    // Description and documentation (0-25 points)
    if (repo.description) score += 10
    if (repo.license) score += 10
    if (repo.topics && repo.topics.length > 0) score += 5
    
    return Math.min(Math.round(score), 100)
  }

  private detectFramework(languages: Record<string, number>, topics: string[]): string | null {
    const topicMap: Record<string, string> = {
      'react': 'React',
      'nextjs': 'Next.js',
      'vue': 'Vue.js',
      'angular': 'Angular',
      'svelte': 'Svelte',
      'express': 'Express.js',
      'django': 'Django',
      'flask': 'Flask',
      'rails': 'Ruby on Rails',
      'spring': 'Spring Boot'
    }

    for (const topic of topics) {
      if (topicMap[topic.toLowerCase()]) {
        return topicMap[topic.toLowerCase()]
      }
    }

    // Language-based detection
    const primaryLanguage = Object.keys(languages)[0]
    const languageFrameworks: Record<string, string> = {
      'JavaScript': 'JavaScript',
      'TypeScript': 'TypeScript',
      'Python': 'Python',
      'Java': 'Java',
      'C#': '.NET',
      'Go': 'Go',
      'Rust': 'Rust',
      'Swift': 'Swift'
    }

    return languageFrameworks[primaryLanguage] || null
  }

  private categorizeRepository(
    languages: Record<string, number>, 
    topics: string[], 
    framework: string | null
  ): 'web' | 'mobile' | 'desktop' | 'api' | 'library' | 'other' {
    const webTopics = ['web', 'frontend', 'backend', 'fullstack', 'webapp', 'website']
    const mobileTopics = ['mobile', 'ios', 'android', 'react-native', 'flutter']
    const desktopTopics = ['desktop', 'electron', 'gtk', 'qt']
    const apiTopics = ['api', 'rest', 'graphql', 'microservice']
    const libraryTopics = ['library', 'framework', 'package', 'npm', 'sdk']

    for (const topic of topics) {
      if (webTopics.includes(topic.toLowerCase())) return 'web'
      if (mobileTopics.includes(topic.toLowerCase())) return 'mobile'
      if (desktopTopics.includes(topic.toLowerCase())) return 'desktop'
      if (apiTopics.includes(topic.toLowerCase())) return 'api'
      if (libraryTopics.includes(topic.toLowerCase())) return 'library'
    }

    // Framework-based categorization
    if (framework) {
      const webFrameworks = ['React', 'Next.js', 'Vue.js', 'Angular', 'Svelte']
      if (webFrameworks.includes(framework)) return 'web'
    }

    return 'other'
  }

  private assessDeploymentReadiness(repo: Repository, languages: Record<string, number>): boolean {
    // Check for common deployment files and configurations
    const deploymentIndicators = [
      'Dockerfile', 'docker-compose.yml', 'package.json', 'requirements.txt',
      'Gemfile', 'pom.xml', 'go.mod', 'Cargo.toml'
    ]

    // This would need actual file checking, but for now we'll use heuristics
    const hasDescription = !!repo.description
    const hasTopics = repo.topics && repo.topics.length > 0
    const isRecent = (Date.now() - new Date(repo.updated_at).getTime()) < (90 * 24 * 60 * 60 * 1000) // 90 days
    const hasActivity = repo.stargazers_count > 0 || repo.forks_count > 0

    return hasDescription && hasTopics && isRecent && hasActivity
  }

  private determineCardTier(
    repo: Repository, 
    complexity: number, 
    quality: number
  ): 'common' | 'rare' | 'epic' | 'legendary' | 'mythic' {
    const score = (complexity + quality) / 2

    if (score >= 90 && repo.stargazers_count >= 1000) return 'mythic'
    if (score >= 80 && repo.stargazers_count >= 100) return 'legendary'
    if (score >= 65 && repo.stargazers_count >= 25) return 'epic'
    if (score >= 50 && repo.stargazers_count >= 5) return 'rare'
    return 'common'
  }

  private estimateValue(
    repo: Repository, 
    complexity: number, 
    quality: number, 
    cardTier: string
  ): number {
    const baseValues = {
      common: 10,
      rare: 50,
      epic: 150,
      legendary: 500,
      mythic: 1500
    }

    const baseValue = baseValues[cardTier as keyof typeof baseValues]
    const multiplier = (complexity + quality) / 100
    const popularityBonus = Math.log10(repo.stargazers_count + 1) * 10

    return Math.round(baseValue * multiplier + popularityBonus)
  }

  async validateRepositoryUrl(url: string): Promise<{ owner: string; repo: string } | null> {
    try {
      const githubUrlPattern = /github\.com\/([^\/]+)\/([^\/]+)/
      const match = url.match(githubUrlPattern)
      
      if (!match) return null
      
      const [, owner, repo] = match
      const cleanRepo = repo.replace(/\.git$/, '')
      
      // Verify repository exists
      await this.getRepository(owner, cleanRepo)
      
      return { owner, repo: cleanRepo }
    } catch (error) {
      return null
    }
  }
}
