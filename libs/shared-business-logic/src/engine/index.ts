// ECE AI Developer Engine - Complete software generation system

export * from './types'
export * from './constraints'
export * from './templates'
export * from './client-engine'

export { ConstraintEngine } from './constraints'
export { TemplateEngine } from './templates'
export { ClientGenerationEngine } from './client-engine'

// Re-export key types for convenience
export type {
  ProjectType,
  ProjectConstraints,
  GenerationTemplate,
  GenerationContext,
  GenerationResult,
  TechStack,
  PlatformTarget
} from './types'
