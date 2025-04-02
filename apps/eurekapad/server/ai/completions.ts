import { generateObject } from 'ai'
import { z } from 'zod'

import { gpt4oMini } from '@/server/ai/models'

export const inlineCompletion = async (
  currText: string,
  prevBlockDescription: string,
  nextBlockDescription: string,
) => {
  const result = await generateObject({
    model: gpt4oMini,
    schema: z.object({
      completion: z.string(),
    }),
    system:
      'You are a helpful assistant that provides inline text completions for technical STEM content. ' +
      'Respond to requests with a text completion, which will be added after the input text. ' +
      'Take into account the previous and next blocks of text to provide a relevant completion. ' +
      'The previous block occurs before the line currently being completed, and the next block occurs after. ' +
      'Only come up with inline text. No new lines, and code and math should also be inline. ' +
      'Use $$latex$$ for formulas and math symbols, and `code` to indicate code. ' +
      'Make sure that you produce correct LaTeX syntax. ' +
      'Use **bold** to indicate bold text, and *italic* to indicate italic text. ' +
      'Ensure that the input concatenated with the completion is a valid sentence.',
    prompt:
      `Previous block: ${prevBlockDescription}\n` +
      `Next block: ${nextBlockDescription}\n` +
      `Current input text: ${currText}\n` +
      `Complete the current input text with a text completion.`,
  })

  return result.object.completion
}
