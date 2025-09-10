// Advanced AI capabilities for sophisticated code analysis and enhancement

import { AIClient } from '../ai/client'
import type { AIMessage } from '../ai/types'
import type { GenerationContext, ProjectConstraints } from './types'

export interface AIAnalysisResult {
  score: number
  suggestions: string[]
  improvements: CodeImprovement[]
  architectureRecommendations: ArchitectureRecommendation[]
  securityIssues: SecurityIssue[]
  performanceOptimizations: PerformanceOptimization[]
}

export interface CodeImprovement {
  type: 'refactor' | 'optimization' | 'bug-fix' | 'enhancement'
  priority: 'low' | 'medium' | 'high' | 'critical'
  description: string
  filePath: string
  lineNumber?: number
  suggestedCode?: string
  reasoning: string
}

export interface ArchitectureRecommendation {
  category: 'structure' | 'patterns' | 'dependencies' | 'scaling'
  recommendation: string
  impact: 'low' | 'medium' | 'high'
  effort: 'low' | 'medium' | 'high'
  reasoning: string
}

export interface SecurityIssue {
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: string
  description: string
  filePath?: string
  mitigation: string
}

export interface PerformanceOptimization {
  type: 'memory' | 'cpu' | 'network' | 'rendering' | 'database'
  description: string
  expectedImprovement: string
  implementation: string
}

export class AdvancedAIEngine {
  private aiClient: AIClient

  constructor() {
    this.aiClient = AIClient.getInstance()
  }

