// Repository Card Generator Service
// Automatically generates trading cards from connected repositories

import { GitHubRepoCard } from '../data/github-repo-cards'
import { AppQualityService, QualityScore } from './app-quality-standards.service'

export interface RepoAnalysis {
  name: string
  description: string
  language: string
  languages: { [key: string]: number }
  stars: number
  forks: number
  size: number
  complexity: 'simple' | 'moderate' | 'complex' | 'enterprise'
  techStack: string[]
  lastUpdated: string
  isPublic: boolean
  hasReadme: boolean
  hasTests: boolean
  hasCI: boolean
  contributors: number
}

export interface ProviderRepo {
  id: string
  name: string
  fullName: string
  url: string
  provider: 'github' | 'gitlab' | 'azure' | 'aws' | 'bitbucket' | 'sourcehut' | 'codeberg' | 'gitea'
  analysis: RepoAnalysis
  qualityScore?: QualityScore
  eligibleForMarketplace?: boolean
}

export class RepoCardGeneratorService {
  
  // Connect to different repository providers
  static async connectProvider(provider: string, accessToken: string): Promise<ProviderRepo[]> {
    let repos: ProviderRepo[] = []
    
    switch (provider) {
      case 'github':
        repos = await this.fetchGitHubRepos(accessToken)
        break
      case 'gitlab':
        repos = await this.fetchGitLabRepos(accessToken)
        break
      case 'bitbucket':
        repos = await this.fetchBitbucketRepos(accessToken)
        break
      case 'azure':
        repos = await this.fetchAzureRepos(accessToken)
        break
      case 'aws':
        repos = await this.fetchAWSRepos(accessToken)
        break
      case 'sourcehut':
        repos = await this.fetchSourceHutRepos(accessToken)
        break
      case 'codeberg':
        repos = await this.fetchCodebergRepos(accessToken)
        break
      case 'gitea':
        repos = await this.fetchGiteaRepos(accessToken)
        break
      default:
        throw new Error(`Unsupported provider: ${provider}`)
    }

    // Validate each repository against quality standards
    return repos.map(repo => {
      const qualityScore = AppQualityService.validateApp(repo)
      const eligibleForMarketplace = qualityScore.eligibleForMarketplace
      
      return {
        ...repo,
        qualityScore,
        eligibleForMarketplace
      }
    })
  }

  // Generate trading card from repository analysis
  static generateCardFromRepo(repo: ProviderRepo, userId: string): GitHubRepoCard | null {
    // Check if repository meets quality standards
    if (!repo.eligibleForMarketplace) {
      console.warn(`Repository ${repo.name} does not meet marketplace standards`)
      return null
    }

    const qualityScore = repo.qualityScore!
    const suggestedCategory = AppQualityService.determineCategory(repo, qualityScore)
    
    if (suggestedCategory === 'rejected') {
      console.warn(`Repository ${repo.name} was rejected based on quality standards`)
      return null
    }

    const complexity = this.calculateComplexity(repo.analysis)
    const rarity = this.calculateRarity(repo.analysis, qualityScore)
    const category = suggestedCategory
    const battleStats = this.calculateBattleStats(repo.analysis, qualityScore)
    const estimatedValue = this.calculateValue(repo.analysis, qualityScore)

    return {
      id: `${repo.provider}-${repo.id}-${Date.now()}`,
      name: repo.name,
      displayName: repo.analysis.name,
      category,
      githubUrl: repo.url,
      description: repo.analysis.description || 'No description provided',
      techStack: repo.analysis.techStack,
      complexity,
      estimatedValue,
      rarity,
      stats: {
        innovation: this.calculateInnovation(repo.analysis, qualityScore),
        scalability: this.calculateScalability(repo.analysis, qualityScore),
        marketPotential: this.calculateMarketPotential(repo.analysis, qualityScore),
        technicalDepth: this.calculateTechnicalDepth(repo.analysis, qualityScore)
      },
      features: this.extractFeatures(repo.analysis),
      deploymentOptions: this.suggestDeploymentOptions(repo.analysis.techStack),
      battleStats,
      isPublicForTrading: repo.analysis.isPublic && repo.eligibleForMarketplace,
      owner: userId,
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: repo.analysis.lastUpdated
    }
  }

