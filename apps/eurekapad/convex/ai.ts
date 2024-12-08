'use node'

import DocumentIntelligence from '@azure-rest/ai-document-intelligence'
import {
  AnalyzeResultOperationOutput,
  AnalyzeResultOutput,
  getLongRunningPoller,
  isUnexpected,
} from '@azure-rest/ai-document-intelligence'
import { v } from 'convex/values'
import axios from 'axios'

import { action } from './_generated/server'

export const parsePdf = action({
  args: {
    fileUrl: v.string(),
  },
  handler: async (ctx, args): Promise<[AnalyzeResultOutput, string[]]> => {
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
      queryParameters: { features: ['formulas'], pages: '1-2', output: ['figures'] }, // TODO: only limit free tier to 2 pages
    })

    if (isUnexpected(initialResponse)) {
      throw initialResponse.body.error
    }
    const poller = await getLongRunningPoller(client, initialResponse)
    const result = (await poller.pollUntilDone()).body as AnalyzeResultOperationOutput

    const resultId = poller.getOperationId()
    const figureIds = result.analyzeResult?.figures?.map(figure => figure.id)
    const figures = (
      figureIds
        ? await Promise.all(
            figureIds.map(
              figureId =>
                figureId &&
                // TODO: replace with DocumentIntelligence client once this issue is fixed:
                // https://github.com/Azure/azure-sdk-for-js/pull/31908
                axios
                  .get(
                    `${endpoint}/documentintelligence/documentModels/prebuilt-layout/analyzeResults/${resultId}/figures/${figureId}`,
                    {
                      params: {
                        'api-version': '2024-07-31-preview',
                      },
                      headers: {
                        'Ocp-Apim-Subscription-Key': apiKey,
                      },
                      responseType: 'arraybuffer',
                    },
                  )
                  .then(res => res.data),
            ),
          )
        : []
    ) as ArrayBuffer[]

    const analyzeResult = result.analyzeResult
    if (!analyzeResult) {
      throw new Error('No analyze result')
    }

    return [analyzeResult, figures.map(figure => Buffer.from(figure).toString('base64'))]
  },
})
