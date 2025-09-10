import type { AIChatOptions, AIChatResponse, AIMessage, AIProvider } from './types'

const DEFAULT_BASE = process.env['ANTHROPIC_BASE_URL'] || 'https://api.anthropic.com'
const DEFAULT_VERSION = process.env['ANTHROPIC_VERSION'] || '2023-06-01'

export class AnthropicProvider implements AIProvider {
  private readonly baseUrl: string
  private readonly apiKey?: string

  constructor(params?: { baseUrl?: string; apiKey?: string }) {
    this.baseUrl = params?.baseUrl ?? DEFAULT_BASE
    this.apiKey = params?.apiKey ?? process.env['ANTHROPIC_API_KEY'] ?? process.env['ANTRHOPIC_API_KEY']
  }

  async chat(messages: AIMessage[], options?: AIChatOptions): Promise<AIChatResponse> {
    if (!this.apiKey) throw new Error('AnthropicProvider: ANTHROPIC_API_KEY is not set')

    const url = `${this.baseUrl.replace(/\/$/, '')}/v1/messages`

    const systemMsg = messages.find((m) => m.role === 'system')
    const userAndAssistant = messages.filter((m) => m.role !== 'system')

    const body: Record<string, unknown> = {
      model: options?.model || process.env['ANTHROPIC_MODEL'] || 'claude-3-7-sonnet-2025-02-19',
      max_tokens: options?.maxTokens ?? 2048,
      temperature: options?.temperature ?? 0.4,
      system: systemMsg?.content,
      messages: userAndAssistant.map((m) => ({ role: m.role, content: m.content })),
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': DEFAULT_VERSION,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`AnthropicProvider: HTTP ${res.status} - ${text}`)
    }

    const data = (await res.json()) as any
    const content = data?.content?.[0]?.text ?? ''
    return { content, raw: data }
  }
}

export const createAnthropicProvider = (params?: { baseUrl?: string; apiKey?: string }) =>
  new AnthropicProvider(params)
