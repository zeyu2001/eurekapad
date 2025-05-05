import { CoreMessage } from 'ai'
import { z } from 'zod'

import { inlineChat } from '@/server/ai/chat'

// Allow streaming responses up to 120 seconds
export const maxDuration = 120

export async function POST(req: Request) {
  const schema = z.object({
    messages: z
      .array(
        z.custom<CoreMessage>().refine(message => {
          return message.role === 'user' || message.role === 'assistant' || message.role === 'system'
        }),
      )
      .min(1),
  })

  const body = await req.json()
  const result = schema.safeParse(body)
  if (!result.success) {
    return new Response(JSON.stringify(result.error), { status: 400 })
  }

  const { messages } = result.data
  return inlineChat(messages)
}