  async analyzeCodeQuality(
    projectPath: string, 
    constraints: ProjectConstraints
  ): Promise<AIAnalysisResult> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: `You are an expert code reviewer and architect. Analyze the project for:
1. Code quality and best practices
2. Architecture patterns and improvements
3. Security vulnerabilities
4. Performance optimizations
5. Maintainability issues

Project Type: ${constraints.projectType}
Tech Stack: ${JSON.stringify(constraints.techStack)}
Platforms: ${constraints.platforms.join(', ')}

Respond with JSON matching this structure:
{
  "score": 85,
  "suggestions": ["Use TypeScript strict mode", "Add error boundaries"],
  "improvements": [
    {
      "type": "refactor",
      "priority": "high",
      "description": "Extract reusable components",
      "filePath": "src/components/Button.tsx",
      "suggestedCode": "// improved code here",
      "reasoning": "Reduces code duplication"
    }
  ],
  "architectureRecommendations": [
    {
      "category": "patterns",
      "recommendation": "Implement Repository pattern",
      "impact": "high",
      "effort": "medium",
      "reasoning": "Better separation of concerns"
    }
  ],
  "securityIssues": [],
  "performanceOptimizations": []
}`
      },
      {
        role: 'user',
        content: `Analyze this ${constraints.projectType} project for code quality, architecture, security, and performance. Focus on production-readiness and scalability.`
      }
    ]

    try {
      const response = await this.aiClient.chatTask('architecture', messages, {
        temperature: 0.2,
        maxTokens: 2048
      })

      return this.parseAnalysisResult(response.content || '{}')
    } catch (error) {
      console.error('AI analysis failed:', error)
      return this.getDefaultAnalysisResult()
    }
  }

  async generateArchitectureRecommendations(
    context: GenerationContext,
    requirements: string
  ): Promise<ArchitectureRecommendation[]> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: `You are a senior software architect. Provide specific architecture recommendations for this project.

Project: ${context.projectName}
Type: ${context.constraints.projectType}
Platforms: ${context.constraints.platforms.join(', ')}
Requirements: ${requirements}

Consider:
- Scalability patterns
- Design patterns
- Data flow architecture
- Security architecture
- Performance considerations
- Maintainability

Respond with JSON array of recommendations.`
      },
      {
        role: 'user',
        content: `Given the requirements "${requirements}", what architecture improvements would you recommend for this ${context.constraints.projectType} project?`
      }
    ]

    try {
      const response = await this.aiClient.chatTask('architecture', messages, {
        temperature: 0.3,
        maxTokens: 1024
      })

      const parsed = JSON.parse(response.content || '[]')
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.error('Architecture recommendations failed:', error)
      return []
    }
  }

  async optimizeCodeForPerformance(
    filePath: string,
    code: string,
    projectType: string
  ): Promise<{ optimizedCode: string; improvements: string[] }> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: `You are an expert performance engineer. Optimize this code for:
1. Runtime performance
2. Memory efficiency
3. Bundle size (if applicable)
4. Rendering performance (if UI code)

Project Type: ${projectType}
File: ${filePath}

Respond with JSON:
{
  "optimizedCode": "// optimized code here",
  "improvements": ["Reduced re-renders", "Memoized expensive calculations"]
}`
      },
      {
        role: 'user',
        content: `Optimize this code for performance:\n\n${code}`
      }
    ]

    try {
      const response = await this.aiClient.chatTask('optimize', messages, {
        temperature: 0.1,
        maxTokens: 1024
      })

      const result = JSON.parse(response.content || '{}')
      return {
        optimizedCode: result.optimizedCode || code,
        improvements: result.improvements || []
      }
    } catch (error) {
      console.error('Performance optimization failed:', error)
      return { optimizedCode: code, improvements: [] }
    }
  }

  async generateSecurityAudit(
    context: GenerationContext
  ): Promise<SecurityIssue[]> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: `You are a security expert. Audit this project for security vulnerabilities:

Project: ${context.projectName}
Type: ${context.constraints.projectType}
Tech Stack: ${JSON.stringify(context.constraints.techStack)}

Look for:
- Authentication/authorization issues
- Input validation problems
- Data exposure risks
- Dependency vulnerabilities
- Configuration security
- API security

Respond with JSON array of security issues.`
      },
      {
        role: 'user',
        content: `Perform a security audit for this ${context.constraints.projectType} project. Identify potential vulnerabilities and provide mitigation strategies.`
      }
    ]

    try {
      const response = await this.aiClient.chatTask('architecture', messages, {
        temperature: 0.2,
        maxTokens: 1024
      })

      const parsed = JSON.parse(response.content || '[]')
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.error('Security audit failed:', error)
      return []
    }
  }

  async generateTestSuite(
    context: GenerationContext,
    filePath: string,
    code: string
  ): Promise<{ testCode: string; coverage: string[] }> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: `You are a testing expert. Generate comprehensive tests for this code:

Project: ${context.projectName}
Type: ${context.constraints.projectType}
File: ${filePath}

Generate:
1. Unit tests
2. Integration tests (if applicable)
3. Edge case tests
4. Error handling tests

Use appropriate testing framework for the project type.

Respond with JSON:
{
  "testCode": "// complete test file content",
  "coverage": ["function1", "function2", "edge cases"]
}`
      },
      {
        role: 'user',
        content: `Generate comprehensive tests for this code:\n\n${code}`
      }
    ]

    try {
      const response = await this.aiClient.chatTask('test', messages, {
        temperature: 0.2,
        maxTokens: 1024
      })

      const result = JSON.parse(response.content || '{}')
      return {
        testCode: result.testCode || '',
        coverage: result.coverage || []
      }
    } catch (error) {
      console.error('Test generation failed:', error)
      return { testCode: '', coverage: [] }
    }
  }

  async generateDocumentation(
    context: GenerationContext,
    code: string
  ): Promise<{ readme: string; apiDocs: string; comments: string }> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: `You are a technical writer. Generate comprehensive documentation:

Project: ${context.projectName}
Type: ${context.constraints.projectType}

Generate:
1. README.md with setup, usage, and examples
2. API documentation (if applicable)
3. Inline code comments

Respond with JSON:
{
  "readme": "# Project Title\\n\\nDescription...",
  "apiDocs": "## API Reference\\n...",
  "comments": "// Enhanced code with comments"
}`
      },
      {
        role: 'user',
        content: `Generate documentation for this ${context.constraints.projectType} project:\n\n${code}`
      }
    ]

    try {
      const response = await this.aiClient.chatTask('plan', messages, {
        temperature: 0.3,
        maxTokens: 1024
      })

      const result = JSON.parse(response.content || '{}')
      return {
        readme: result.readme || '',
        apiDocs: result.apiDocs || '',
        comments: result.comments || code
      }
    } catch (error) {
      console.error('Documentation generation failed:', error)
      return { readme: '', apiDocs: '', comments: code }
    }
  }

  private parseAnalysisResult(content: string): AIAnalysisResult {
    try {
      const parsed = JSON.parse(content)
      return {
        score: parsed.score || 70,
        suggestions: parsed.suggestions || [],
        improvements: parsed.improvements || [],
        architectureRecommendations: parsed.architectureRecommendations || [],
        securityIssues: parsed.securityIssues || [],
        performanceOptimizations: parsed.performanceOptimizations || []
      }
    } catch (error) {
      return this.getDefaultAnalysisResult()
    }
  }

  private getDefaultAnalysisResult(): AIAnalysisResult {
    return {
      score: 70,
      suggestions: ['Add comprehensive testing', 'Improve error handling'],
      improvements: [],
      architectureRecommendations: [],
      securityIssues: [],
      performanceOptimizations: []
    }
  }
}