  // Provider-specific implementations
  private static async fetchGitHubRepos(token: string): Promise<ProviderRepo[]> {
    try {
      const response = await fetch('https://api.github.com/user/repos?per_page=100', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch GitHub repositories')
      }
      
      const repos = await response.json()
      
      return Promise.all(repos.map(async (repo: any) => {
        const analysis = await this.analyzeGitHubRepo(repo, token)
        return {
          id: repo.id.toString(),
          name: repo.name,
          fullName: repo.full_name,
          url: repo.html_url,
          provider: 'github' as const,
          analysis
        }
      }))
    } catch (error) {
      console.error('Error fetching GitHub repos:', error)
      return []
    }
  }

  private static async fetchGitLabRepos(token: string): Promise<ProviderRepo[]> {
    try {
      const response = await fetch('https://gitlab.com/api/v4/projects?membership=true&per_page=100', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch GitLab repositories')
      }
      
      const repos = await response.json()
      
      return repos.map((repo: any) => ({
        id: repo.id.toString(),
        name: repo.name,
        fullName: repo.path_with_namespace,
        url: repo.web_url,
        provider: 'gitlab' as const,
        analysis: this.analyzeGitLabRepo(repo)
      }))
    } catch (error) {
      console.error('Error fetching GitLab repos:', error)
      return []
    }
  }

  private static async fetchAzureRepos(token: string): Promise<ProviderRepo[]> {
    // Azure DevOps implementation
    // Would implement Azure DevOps REST API calls
    console.log('Azure repos fetch - implementation needed')
    return []
  }

  private static async fetchAWSRepos(token: string): Promise<ProviderRepo[]> {
    // AWS CodeCommit implementation
    // Would implement AWS CodeCommit API calls
    console.log('AWS repos fetch - implementation needed')
    return []
  }

  private static async fetchBitbucketRepos(token: string): Promise<ProviderRepo[]> {
    try {
      const response = await fetch('https://api.bitbucket.org/2.0/repositories?role=member&per_page=100', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch Bitbucket repositories')
      }
      
      const data = await response.json()
      const repos = data.values || []
      
      return repos.map((repo: any) => ({
        id: repo.uuid,
        name: repo.name,
        fullName: repo.full_name,
        url: repo.links.html.href,
        provider: 'bitbucket' as const,
        analysis: this.analyzeBitbucketRepo(repo)
      }))
    } catch (error) {
      console.error('Error fetching Bitbucket repos:', error)
      return []
    }
  }

  private static async fetchSourceHutRepos(token: string): Promise<ProviderRepo[]> {
    // SourceHut implementation - would use GraphQL API
    console.log('SourceHut repos fetch - implementation needed')
    return []
  }

