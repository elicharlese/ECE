// Core types for the ECE AI Developer Engine

export type ProjectType = 
  | 'nx-monorepo'
  | 'expo-mobile'
  | 'electron-desktop'
  | 'nextjs-web'
  | 'react-native'
  | 'node-backend'
  | 'full-stack'
  | 'library'
  | 'cli-tool'
  | 'chrome-extension'
  | 'vscode-extension'
  | 'shopify-app'
  | 'discord-bot'
  | 'telegram-bot'
  | 'wordpress-plugin'
  | 'figma-plugin'
  | 'custom'

export type PlatformTarget = 
  | 'web'
  | 'mobile'
  | 'desktop'
  | 'server'
  | 'cross-platform'

export type TechStack = {
  frontend?: string[]
  backend?: string[]
  database?: string[]
  deployment?: string[]
  testing?: string[]
  styling?: string[]
  stateManagement?: string[]
  bundler?: string[]
  runtime?: string[]
}

export interface ProjectConstraints {
  projectType: ProjectType
  platforms: PlatformTarget[]
  techStack: TechStack
  requirements: {
    authentication?: boolean
    database?: boolean
    realtime?: boolean
    payments?: boolean
    analytics?: boolean
    testing?: boolean
    cicd?: boolean
    docker?: boolean
    monitoring?: boolean
    seo?: boolean
  }
  architecture: {
    monorepo?: boolean
    microservices?: boolean
    serverless?: boolean
    spa?: boolean
    ssr?: boolean
    static?: boolean
  }
  compliance?: {
    accessibility?: boolean
    security?: boolean
    performance?: boolean
    seo?: boolean
  }
}

export interface GenerationTemplate {
  id: string
  name: string
  description: string
  projectType: ProjectType
  constraints: ProjectConstraints
  files: TemplateFile[]
  commands: TemplateCommand[]
  dependencies: TemplateDependency[]
  validation: ValidationRule[]
}

export interface TemplateFile {
  path: string
  content: string | ((context: GenerationContext) => string)
  executable?: boolean
  overwrite?: boolean
}

export interface TemplateCommand {
  command: string
  description: string
  workingDirectory?: string
  runAfter?: string[]
  platform?: PlatformTarget[]
}

export interface TemplateDependency {
  name: string
  version?: string
  dev?: boolean
  peer?: boolean
  optional?: boolean
  platform?: PlatformTarget[]
}

export interface ValidationRule {
  type: 'file-exists' | 'command-success' | 'lint-pass' | 'test-pass' | 'build-success' | 'custom'
  description: string
  command?: string
  files?: string[]
  customValidator?: (context: GenerationContext) => Promise<boolean>
}

export interface GenerationContext {
  projectName: string
  projectPath: string
  constraints: ProjectConstraints
  template: GenerationTemplate
  variables: Record<string, string | number | boolean>
  metadata: {
    generatedAt: Date
    generatedBy: string
    version: string
  }
}

export interface GenerationResult {
  success: boolean
  projectPath: string
  filesGenerated: string[]
  commandsExecuted: TemplateCommand[]
  validationResults: ValidationResult[]
  errors?: string[]
  warnings?: string[]
  nextSteps?: string[]
}

export interface ValidationResult {
  rule: ValidationRule
  passed: boolean
  message?: string
  details?: Record<string, unknown>
}

export interface EngineCapability {
  id: string
  name: string
  description: string
  supportedProjectTypes: ProjectType[]
  aiTasks: ('design' | 'code' | 'architecture' | 'optimize' | 'refactor' | 'plan' | 'test')[]
  templates: string[]
}
