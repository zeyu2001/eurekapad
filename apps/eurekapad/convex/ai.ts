'use node'

import DocumentIntelligence, { streamToUint8Array } from '@azure-rest/ai-document-intelligence'
import {
  AnalyzeOperationOutput,
  AnalyzeResultOutput,
  getLongRunningPoller,
  parseResultIdFromResponse,
  isUnexpected,
} from '@azure-rest/ai-document-intelligence'
import axios from 'axios'
import { v } from 'convex/values'

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

    if (
      !process.env.DOCUMENT_INTELLIGENCE_ENDPOINT ||
      !process.env.DOCUMENT_INTELLIGENCE_API_KEY ||
      !process.env.DOCUMENT_INTELLIGENCE_API_VERSION
    ) {
      throw new Error('Document Intelligence is not configured')
    }

    const endpoint = process.env.DOCUMENT_INTELLIGENCE_ENDPOINT
    const apiKey = process.env.DOCUMENT_INTELLIGENCE_API_KEY
    const apiVersion = process.env.DOCUMENT_INTELLIGENCE_API_VERSION

    const client = DocumentIntelligence(
      endpoint,
      {
        key: apiKey,
      },
      { apiVersion: apiVersion },
    )

    const initialResponse = await client.path('/documentModels/{modelId}:analyze', 'prebuilt-layout').post({
      contentType: 'application/json',
      body: {
        urlSource: args.fileUrl,
      },
      queryParameters: { features: ['formulas'], pages: '1-5', output: ['figures'] }, // TODO: only limit free tier to 2 pages
    })

    if (isUnexpected(initialResponse)) {
      throw initialResponse.body.error
    }
    const resultId = parseResultIdFromResponse(initialResponse)
    const poller = getLongRunningPoller(client, initialResponse)
    const analyzeResult = ((await poller.pollUntilDone()).body as AnalyzeOperationOutput).analyzeResult

    if (!analyzeResult || !analyzeResult.figures) {
      throw new Error('No analyze result')
    }

    const figureIds = analyzeResult.figures.map(figure => figure.id)
    if (figureIds.some(figureId => figureId !== undefined)) {
      throw new Error('No analyze result')
    }

    const figures = await Promise.all(
      figureIds.map(async figureId => {
        const output = await client
          .path(
            '/documentModels/{modelId}/analyzeResults/{resultId}/figures/{figureId}',
            'prebuilt-layout',
            resultId,
            figureId as string,
          )
          .get()
          .asNodeStream()
        if (output.status !== '200' || !output.body) {
          throw new Error('The response was unexpected, expected NodeJS.ReadableStream in the body.')
        }

        return streamToUint8Array(output.body)
      }),
    )

    return [analyzeResult, figures.map(figure => Buffer.from(figure).toString('base64'))]
  },
})
