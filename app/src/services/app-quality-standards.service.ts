// App Quality Standards and Validation Service
// Ensures repositories meet marketplace standards before becoming tradeable app cards

export interface AppQualityStandards {
  minimumRequirements: QualityRequirement[]
  scoringCriteria: ScoringCriteria
  categoryRequirements: CategoryRequirements
  marketplaceEligibility: MarketplaceEligibility
}

export interface QualityRequirement {
  id: string
  name: string
  description: string
  weight: number
  required: boolean
  validator: (repo: any) => boolean
}

export interface QualityScore {
  overall: number
  breakdown: {
    [category: string]: number
  }
  requirements: {
    [requirementId: string]: {
      passed: boolean
      score: number
      message: string
    }
  }
  eligibleForMarketplace: boolean
  suggestedImprovements: string[]
}

export interface ScoringCriteria {
  codeQuality: number
  documentation: number
  functionality: number
  innovation: number
  marketPotential: number
  technicalDepth: number
}

export interface CategoryRequirements {
  majors: AppCategoryRequirement
  minors: AppCategoryRequirement
  mvps: AppCategoryRequirement
}

export interface AppCategoryRequirement {
  minimumScore: number
  requiredFeatures: string[]
  complexityLevel: string[]
  marketValueThreshold: number
}

export interface MarketplaceEligibility {
  minimumOverallScore: number
  requiredChecks: string[]
  prohibitedContent: string[]
  technicalRequirements: string[]
}

export class AppQualityService {
  
  private static readonly QUALITY_STANDARDS: AppQualityStandards = {
    minimumRequirements: [
      {
        id: 'has_readme',
        name: 'README Documentation',
        description: 'Must have a comprehensive README.md file',
        weight: 10,
        required: true,
        validator: (repo) => repo.analysis.hasReadme
      },
      {
        id: 'meaningful_description',
        name: 'Clear Description',
        description: 'Repository must have a meaningful description (min 20 characters)',
        weight: 8,
        required: true,
        validator: (repo) => repo.analysis.description && repo.analysis.description.length >= 20
      },
      {
        id: 'active_development',
        name: 'Recent Activity',
        description: 'Must have been updated within the last 2 years',
        weight: 15,
        required: true,
        validator: (repo) => {
          const lastUpdate = new Date(repo.analysis.lastUpdated)
          const twoYearsAgo = new Date()
          twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
          return lastUpdate > twoYearsAgo
        }
      },
      {
        id: 'minimum_size',
        name: 'Substantial Codebase',
        description: 'Repository must have at least 1KB of code',
        weight: 5,
        required: true,
        validator: (repo) => repo.analysis.size >= 1
      },
      {
        id: 'license',
        name: 'Open Source License',
        description: 'Should have a recognized open source license',
        weight: 7,
        required: false,
        validator: (repo) => repo.analysis.hasLicense || false
      },
      {
        id: 'no_placeholder_content',
        name: 'Original Content',
        description: 'Must not be a fork without significant modifications',
        weight: 12,
        required: true,
        validator: (repo) => {
          const placeholderTerms = ['hello world', 'test repo', 'sample', 'template', 'boilerplate']
          const description = repo.analysis.description?.toLowerCase() || ''
          const name = repo.name.toLowerCase()
          return !placeholderTerms.some(term => description.includes(term) || name.includes(term))
        }
      },
      {
        id: 'functional_app',
        name: 'Functional Application',
        description: 'Must be a functional application, not just a library or config',
        weight: 20,
        required: true,
        validator: (repo) => this.isFunctionalApp(repo)
      },
      {
        id: 'quality_code',
        name: 'Code Quality',
        description: 'Must demonstrate good coding practices',
        weight: 15,
        required: false,
        validator: (repo) => this.assessCodeQuality(repo)
      },
      {
        id: 'deployment_ready',
        name: 'Deployment Ready',
        description: 'Should have deployment configuration or instructions',
        weight: 8,
        required: false,
        validator: (repo) => this.hasDeploymentConfig(repo)
      },
      {
        id: 'user_interface',
        name: 'User Interface',
        description: 'Should have a user-facing interface (web, mobile, desktop, or CLI)',
        weight: 10,
        required: false,
        validator: (repo) => this.hasUserInterface(repo)
      }
    ],
    
    scoringCriteria: {
      codeQuality: 25,
      documentation: 20,
      functionality: 25,
      innovation: 15,
      marketPotential: 10,
      technicalDepth: 5
    },
    
    categoryRequirements: {
      majors: {
        minimumScore: 75,
        requiredFeatures: ['has_readme', 'meaningful_description', 'active_development', 'functional_app'],
        complexityLevel: ['complex', 'enterprise'],
        marketValueThreshold: 1000
      },
      minors: {
        minimumScore: 60,
        requiredFeatures: ['has_readme', 'meaningful_description', 'functional_app'],
        complexityLevel: ['moderate', 'complex'],
        marketValueThreshold: 500
      },
      mvps: {
        minimumScore: 45,
        requiredFeatures: ['meaningful_description', 'functional_app'],
        complexityLevel: ['simple', 'moderate'],
        marketValueThreshold: 100
      }
    },
    
    marketplaceEligibility: {
      minimumOverallScore: 50,
      requiredChecks: ['has_readme', 'meaningful_description', 'active_development', 'functional_app'],
      prohibitedContent: [
        'malware', 'virus', 'hack', 'exploit', 'crack', 'piracy',
        'adult content', 'gambling', 'violence', 'hate speech'
      ],
      technicalRequirements: [
        'runnable_code',
        'documented_setup',
        'clear_purpose'
      ]
    }
  }

