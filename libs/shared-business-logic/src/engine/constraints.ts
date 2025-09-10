// Constraint system for different application types and platforms

import type { ProjectType, ProjectConstraints, TechStack, PlatformTarget } from './types'

export class ConstraintEngine {
  private static constraints: Map<ProjectType, ProjectConstraints> = new Map()

  static initialize() {
    // Nx Monorepo constraints
    this.constraints.set('nx-monorepo', {
      projectType: 'nx-monorepo',
      platforms: ['web', 'mobile', 'desktop'],
      techStack: {
        frontend: ['React', 'TypeScript', 'Tailwind CSS'],
        backend: ['Node.js', 'Express', 'Prisma'],
        database: ['PostgreSQL', 'SQLite'],
        deployment: ['Vercel', 'Netlify', 'Docker'],
        testing: ['Jest', 'Playwright', 'Cypress'],
        styling: ['Tailwind CSS', 'CSS Modules'],
        stateManagement: ['Zustand', 'React Context'],
        bundler: ['Vite', 'Webpack'],
        runtime: ['Node.js', 'Bun']
      },
      requirements: {
        authentication: true,
        database: true,
        testing: true,
        cicd: true
      },
      architecture: {
        monorepo: true,
        spa: true,
        ssr: true
      },
      compliance: {
        accessibility: true,
        security: true,
        performance: true
      }
    })

    // Expo Mobile constraints
    this.constraints.set('expo-mobile', {
      projectType: 'expo-mobile',
      platforms: ['mobile'],
      techStack: {
        frontend: ['React Native', 'TypeScript', 'Expo'],
        backend: ['Meteor', 'Supabase', 'Firebase'],
        database: ['SQLite', 'Realm', 'AsyncStorage'],
        deployment: ['EAS Build', 'App Store', 'Google Play'],
        testing: ['Jest', 'Detox'],
        styling: ['StyleSheet', 'NativeWind', 'Tamagui'],
        stateManagement: ['Zustand', 'Redux Toolkit', 'React Context'],
        bundler: ['Metro'],
        runtime: ['Hermes', 'JSC']
      },
      requirements: {
        authentication: true,
        realtime: true,
        analytics: true
      },
      architecture: {
        spa: true
      },
      compliance: {
        accessibility: true,
        performance: true
      }
    })

    // Electron Desktop constraints
    this.constraints.set('electron-desktop', {
      projectType: 'electron-desktop',
      platforms: ['desktop'],
      techStack: {
        frontend: ['React', 'TypeScript', 'Electron'],
        backend: ['Node.js', 'SQLite'],
        database: ['SQLite', 'LevelDB'],
        deployment: ['Electron Builder', 'Auto Updater'],
        testing: ['Jest', 'Spectron'],
        styling: ['CSS Modules', 'Styled Components'],
        stateManagement: ['Zustand', 'Redux Toolkit'],
        bundler: ['Webpack', 'Vite'],
        runtime: ['Electron', 'Node.js']
      },
      requirements: {
        authentication: false,
        database: true,
        testing: true
      },
      architecture: {
        spa: true
      },
      compliance: {
        security: true,
        performance: true
      }
    })

    // Next.js Web constraints
    this.constraints.set('nextjs-web', {
      projectType: 'nextjs-web',
      platforms: ['web'],
      techStack: {
        frontend: ['React', 'TypeScript', 'Next.js'],
        backend: ['Next.js API Routes', 'tRPC'],
        database: ['PostgreSQL', 'Prisma', 'PlanetScale'],
        deployment: ['Vercel', 'Netlify'],
        testing: ['Jest', 'Playwright'],
        styling: ['Tailwind CSS', 'CSS Modules'],
        stateManagement: ['Zustand', 'React Query'],
        bundler: ['Next.js', 'Turbopack'],
        runtime: ['Node.js', 'Edge Runtime']
      },
      requirements: {
        authentication: true,
        database: true,
        testing: true,
        seo: true
      },
      architecture: {
        ssr: true,
        static: true
      },
      compliance: {
        accessibility: true,
        seo: true,
        performance: true
      }
    })

    // Node.js Backend constraints
    this.constraints.set('node-backend', {
      projectType: 'node-backend',
      platforms: ['server'],
      techStack: {
        backend: ['Node.js', 'Express', 'Fastify', 'tRPC'],
        database: ['PostgreSQL', 'MongoDB', 'Redis'],
        deployment: ['Docker', 'Railway', 'Fly.io'],
        testing: ['Jest', 'Supertest'],
        runtime: ['Node.js', 'Bun']
      },
      requirements: {
        authentication: true,
        database: true,
        testing: true,
        monitoring: true
      },
      architecture: {
        microservices: true,
        serverless: true
      },
      compliance: {
        security: true,
        performance: true
      }
    })

    // Chrome Extension constraints
    this.constraints.set('chrome-extension', {
      projectType: 'chrome-extension',
      platforms: ['web'],
      techStack: {
        frontend: ['TypeScript', 'React', 'Vite'],
        backend: ['Chrome APIs', 'Storage API'],
        deployment: ['Chrome Web Store'],
        testing: ['Jest', 'Playwright'],
        styling: ['CSS Modules', 'Tailwind CSS'],
        bundler: ['Vite', 'Webpack'],
        runtime: ['Chrome Extension Runtime']
      },
      requirements: {
        testing: true
      },
      architecture: {
        spa: true
      },
      compliance: {
        security: true,
        performance: true
      }
    })

    // VS Code Extension constraints
    this.constraints.set('vscode-extension', {
      projectType: 'vscode-extension',
      platforms: ['desktop'],
      techStack: {
        frontend: ['TypeScript', 'VS Code API'],
        backend: ['Node.js', 'Language Server Protocol'],
        deployment: ['VS Code Marketplace'],
        testing: ['Mocha', 'VS Code Test Runner'],
        bundler: ['Webpack', 'esbuild'],
        runtime: ['VS Code Extension Host']
      },
      requirements: {
        testing: true
      },
      architecture: {
        spa: false
      },
      compliance: {
        performance: true
      }
    })

    // CLI Tool constraints
    this.constraints.set('cli-tool', {
      projectType: 'cli-tool',
      platforms: ['server'],
      techStack: {
        backend: ['Node.js', 'TypeScript', 'Commander.js'],
        deployment: ['npm', 'GitHub Releases'],
        testing: ['Jest', 'CLI Testing'],
        bundler: ['esbuild', 'pkg'],
        runtime: ['Node.js', 'Bun']
      },
      requirements: {
        testing: true
      },
      architecture: {
        spa: false
      },
      compliance: {
        performance: true
      }
    })

    // Shopify App constraints
    this.constraints.set('shopify-app', {
      projectType: 'shopify-app',
      platforms: ['web'],
      techStack: {
        frontend: ['React', 'Shopify Polaris', 'TypeScript'],
        backend: ['Node.js', 'Shopify CLI', 'GraphQL'],
        database: ['PostgreSQL', 'Shopify Admin API'],
        deployment: ['Shopify Partners', 'Vercel'],
        testing: ['Jest', 'Shopify Testing'],
        styling: ['Shopify Polaris'],
        runtime: ['Node.js']
      },
      requirements: {
        authentication: true,
        database: true,
        testing: true
      },
      architecture: {
        spa: true
      },
      compliance: {
        security: true,
        performance: true
      }
    })

    // Discord Bot constraints
    this.constraints.set('discord-bot', {
      projectType: 'discord-bot',
      platforms: ['server'],
      techStack: {
        backend: ['Node.js', 'Discord.js', 'TypeScript'],
        database: ['SQLite', 'PostgreSQL'],
        deployment: ['Railway', 'Heroku', 'Docker'],
        testing: ['Jest'],
        runtime: ['Node.js']
      },
      requirements: {
        database: true,
        testing: true
      },
      architecture: {
        spa: false
      },
      compliance: {
        security: true
      }
    })
  }

