import { NextResponse } from 'next/server'
import { AIClient, type AIMessage, routeTask } from '@ece-platform/shared-business-logic'

export const runtime = 'nodejs'

const allowedTasks = new Set<
  'design' | 'code' | 'architecture' | 'optimize' | 'refactor' | 'plan' | 'test'
>(['design', 'code', 'architecture', 'optimize', 'refactor', 'plan', 'test'])

function decideTask(provider?: string, task?: string):
  'design' | 'code' | 'architecture' | 'optimize' | 'refactor' | 'plan' | 'test' {
  const p = (provider || '').toLowerCase()
  if (p === 'openai') return 'design'
  if (p === 'anthropic') return 'code'
  if (task && allowedTasks.has(task as any)) return task as any
  return 'plan'
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const provider = url.searchParams.get('provider') || undefined
    const taskParam = url.searchParams.get('task') || undefined
    const message = url.searchParams.get('message') || 'ping'

    const effectiveTask = decideTask(provider, taskParam)
    const route = routeTask(effectiveTask)

    const messages: AIMessage[] = [
      { role: 'system', content: 'You are a healthcheck. Reply with a short pong.' },
      { role: 'user', content: message },
    ]

    const ai = AIClient.getInstance()
    const res = await ai.chatTask(effectiveTask, messages, { temperature: 0, maxTokens: 32 })

    return NextResponse.json({
      ok: true,
      requestedProvider: provider || null,
      effectiveTask,
      routedProvider: route.provider,
      model: route.model,
      contentSnippet: (res.content || '').slice(0, 200),
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 })
  }
}
