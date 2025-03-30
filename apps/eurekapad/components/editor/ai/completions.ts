import { createAzure } from '@ai-sdk/azure'
import { generateObject } from 'ai'
import { z } from 'zod'

const azure = createAzure({
  resourceName: process.env.AZURE_OPENAI_RESOURCE_NAME,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
})

const model = azure('gpt-4o-mini')

export const inlineCompletion = async (input: string) => {
  const result = await generateObject({
    model,
    schema: z.object({
      completion: z.string(),
    }),
    system:
      'You help users to quickly write STEM content. ' +
      'Respond to requests with a short text completion, which will be added after the input text. ' +
      'Only come up with inline text. No new lines, and code and math should also be inline. ' +
      'Use $$latex$$ for formulas and math symbols, and `code` to indicate code. ' +
      'Use **bold** to indicate bold text, and *italic* to indicate italic text. ' +
      'Ensure that the input concatenated with the completion is a valid sentence.',
    prompt: input,
  })

  return result.object.completion
}
