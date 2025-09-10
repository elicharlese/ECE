import type { AIChatOptions, AIChatResponse, AIMessage, AIProvider } from './types'

// Minimal Nebius provider using OpenAI-compatible chat endpoint shape
// Server-side only: requires NEBIUS_API_KEY

const DEFAULT_BASE = process.env['NEBIUS_BASE_URL'] || 'https://api.studio.nebius.com/v1'

export class NebiusProvider implements AIProvider {
  private readonly baseUrl: string
  private readonly apiKey?: string
  private readonly debug: boolean

  constructor(params?: { baseUrl?: string; apiKey?: string; debug?: boolean }) {
    this.baseUrl = params?.baseUrl ?? DEFAULT_BASE
    this.apiKey = params?.apiKey ?? process.env['NEBIUS_API_KEY']
    this.debug = !!(params?.debug ?? (process.env['DEBUG_NEBIUS_REQUESTS'] === 'true'))
  }

  async chat(messages: AIMessage[], options?: AIChatOptions): Promise<AIChatResponse> {
    if (!this.apiKey) {
      throw new Error('NebiusProvider: NEBIUS_API_KEY is not set')
    }

    const body: Record<string, unknown> = {
      model: options?.model || process.env['NEBIUS_CODE_MODEL'] || 'deepseek-v3',
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: options?.temperature ?? 0.4,
      max_tokens: options?.maxTokens ?? 2048,
      stream: false,
    }

    const url = `${this.baseUrl.replace(/\/$/, '')}/chat/completions`

    if (this.debug) {
      // eslint-disable-next-line no-console
      console.debug('[NebiusProvider] POST', url, JSON.stringify({ ...body, apiKey: '[hidden]' }).slice(0, 500))
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
      throw new Error(`NebiusProvider: HTTP ${res.status} - ${text}`)
    }

    const data = (await res.json()) as any

    // Try OpenAI-style first
    const content = data?.choices?.[0]?.message?.content
      ?? data?.output_text
      ?? data?.result
      ?? ''

    return { content, raw: data }
  }
}

export const createNebiusProvider = (params?: { baseUrl?: string; apiKey?: string; debug?: boolean }) =>
  new NebiusProvider(params)
