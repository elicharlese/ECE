// Core generation engine that orchestrates AI developers to build full software

import { AIClient } from '../ai/client'
import type { AIMessage } from '../ai/types'
import type { 
  GenerationTemplate, 
  GenerationContext, 
  GenerationResult, 
  ProjectConstraints,
  ValidationResult,
  TemplateFile,
  TemplateCommand
} from './types'
import { TemplateEngine } from './templates'
import { ConstraintEngine } from './constraints'
import * as fs from 'fs/promises'
import * as path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export class SoftwareGenerationEngine {
  private aiClient: AIClient
  private outputPath: string

  constructor(outputPath: string = './generated-projects') {
    this.aiClient = AIClient.getInstance()
    this.outputPath = outputPath
  }

  async generateFullSoftware(
    projectName: string,
    constraints: ProjectConstraints,
    customRequirements?: string
  ): Promise<GenerationResult> {
    const projectPath = path.join(this.outputPath, projectName)
    
    try {
      // 1. Validate constraints
      const validation = ConstraintEngine.validateConstraints(constraints)
      if (!validation.valid) {
        return {
          success: false,
          projectPath,
          filesGenerated: [],
          commandsExecuted: [],
          validationResults: [],
          errors: validation.errors
        }
      }

      // 2. Select appropriate template
      const templates = TemplateEngine.getTemplatesForProjectType(constraints.projectType)
      if (templates.length === 0) {
        return {
          success: false,
          projectPath,
          filesGenerated: [],
          commandsExecuted: [],
          validationResults: [],
          errors: [`No templates available for project type: ${constraints.projectType}`]
        }
      }

      const template = templates[0] // Use first available template for now
      
      // 3. Create generation context
      const context: GenerationContext = {
        projectName,
        projectPath,
        constraints,
        template,
        variables: {},
        metadata: {
          generatedAt: new Date(),
          generatedBy: 'ECE AI Developer Engine',
          version: '1.0.0'
        }
      }

      // 4. Enhance template with AI if custom requirements provided
      if (customRequirements) {
        await this.enhanceTemplateWithAI(context, customRequirements)
      }

      // 5. Generate project structure
      await this.ensureDirectoryExists(projectPath)
      
      // 6. Generate files
      const filesGenerated = await this.generateFiles(context)
      
      // 7. Execute setup commands
      const commandsExecuted = await this.executeCommands(context)
      
      // 8. Run validation
      const validationResults = await this.validateGeneration(context)
      
      // 9. Generate additional enhancements with AI
      if (process.env['AI_ENABLE_CODEGEN'] === 'true') {
        await this.generateAIEnhancements(context)
      }

      const allValidationsPassed = validationResults.every(v => v.passed)
      
      return {
        success: allValidationsPassed,
        projectPath,
        filesGenerated,
        commandsExecuted,
        validationResults,
        warnings: allValidationsPassed ? [] : ['Some validations failed'],
        nextSteps: this.generateNextSteps(context)
      }

    } catch (error) {
      return {
        success: false,
        projectPath,
        filesGenerated: [],
        commandsExecuted: [],
        validationResults: [],
        errors: [String(error)]
      }
    }
  }

  private async enhanceTemplateWithAI(context: GenerationContext, requirements: string): Promise<void> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: `You are an expert software architect. Analyze the requirements and suggest enhancements to the project template.
        
Project Type: ${context.constraints.projectType}
Platforms: ${context.constraints.platforms.join(', ')}
Tech Stack: ${JSON.stringify(context.constraints.techStack, null, 2)}

Respond with JSON containing suggested files, dependencies, and architecture improvements.`
      },
      {
        role: 'user',
        content: `Project: ${context.projectName}
Requirements: ${requirements}

Please suggest specific enhancements to make this project production-ready and aligned with the requirements.`
      }
    ]

    try {
      const response = await this.aiClient.chatTask('architecture', messages, {
        temperature: 0.3,
        maxTokens: 2048
      })

      // Parse AI response and merge with template
      const suggestions = this.parseAISuggestions(response.content || '')
      this.mergeAISuggestions(context, suggestions)
    } catch (error) {
      console.warn('AI enhancement failed:', error)
      // Continue with base template
    }
  }

  private async generateFiles(context: GenerationContext): Promise<string[]> {
    const filesGenerated: string[] = []

    for (const templateFile of context.template.files) {
      try {
        const filePath = path.join(context.projectPath, templateFile.path)
        const fileDir = path.dirname(filePath)
        
        await this.ensureDirectoryExists(fileDir)
        
        const content = typeof templateFile.content === 'function' 
          ? templateFile.content(context)
          : templateFile.content

        await fs.writeFile(filePath, content, 'utf8')
        
        if (templateFile.executable) {
          await fs.chmod(filePath, 0o755)
        }
        
        filesGenerated.push(templateFile.path)
      } catch (error) {
        console.error(`Failed to generate file ${templateFile.path}:`, error)
      }
    }

    return filesGenerated
  }

  private async executeCommands(context: GenerationContext): Promise<TemplateCommand[]> {
    const commandsExecuted: TemplateCommand[] = []

    for (const command of context.template.commands) {
      try {
        const workingDir = command.workingDirectory 
          ? path.join(context.projectPath, command.workingDirectory)
          : context.projectPath

        // Replace template variables in command
        const processedCommand = command.command.replace(/\{\{(\w+)\}\}/g, (match, key) => {
          const value = context.variables[key] || context.projectName
          return typeof value === 'string' ? value : match
        })

        console.log(`Executing: ${processedCommand}`)
        await execAsync(processedCommand, { cwd: workingDir })
        
        commandsExecuted.push(command)
      } catch (error) {
        console.error(`Command failed: ${command.command}`, error)
        // Continue with other commands
      }
    }

    return commandsExecuted
  }

  private async validateGeneration(context: GenerationContext): Promise<ValidationResult[]> {
    const results: ValidationResult[] = []

    for (const rule of context.template.validation) {
      try {
        let passed = false
        let message = ''

        switch (rule.type) {
          case 'file-exists':
            if (rule.files) {
              const allExist = await Promise.all(
                rule.files.map(file => 
                  fs.access(path.join(context.projectPath, file))
                    .then(() => true)
                    .catch(() => false)
                )
              )
              passed = allExist.every(exists => exists)
              message = passed ? 'All required files exist' : 'Some required files are missing'
            }
            break

          case 'command-success':
            if (rule.command) {
              try {
                await execAsync(rule.command, { cwd: context.projectPath })
                passed = true
                message = 'Command executed successfully'
              } catch (error) {
                passed = false
                message = `Command failed: ${error}`
              }
            }
            break

          case 'custom':
            if (rule.customValidator) {
              passed = await rule.customValidator(context)
              message = passed ? 'Custom validation passed' : 'Custom validation failed'
            }
            break

          default:
            passed = true
            message = 'Validation type not implemented'
        }

        results.push({
          rule,
          passed,
          message
        })
      } catch (error) {
        results.push({
          rule,
          passed: false,
          message: `Validation error: ${error}`
        })
      }
    }

    return results
  }

  private async generateAIEnhancements(context: GenerationContext): Promise<void> {
    // Generate additional code enhancements using AI
    const enhancementTasks = [
      'Add comprehensive error handling',
      'Implement proper logging',
      'Add input validation',
      'Create unit tests',
      'Add documentation'
    ]

    for (const task of enhancementTasks) {
      try {
        await this.generateCodeEnhancement(context, task)
      } catch (error) {
        console.warn(`Enhancement failed for ${task}:`, error)
      }
    }
  }

  private async generateCodeEnhancement(context: GenerationContext, enhancement: string): Promise<void> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: `You are an expert developer. Generate code to enhance the project with: ${enhancement}
        
Project: ${context.projectName}
Type: ${context.constraints.projectType}
Tech Stack: ${JSON.stringify(context.constraints.techStack)}

Provide specific code files and their content.`
      },
      {
        role: 'user',
        content: `Please implement ${enhancement} for this ${context.constraints.projectType} project. 
        
Provide the code as JSON with this format:
{
  "files": [
    {
      "path": "relative/path/to/file.ts",
      "content": "file content here"
    }
  ]
}`
      }
    ]

    const response = await this.aiClient.chatTask('code', messages, {
      temperature: 0.2,
      maxTokens: 1024
    })

    try {
      const enhancement = JSON.parse(response.content || '{}')
      if (enhancement.files) {
        for (const file of enhancement.files) {
          const filePath = path.join(context.projectPath, file.path)
          const fileDir = path.dirname(filePath)
          
          await this.ensureDirectoryExists(fileDir)
          await fs.writeFile(filePath, file.content, 'utf8')
        }
      }
    } catch (error) {
      console.warn('Failed to parse AI enhancement:', error)
    }
  }

  private parseAISuggestions(content: string): any {
    try {
      return JSON.parse(content)
    } catch {
      return {}
    }
  }

  private mergeAISuggestions(context: GenerationContext, suggestions: any): void {
    if (suggestions.files) {
      context.template.files.push(...suggestions.files)
    }
    if (suggestions.dependencies) {
      context.template.dependencies.push(...suggestions.dependencies)
    }
    if (suggestions.commands) {
      context.template.commands.push(...suggestions.commands)
    }
  }

  private generateNextSteps(context: GenerationContext): string[] {
    const steps = [
      `cd ${context.projectName}`,
      'Review the generated code and configuration',
      'Install dependencies: npm install',
      'Start development server: npm run dev'
    ]

    if (context.constraints.projectType === 'nx-monorepo') {
      steps.push(
        'Build all apps: npm run build:all',
        'Run tests: npm run test',
        'Start web app: npm run dev',
        'Start mobile app: npm run dev:mobile'
      )
    }

    if (context.constraints.requirements.testing) {
      steps.push('Run tests: npm test')
    }

    if (context.constraints.requirements.cicd) {
      steps.push('Set up CI/CD pipeline')
    }

    return steps
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath)
    } catch {
      await fs.mkdir(dirPath, { recursive: true })
    }
  }

  // Public API methods
  async listAvailableTemplates() {
    return TemplateEngine.getAllTemplates()
  }

  async getConstraintsForProjectType(projectType: string) {
    return ConstraintEngine.getConstraints(projectType as any)
  }

  async validateProjectConstraints(constraints: ProjectConstraints) {
    return ConstraintEngine.validateConstraints(constraints)
  }
}
