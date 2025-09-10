// AI Types and Provider Interfaces (Nebius-first)
// Named exports only.

export type AIRole = 'system' | 'user' | 'assistant' | 'tool'

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIChatOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
  seed?: number
  topP?: number
  presencePenalty?: number
  frequencyPenalty?: number
  // Provider-specific passthrough
  [key: string]: unknown
}

export interface AIChatResponse {
  content: string
  raw?: unknown
}

export interface AIProvider {
  chat(messages: AIMessage[], options?: AIChatOptions): Promise<AIChatResponse>
}

export type AITask =
  | 'design'          // UI/UX, visual likeness prompts
  | 'architecture'    // system design, data models, interfaces
  | 'code'            // code generation/editing/cleanup
  | 'optimize'        // refactors, performance, readability
  | 'refactor'        // safety/typing-oriented edits
  | 'test'            // test generation
  | 'plan'            // planning, breakdown, checklists

export interface TaskRoute {
  model: string
  reason: string
}

export interface AIEnvConfig {
  baseUrl: string
  apiKey?: string
  // Task → model mapping
  designModel?: string
  architectureModel?: string
  codeModel?: string
  optimizationModel?: string
  fastModel?: string
  // Debug
  debug?: boolean
}
