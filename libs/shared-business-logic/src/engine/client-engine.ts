// Client-side engine for browser environments (no Node.js dependencies)

import type { 
  ProjectConstraints, 
  GenerationTemplate, 
  ProjectType 
} from './types'

export class ClientGenerationEngine {
  static async generateProject(
    projectName: string,
    constraints: ProjectConstraints,
    customRequirements?: string
  ) {
    // This will call the server-side API
    const response = await fetch('/api/engine/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectName,
        projectType: constraints.projectType,
        platforms: constraints.platforms,
        requirements: constraints.requirements,
        architecture: constraints.architecture,
        compliance: constraints.compliance,
        customRequirements
      })
    })

    if (!response.ok) {
      throw new Error(`Generation failed: ${response.statusText}`)
    }

    return response.json()
  }

  static async listTemplates() {
    const response = await fetch('/api/engine/generate')
    if (!response.ok) {
      throw new Error(`Failed to fetch templates: ${response.statusText}`)
    }
    return response.json()
  }

  static getConstraintsForProjectType(projectType: ProjectType): ProjectConstraints {
    // Basic constraints for client-side validation
    const baseConstraints: ProjectConstraints = {
      projectType,
      platforms: ['web'],
      techStack: {
        frontend: [],
        backend: [],
        database: [],
        deployment: [],
        testing: [],
        styling: [],
        stateManagement: [],
        bundler: [],
        runtime: []
      },
      requirements: {
        authentication: false,
        database: false,
        realtime: false,
        payments: false,
        analytics: false,
        testing: true,
        cicd: false,
        docker: false,
        monitoring: false,
        seo: false
      },
      architecture: {
        monorepo: false,
        microservices: false,
        serverless: false,
        spa: true,
        ssr: false,
        static: false
      },
      compliance: {
        accessibility: false,
        security: true,
        performance: true,
        seo: false
      }
    }

    // Customize based on project type
    switch (projectType) {
      case 'nx-monorepo':
        return {
          ...baseConstraints,
          platforms: ['web', 'mobile', 'desktop'],
          architecture: { ...baseConstraints.architecture, monorepo: true },
          requirements: { ...baseConstraints.requirements, database: true, authentication: true }
        }
      
      case 'expo-mobile':
        return {
          ...baseConstraints,
          platforms: ['mobile'],
          requirements: { ...baseConstraints.requirements, realtime: true }
        }
      
      case 'electron-desktop':
        return {
          ...baseConstraints,
          platforms: ['desktop'],
          requirements: { ...baseConstraints.requirements, database: true }
        }
      
      case 'chrome-extension':
        return {
          ...baseConstraints,
          platforms: ['web']
        }
      
      case 'vscode-extension':
        return {
          ...baseConstraints,
          platforms: ['desktop']
        }
      
      default:
        return baseConstraints
    }
  }
}
