import { createAzure } from '@ai-sdk/azure'

const azure = createAzure({
  resourceName: process.env.AZURE_OPENAI_RESOURCE_NAME,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: '2025-01-01-preview',
})

export const gpt4o = azure('gpt-4o')
export const gpt4oMini = azure('gpt-4o-mini')
export const o3Mini = azure('o3-mini')
