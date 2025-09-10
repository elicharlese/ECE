/*
  Simple AI connectivity check without starting Next.js.
  Usage:
    node -r ts-node/register scripts/ai-echo.ts --provider openai --task design --message "ping"
    node -r ts-node/register scripts/ai-echo.ts --provider anthropic --task code --message "ping"
*/

import 'dotenv/config'
import { AIClient, type AIMessage, routeTask } from '../libs/shared-business-logic/src/index'

interface Args {
  provider?: 'openai' | 'anthropic'
  task?: 'design' | 'code' | 'architecture' | 'optimize' | 'refactor' | 'plan' | 'test'
  message?: string
}

function parseArgs(): Args {
  const out: Args = {}
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i]
    const next = process.argv[i + 1]
    if ((arg === '--provider' || arg === '-p') && next) {
      out.provider = next as any
      i++
    } else if ((arg === '--task' || arg === '-t') && next) {
      out.task = next as any
      i++
    } else if ((arg === '--message' || arg === '-m') && next) {
      out.message = next
      i++
    }
  }
  return out
}

function decideTask(provider?: string, task?: string): Args['task'] {
  const p = (provider || '').toLowerCase()
  if (p === 'openai') return 'design'
  if (p === 'anthropic') return 'code'
  if (task && ['design','code','architecture','optimize','refactor','plan','test'].includes(task)) return task as any
  return 'plan'
}

async function main() {
  const args = parseArgs()
  const effectiveTask = decideTask(args.provider, args.task)
  const messages: AIMessage[] = [
    { role: 'system', content: 'You are a healthcheck. Reply tersely with "pong".' },
    { role: 'user', content: args.message ?? 'ping' },
  ]

  const route = routeTask(effectiveTask!)
  const ai = AIClient.getInstance()
  const res = await ai.chatTask(effectiveTask!, messages, { temperature: 0, maxTokens: 32 })

  // eslint-disable-next-line no-console
  console.log(JSON.stringify({
    ok: true,
    requestedProvider: args.provider ?? null,
    effectiveTask,
    routedProvider: route.provider,
    model: route.model,
    contentSnippet: (res.content || '').slice(0, 200),
  }, null, 2))
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(JSON.stringify({ ok: false, error: String(err?.message || err) }))
  process.exit(1)
})