  private static async fetchCodebergRepos(token: string): Promise<ProviderRepo[]> {
    // Codeberg uses Gitea API
    try {
      const response = await fetch('https://codeberg.org/api/v1/user/repos', {
        headers: {
          'Authorization': `token ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch Codeberg repositories')
      }
      
      const repos = await response.json()
      
      return repos.map((repo: any) => ({
        id: repo.id.toString(),
        name: repo.name,
        fullName: repo.full_name,
        url: repo.html_url,
        provider: 'codeberg' as const,
        analysis: this.analyzeGiteaRepo(repo)
      }))
    } catch (error) {
      console.error('Error fetching Codeberg repos:', error)
      return []
    }
  }

  private static async fetchGiteaRepos(token: string): Promise<ProviderRepo[]> {
    // Generic Gitea implementation - would need instance URL
    console.log('Gitea repos fetch - implementation needed (requires instance URL)')
    return []
  }

  // Repository analysis
  private static async analyzeGitHubRepo(repo: any, token: string): Promise<RepoAnalysis> {
    // Fetch additional details
    const [languagesResponse, contributorsResponse] = await Promise.all([
      fetch(repo.languages_url, {
        headers: { 'Authorization': `token ${token}` }
      }),
      fetch(repo.contributors_url, {
        headers: { 'Authorization': `token ${token}` }
      })
    ])

    const languages = languagesResponse.ok ? await languagesResponse.json() : {}
    const contributors = contributorsResponse.ok ? await contributorsResponse.json() : []

    return {
      name: repo.name,
      description: repo.description || '',
      language: repo.language || 'Unknown',
      languages,
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      size: repo.size || 0,
      complexity: this.calculateComplexityFromSize(repo.size, Object.keys(languages).length),
      techStack: this.extractTechStack(languages, repo.language),
      lastUpdated: repo.updated_at,
      isPublic: !repo.private,
      hasReadme: true, // Assume true, could verify
      hasTests: this.hasTests(languages),
      hasCI: false, // Would need to check for workflow files
      contributors: contributors.length || 1
    }
  }

  private static analyzeGitLabRepo(repo: any): RepoAnalysis {
    return {
      name: repo.name,
      description: repo.description || '',
      language: 'Unknown',
      languages: {},
      stars: repo.star_count || 0,
      forks: repo.forks_count || 0,
      size: 0,
      complexity: 'simple',
      techStack: [],
      lastUpdated: repo.last_activity_at,
      isPublic: repo.visibility === 'public',
      hasReadme: true,
      hasTests: false,
      hasCI: false,
      contributors: 1
    }
  }

  private static analyzeBitbucketRepo(repo: any): RepoAnalysis {
    return {
      name: repo.name,
      description: repo.description || '',
      language: repo.language || 'Unknown',
      languages: {},
      stars: 0, // Bitbucket doesn't have stars
      forks: 0,
      size: repo.size || 0,
      complexity: this.calculateComplexityFromSize(repo.size || 0, 1),
      techStack: repo.language ? [repo.language] : [],
      lastUpdated: repo.updated_on,
      isPublic: !repo.is_private,
      hasReadme: true,
      hasTests: false,
      hasCI: false,
      contributors: 1
    }
  }

  private static analyzeGiteaRepo(repo: any): RepoAnalysis {
    return {
      name: repo.name,
      description: repo.description || '',
      language: repo.language || 'Unknown',
      languages: {},
      stars: repo.stars_count || 0,
      forks: repo.forks_count || 0,
      size: repo.size || 0,
      complexity: this.calculateComplexityFromSize(repo.size || 0, 1),
      techStack: repo.language ? [repo.language] : [],
      lastUpdated: repo.updated_at,
      isPublic: !repo.private,
      hasReadme: true,
      hasTests: false,
      hasCI: false,
      contributors: 1
    }
  }

  // Calculation methods with quality score integration
  private static calculateComplexity(analysis: RepoAnalysis): 'simple' | 'moderate' | 'complex' | 'enterprise' {
    const score = 
      (analysis.size > 10000 ? 2 : analysis.size > 1000 ? 1 : 0) +
      (analysis.contributors > 10 ? 2 : analysis.contributors > 3 ? 1 : 0) +
      (Object.keys(analysis.languages).length > 5 ? 2 : Object.keys(analysis.languages).length > 2 ? 1 : 0) +
      (analysis.hasTests ? 1 : 0) +
      (analysis.hasCI ? 1 : 0)

    if (score >= 7) return 'enterprise'
    if (score >= 5) return 'complex'
    if (score >= 3) return 'moderate'
    return 'simple'
  }

  private static calculateRarity(analysis: RepoAnalysis, qualityScore?: QualityScore): 'common' | 'rare' | 'epic' | 'legendary' | 'mythic' {
    let score = 
      (analysis.stars > 1000 ? 3 : analysis.stars > 100 ? 2 : analysis.stars > 10 ? 1 : 0) +
      (analysis.forks > 500 ? 2 : analysis.forks > 50 ? 1 : 0) +
      (analysis.contributors > 20 ? 2 : analysis.contributors > 5 ? 1 : 0)

    // Boost score based on quality
    if (qualityScore) {
      if (qualityScore.overall >= 90) score += 2
      else if (qualityScore.overall >= 75) score += 1
    }

    if (score >= 7) return 'mythic'
    if (score >= 6) return 'legendary'
    if (score >= 4) return 'epic'
    if (score >= 2) return 'rare'
    return 'common'
  }

  private static calculateBattleStats(analysis: RepoAnalysis, qualityScore?: QualityScore) {
    const qualityBonus = qualityScore ? Math.floor(qualityScore.overall / 10) : 0
    
    return {
      attack: Math.min(100, 50 + (analysis.stars / 10) + (analysis.contributors * 2) + qualityBonus),
      defense: Math.min(100, 40 + (analysis.hasTests ? 20 : 0) + (analysis.hasCI ? 15 : 0) + qualityBonus),
      speed: Math.min(100, 60 + (Object.keys(analysis.languages).length * 5) + qualityBonus),
      utility: Math.min(100, 30 + (analysis.forks / 5) + (analysis.description ? 10 : 0) + qualityBonus)
    }
  }

  private static calculateValue(analysis: RepoAnalysis, qualityScore?: QualityScore): number {
    const baseValue = 100
    const starMultiplier = analysis.stars * 5
    const forkMultiplier = analysis.forks * 3
    const complexityMultiplier = {
      'simple': 1,
      'moderate': 1.5,
      'complex': 2,
      'enterprise': 3
    }[analysis.complexity]

    let value = baseValue + starMultiplier + forkMultiplier * complexityMultiplier

    // Apply quality bonus
    if (qualityScore) {
      const qualityMultiplier = 1 + (qualityScore.overall / 100)
      value *= qualityMultiplier
    }

    return Math.round(value)
  }

  private static calculateInnovation(analysis: RepoAnalysis, qualityScore?: QualityScore): number {
    let score = 50 + (analysis.stars / 20) + (Object.keys(analysis.languages).length * 3)
    
    if (qualityScore?.breakdown?.innovation) {
      score = Math.max(score, qualityScore.breakdown.innovation)
    }
    
    return Math.min(100, score)
  }

  private static calculateScalability(analysis: RepoAnalysis, qualityScore?: QualityScore): number {
    let score = 40 + (analysis.hasTests ? 30 : 0) + (analysis.hasCI ? 20 : 0) + (analysis.contributors * 2)
    
    if (qualityScore?.breakdown?.codeQuality) {
      score = Math.max(score, qualityScore.breakdown.codeQuality)
    }
    
    return Math.min(100, score)
  }

  private static calculateMarketPotential(analysis: RepoAnalysis, qualityScore?: QualityScore): number {
    let score = 30 + (analysis.stars / 10) + (analysis.forks / 5) + (analysis.isPublic ? 20 : 0)
    
    if (qualityScore?.breakdown?.marketPotential) {
      score = Math.max(score, qualityScore.breakdown.marketPotential)
    }
    
    return Math.min(100, score)
  }

  private static calculateTechnicalDepth(analysis: RepoAnalysis, qualityScore?: QualityScore): number {
    let score = 40 + (Object.keys(analysis.languages).length * 8) + (analysis.size / 1000)
    
    if (qualityScore?.breakdown?.technicalDepth) {
      score = Math.max(score, qualityScore.breakdown.technicalDepth)
    }
    
    return Math.min(100, score)
  }

  // Helper methods
  private static calculateComplexityFromSize(size: number, languageCount: number): 'simple' | 'moderate' | 'complex' | 'enterprise' {
    if (size > 50000 || languageCount > 8) return 'enterprise'
    if (size > 10000 || languageCount > 5) return 'complex'
    if (size > 1000 || languageCount > 2) return 'moderate'
    return 'simple'
  }

  private static extractTechStack(languages: { [key: string]: number }, primaryLanguage: string): string[] {
    const stack = Object.keys(languages).slice(0, 5)
    if (primaryLanguage && !stack.includes(primaryLanguage)) {
      stack.unshift(primaryLanguage)
    }
    return stack.slice(0, 5)
  }

  private static hasTests(languages: { [key: string]: number }): boolean {
    const testIndicators = ['jest', 'mocha', 'pytest', 'junit', 'rspec']
    return Object.keys(languages).some(lang => 
      testIndicators.some(test => lang.toLowerCase().includes(test))
    )
  }

  private static extractFeatures(analysis: RepoAnalysis): string[] {
    const features = []
    if (analysis.hasTests) features.push('Test Suite')
    if (analysis.hasCI) features.push('CI/CD')
    if (analysis.hasReadme) features.push('Documentation')
    if (analysis.isPublic) features.push('Open Source')
    if (analysis.contributors > 1) features.push('Collaborative')
    return features
  }

  private static suggestDeploymentOptions(techStack: string[]): string[] {
    const options = ['GitHub Pages', 'Netlify']
    
    if (techStack.includes('JavaScript') || techStack.includes('TypeScript')) {
      options.push('Vercel', 'AWS Lambda')
    }
    if (techStack.includes('Python')) {
      options.push('Heroku', 'Railway')
    }
    if (techStack.includes('Docker')) {
      options.push('Docker Hub', 'AWS ECS')
    }
    
    return options.slice(0, 4)
  }
}
