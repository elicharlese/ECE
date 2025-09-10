import type { AITask, TaskRoute } from './types'

export interface ProviderPresence {
  nebius: boolean
  openai: boolean
  anthropic: boolean
  xai: boolean
}

const providerPresence = (): ProviderPresence => ({
  nebius: !!process.env['NEBIUS_API_KEY'],
  openai: !!process.env['OPENAI_API_KEY'] || !!process.env['OPENAI_KEY'],
  anthropic: !!process.env['ANTHROPIC_API_KEY'] || !!process.env['ANTRHOPIC_API_KEY'],
  xai: !!process.env['XAI_API_KEY'],
})

export const routeTask = (task: AITask): TaskRoute & { provider: 'openai' | 'anthropic' } => {
  const p = providerPresence()

  switch (task) {
    case 'design': {
      // Only OpenAI or Anthropic; prefer OpenAI for design likeness
      if (p.openai) {
        return {
          provider: 'openai',
          model: process.env['OPENAI_DESIGN_MODEL'] || 'gpt-4.1',
          reason: 'Design likeness and UI prompts — OpenAI preferred',
        }
      }
      return {
        provider: 'anthropic',
        model: process.env['ANTHROPIC_MODEL'] || 'claude-4-sonnet',
        reason: 'Fallback design via Anthropic',
      }
    }

    case 'architecture':
    case 'code':
    case 'optimize':
    case 'refactor':
    case 'test':
    case 'plan': {
      // Prefer Anthropic for careful coding/reasoning; fallback to OpenAI
      if (p.anthropic) {
        return {
          provider: 'anthropic',
          model: process.env['ANTHROPIC_MODEL'] || 'claude-4-sonnet',
          reason: 'Prefer Anthropic for coding/reasoning tasks',
        }
      }
      return {
        provider: 'openai',
        model: process.env['OPENAI_DESIGN_MODEL'] || 'gpt-4.1',
        reason: 'Fallback to OpenAI',
      }
    }

    default: {
      // Safe default limited to Anthropic/OpenAI
      if (p.anthropic) {
        return {
          provider: 'anthropic',
          model: process.env['ANTHROPIC_MODEL'] || 'claude-4-sonnet',
          reason: 'Default to Anthropic',
        }
      }
      return {
        provider: 'openai',
        model: process.env['OPENAI_DESIGN_MODEL'] || 'gpt-4.1',
        reason: 'Default to OpenAI',
      }
    }
  }
}