  // Validate if repository meets app standards
  static validateApp(repo: any): QualityScore {
    const requirements = this.QUALITY_STANDARDS.minimumRequirements
    const results: QualityScore = {
      overall: 0,
      breakdown: {},
      requirements: {},
      eligibleForMarketplace: false,
      suggestedImprovements: []
    }

    let totalWeight = 0
    let achievedScore = 0

    // Evaluate each requirement
    requirements.forEach(requirement => {
      const passed = requirement.validator(repo)
      const score = passed ? requirement.weight : 0
      
      results.requirements[requirement.id] = {
        passed,
        score,
        message: passed ? 'Requirement met' : requirement.description
      }

      if (requirement.required && !passed) {
        results.suggestedImprovements.push(`Required: ${requirement.name}`)
      } else if (!passed) {
        results.suggestedImprovements.push(`Improve: ${requirement.name}`)
      }

      totalWeight += requirement.weight
      achievedScore += score
    })

    // Calculate overall score
    results.overall = Math.round((achievedScore / totalWeight) * 100)

    // Check marketplace eligibility
    const requiredChecksPassed = this.QUALITY_STANDARDS.marketplaceEligibility.requiredChecks
      .every(checkId => results.requirements[checkId]?.passed)
    
    const meetsMinimumScore = results.overall >= this.QUALITY_STANDARDS.marketplaceEligibility.minimumOverallScore
    const hasNoProhibitedContent = !this.hasProhibitedContent(repo)

    results.eligibleForMarketplace = requiredChecksPassed && meetsMinimumScore && hasNoProhibitedContent

    // Category-specific breakdown
    results.breakdown = this.calculateCategoryBreakdown(repo, results)

    return results
  }

  // Determine appropriate category based on standards
  static determineCategory(repo: any, qualityScore: QualityScore): 'majors' | 'minors' | 'mvps' | 'rejected' {
    const { categoryRequirements } = this.QUALITY_STANDARDS

    // Check majors first (highest standard)
    if (this.meetsCategoryRequirements(repo, qualityScore, categoryRequirements.majors)) {
      return 'majors'
    }

    // Check minors
    if (this.meetsCategoryRequirements(repo, qualityScore, categoryRequirements.minors)) {
      return 'minors'
    }

    // Check mvps
    if (this.meetsCategoryRequirements(repo, qualityScore, categoryRequirements.mvps)) {
      return 'mvps'
    }

    return 'rejected'
  }

  // Check if app meets category requirements
  private static meetsCategoryRequirements(
    repo: any, 
    qualityScore: QualityScore, 
    requirements: AppCategoryRequirement
  ): boolean {
    // Check minimum score
    if (qualityScore.overall < requirements.minimumScore) {
      return false
    }

    // Check required features
    const requiredFeaturesPassed = requirements.requiredFeatures
      .every(featureId => qualityScore.requirements[featureId]?.passed)
    
    if (!requiredFeaturesPassed) {
      return false
    }

    // Check complexity level
    if (!requirements.complexityLevel.includes(repo.analysis.complexity)) {
      return false
    }

    // All checks passed
    return true
  }

  // Helper methods for validation
  private static isFunctionalApp(repo: any): boolean {
    const appIndicators = [
      'app', 'application', 'website', 'web app', 'mobile app',
      'game', 'tool', 'platform', 'system', 'service', 'dashboard',
      'interface', 'client', 'server', 'api', 'bot', 'extension'
    ]
    
    const description = repo.analysis.description?.toLowerCase() || ''
    const name = repo.name.toLowerCase()
    const techStack = repo.analysis.techStack || []
    
    // Check if description or name indicates it's an app
    const hasAppIndicator = appIndicators.some(indicator => 
      description.includes(indicator) || name.includes(indicator)
    )

    // Check if tech stack suggests it's an app
    const appTechnologies = [
      'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt',
      'express', 'fastapi', 'django', 'flask', 'rails',
      'unity', 'unreal', 'electron', 'react native', 'flutter',
      'web', 'mobile', 'desktop', 'game', 'api'
    ]
    
    const hasAppTech = techStack.some((tech: string) => 
      appTechnologies.some(appTech => tech.toLowerCase().includes(appTech))
    )

    return hasAppIndicator || hasAppTech || repo.analysis.hasUserInterface
  }

