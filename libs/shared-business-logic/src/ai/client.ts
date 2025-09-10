import type { AIChatOptions, AIChatResponse, AIMessage, AITask } from './types'
import { routeTask } from './router'
import { OpenAIProvider } from './openaiProvider'
import { AnthropicProvider } from './anthropicProvider'

// Named export only
export class AIClient {
  private static instance: AIClient | null = null

  static getInstance(): AIClient {
    if (!this.instance) this.instance = new AIClient()
    return this.instance
  }

  async chatTask(task: AITask, messages: AIMessage[], options?: AIChatOptions): Promise<AIChatResponse> {
    const route = routeTask(task)

    switch (route.provider) {
      case 'openai': {
        const provider = new OpenAIProvider({
          baseUrl: process.env['OPENAI_BASE_URL'],
          apiKey: process.env['OPENAI_API_KEY'] ?? process.env['OPENAI_KEY'],
        })
        return provider.chat(messages, { ...options, model: route.model })
      }
      case 'anthropic': {
        const provider = new AnthropicProvider({
          baseUrl: process.env['ANTHROPIC_BASE_URL'],
          apiKey: process.env['ANTHROPIC_API_KEY'] ?? process.env['ANTRHOPIC_API_KEY'],
        })
        return provider.chat(messages, { ...options, model: route.model })
      }
      default: {
        // Should not happen; fallback to OpenAI (Anthropic/OpenAI only routing)
        const provider = new OpenAIProvider({
          baseUrl: process.env['OPENAI_BASE_URL'],
          apiKey: process.env['OPENAI_API_KEY'] ?? process.env['OPENAI_KEY'],
        })
        return provider.chat(messages, { ...options, model: route.model })
      }
    }
  }
}
