'use node'

import DocumentIntelligence from '@azure-rest/ai-document-intelligence'
import { AnalyzeResultOperationOutput, getLongRunningPoller, isUnexpected } from '@azure-rest/ai-document-intelligence'
import { v } from 'convex/values'

import { action } from './_generated/server'

export const parsePdf = action({
  args: {
    fileUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not authenticated')
    }

    if (!process.env.DOCUMENT_INTELLIGENCE_ENDPOINT || !process.env.DOCUMENT_INTELLIGENCE_API_KEY) {
      throw new Error('Document Intelligence is not configured')
    }

    const endpoint = process.env.DOCUMENT_INTELLIGENCE_ENDPOINT
    const apiKey = process.env.DOCUMENT_INTELLIGENCE_API_KEY

    const client = DocumentIntelligence(endpoint, {
      key: apiKey,
    })

    const initialResponse = await client.path('/documentModels/{modelId}:analyze', 'prebuilt-layout').post({
      contentType: 'application/json',
      body: {
        urlSource: args.fileUrl,
      },
      queryParameters: { features: ['formulas'] },
    })

    if (isUnexpected(initialResponse)) {
      throw initialResponse.body.error
    }
    const poller = await getLongRunningPoller(client, initialResponse)
    const result = (await poller.pollUntilDone()).body as AnalyzeResultOperationOutput

    return result
  },
})
