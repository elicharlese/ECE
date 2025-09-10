import type { AIChatOptions, AIChatResponse, AIMessage, AIProvider } from './types'

const DEFAULT_BASE = process.env['XAI_BASE_URL'] || 'https://api.x.ai/v1'

export class XAIProvider implements AIProvider {
  private readonly baseUrl: string
  private readonly apiKey?: string

  constructor(params?: { baseUrl?: string; apiKey?: string }) {
    this.baseUrl = params?.baseUrl ?? DEFAULT_BASE
    this.apiKey = params?.apiKey ?? process.env['XAI_API_KEY']
  }

  async chat(messages: AIMessage[], options?: AIChatOptions): Promise<AIChatResponse> {
    if (!this.apiKey) throw new Error('XAIProvider: XAI_API_KEY is not set')

    const url = `${this.baseUrl.replace(/\/$/, '')}/chat/completions`

    const body = {
      model: options?.model || process.env['XAI_CODE_MODEL'] || 'grok-2-latest',
      temperature: options?.temperature ?? 0.4,
      max_tokens: options?.maxTokens ?? 2048,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      stream: false,
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`XAIProvider: HTTP ${res.status} - ${text}`)
    }

    const data = (await res.json()) as any
    const content = data?.choices?.[0]?.message?.content ?? ''
    return { content, raw: data }
  }
}

export const createXAIProvider = (params?: { baseUrl?: string; apiKey?: string }) => new XAIProvider(params)