  static getConstraints(projectType: ProjectType): ProjectConstraints | null {
    return this.constraints.get(projectType) || null
  }

  static validateConstraints(constraints: ProjectConstraints): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validate platform compatibility
    if (constraints.projectType === 'expo-mobile' && !constraints.platforms.includes('mobile')) {
      errors.push('Expo projects must target mobile platform')
    }

    if (constraints.projectType === 'electron-desktop' && !constraints.platforms.includes('desktop')) {
      errors.push('Electron projects must target desktop platform')
    }

    // Validate architecture constraints
    if (constraints.projectType === 'nx-monorepo' && !constraints.architecture.monorepo) {
      errors.push('Nx projects must use monorepo architecture')
    }

    // Validate tech stack compatibility
    if (constraints.platforms.includes('mobile') && 
        constraints.techStack.frontend && 
        !constraints.techStack.frontend.some(tech => ['React Native', 'Expo'].includes(tech))) {
      errors.push('Mobile platforms require React Native or Expo frontend')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  static mergeConstraints(base: ProjectConstraints, override: Partial<ProjectConstraints>): ProjectConstraints {
    return {
      ...base,
      ...override,
      techStack: {
        ...base.techStack,
        ...override.techStack
      },
      requirements: {
        ...base.requirements,
        ...override.requirements
      },
      architecture: {
        ...base.architecture,
        ...override.architecture
      },
      compliance: {
        ...base.compliance,
        ...override.compliance
      }
    }
  }

  static detectProjectType(projectPath: string): ProjectType | null {
    // Implementation would analyze project structure
    // For now, return basic detection logic
    if (projectPath.includes('nx.json')) return 'nx-monorepo'
    if (projectPath.includes('app.json') || projectPath.includes('expo')) return 'expo-mobile'
    if (projectPath.includes('electron')) return 'electron-desktop'
    if (projectPath.includes('next.config')) return 'nextjs-web'
    return null
  }

  static getSupportedTechStack(projectType: ProjectType): TechStack | null {
    const constraints = this.getConstraints(projectType)
    return constraints?.techStack || null
  }

  static getRequiredCapabilities(projectType: ProjectType): string[] {
    const constraints = this.getConstraints(projectType)
    if (!constraints) return []

    const capabilities: string[] = []
    
    if (constraints.requirements.authentication) capabilities.push('authentication')
    if (constraints.requirements.database) capabilities.push('database')
    if (constraints.requirements.realtime) capabilities.push('realtime')
    if (constraints.requirements.payments) capabilities.push('payments')
    if (constraints.requirements.testing) capabilities.push('testing')
    if (constraints.requirements.cicd) capabilities.push('cicd')
    
    return capabilities
  }
}

// Initialize constraints on module load
ConstraintEngine.initialize()