  private static assessCodeQuality(repo: any): boolean {
    let qualityScore = 0

    // Check for tests
    if (repo.analysis.hasTests) qualityScore += 30

    // Check for CI/CD
    if (repo.analysis.hasCI) qualityScore += 20

    // Check for multiple languages (indicates complexity)
    if (Object.keys(repo.analysis.languages || {}).length > 2) qualityScore += 15

    // Check for documentation
    if (repo.analysis.hasReadme) qualityScore += 20

    // Check for substantial size
    if (repo.analysis.size > 100) qualityScore += 15

    return qualityScore >= 50
  }

  private static hasDeploymentConfig(repo: any): boolean {
    const deploymentFiles = [
      'dockerfile', 'docker-compose', 'vercel.json', 'netlify.toml',
      'package.json', 'requirements.txt', 'Procfile', 'manifest.json'
    ]
    
    // This would check for deployment files in a real implementation
    // For now, we'll base it on tech stack
    const techStack = repo.analysis.techStack || []
    const deploymentIndicators = ['docker', 'vercel', 'netlify', 'heroku', 'aws']
    
    return deploymentIndicators.some(indicator => 
      techStack.some((tech: string) => tech.toLowerCase().includes(indicator))
    )
  }

  private static hasUserInterface(repo: any): boolean {
    const uiTechnologies = [
      'react', 'vue', 'angular', 'svelte', 'html', 'css',
      'flutter', 'react native', 'swift', 'kotlin',
      'electron', 'unity', 'unreal', 'wpf', 'javafx'
    ]
    
    const techStack = repo.analysis.techStack || []
    
    return uiTechnologies.some(uiTech => 
      techStack.some((tech: string) => tech.toLowerCase().includes(uiTech))
    )
  }

  private static hasProhibitedContent(repo: any): boolean {
    const prohibited = this.QUALITY_STANDARDS.marketplaceEligibility.prohibitedContent
    const description = repo.analysis.description?.toLowerCase() || ''
    const name = repo.name.toLowerCase()
    
    return prohibited.some(term => 
      description.includes(term) || name.includes(term)
    )
  }

  private static calculateCategoryBreakdown(repo: any, results: QualityScore): { [category: string]: number } {
    return {
      codeQuality: this.assessCodeQuality(repo) ? 85 : 45,
      documentation: results.requirements['has_readme']?.passed ? 90 : 30,
      functionality: results.requirements['functional_app']?.passed ? 95 : 20,
      innovation: Math.min(100, 50 + (repo.analysis.stars || 0) / 10),
      marketPotential: Math.min(100, 40 + (repo.analysis.forks || 0) * 5),
      technicalDepth: Math.min(100, 30 + Object.keys(repo.analysis.languages || {}).length * 15)
    }
  }

  // Public method to get improvement suggestions
  static getImprovementSuggestions(repo: any, qualityScore: QualityScore): string[] {
    const suggestions: string[] = []

    if (!qualityScore.requirements['has_readme']?.passed) {
      suggestions.push('Add a comprehensive README.md with setup instructions, features, and usage examples')
    }

    if (!qualityScore.requirements['meaningful_description']?.passed) {
      suggestions.push('Provide a clear, detailed description of what your app does')
    }

    if (!qualityScore.requirements['license']?.passed) {
      suggestions.push('Add an open source license to increase trust and adoption')
    }

    if (!qualityScore.requirements['quality_code']?.passed) {
      suggestions.push('Add tests, improve code organization, or set up CI/CD')
    }

    if (!qualityScore.requirements['deployment_ready']?.passed) {
      suggestions.push('Add deployment configuration (Dockerfile, package.json scripts, etc.)')
    }

    if (qualityScore.overall < 70) {
      suggestions.push('Increase repository size and complexity with more features')
      suggestions.push('Add screenshots or demo videos to showcase your app')
      suggestions.push('Improve documentation with API docs or user guides')
    }

    return suggestions
  }

  // Check if repository is eligible for specific marketplace features
  static getMarketplaceFeatures(qualityScore: QualityScore): {
    canTrade: boolean
    canBattle: boolean
    canBet: boolean
    canAuction: boolean
    premiumListing: boolean
  } {
    const overall = qualityScore.overall

    return {
      canTrade: overall >= 45,
      canBattle: overall >= 50,
      canBet: overall >= 55,
      canAuction: overall >= 60,
      premiumListing: overall >= 75
    }
  }
}
