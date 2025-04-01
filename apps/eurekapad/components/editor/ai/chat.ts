import { generateText } from 'ai'
import { z } from 'zod'

import { CustomBlock } from '@/components/editor/schema'
import { CustomPartialBlock } from '@/components/editor/serverSchema'
import { capitalizeFirstLetter } from '@/lib/utils'

import { gpt4o } from './models'

export const inlineChat = async (query: string, selectedBlock: string, documentBlocks: CustomBlock[]) => {
  console.log('inlineChat', query, selectedBlock, documentBlocks)

  const newBlocks: CustomPartialBlock[] = []
  const result = await generateText({
    model: gpt4o,
    system:
      'You are a helpful assistant that answers questions about and generates new technical STEM content. ' +
      'You are given a document with blocks of content, and you can refer to the blocks when answering questions. ' +
      'You can also generate new blocks of content using the tools provided. ' +
      'If the user asks a question, answer it. ' +
      'If the user asks you to generate new content, the new content you generate will be added after the selected block.',
    messages: [
      { role: 'user', content: query },
      // {
      //   role: 'user',
      //   content: {
      //     type: 'file',
      //     data: JSON.stringify(documentBlocks),
      //     mimeType: 'application/json',
      //   },
      // },
    ],
    tools: {
      createGraph: {
        description: 'Create a graph based on the provided data',
        parameters: z.object({
          expressions: z
            .array(
              z.object({
                latex: z.string().describe('The LaTeX expression to graph, e.g. y=mx+c'),
                color: z.string().optional().describe('The hex color of the expression line, e.g. #c74440'),
              }),
            )
            .describe(
              'The expressions to graph. x is the independent variable, and every constant must be defined. For example, ["y=mx+c", "m=1", "c=0"]',
            ),
          bounds: z
            .object({
              xMin: z.number().describe('Minimum x value'),
              xMax: z.number().describe('Maximum x value'),
              yMin: z.number().describe('Minimum y value'),
              yMax: z.number().describe('Maximum y value'),
            })
            .describe(
              'The bounds of the graph to display initially. The x axis goes from xMin to xMax, and the y axis goes from yMin to yMax',
            ),
        }),
        execute: async ({
          expressions,
          bounds,
        }: {
          expressions: { latex: string; color?: string }[]
          bounds: { xMin: number; xMax: number; yMin: number; yMax: number }
        }) => {
          const block = {
            type: 'graph',
            props: {
              state: JSON.stringify({
                version: 7,
                graph: { viewport: { xmin: bounds.xMin, ymin: bounds.yMin, xmax: bounds.xMax, ymax: bounds.yMax } },
                expressions: {
                  list: expressions.map((expr, index) => ({
                    id: (index + 2).toString(),
                    type: 'expression',
                    latex: expr.latex,
                    color: expr.color,
                  })),
                },
              }),
            },
            children: [],
          }
          newBlocks.push(block as CustomPartialBlock)
          return `Graph created with expression ${expressions.map(expr => expr.latex).join(', ')}.`
        },
      },
      createMathBlock: {
        description: 'Create a math block based on the provided data',
        parameters: z.object({
          expression: z.string().describe('The LaTeX expression to display, e.g. x^2 + y^2 = 1'),
        }),

        execute: async ({ expression }: { expression: string }) => {
          const block = {
            type: 'math',
            content: [
              {
                type: 'text',
                text: expression,
                styles: {},
              },
            ],
            children: [],
          }
          newBlocks.push(block as CustomPartialBlock)
          return `Math block created with expression ${expression}.`
        },
      },
      createCodeBlock: {
        description: 'Create a code block based on the provided data',
        parameters: z.object({
          code: z.string().describe('The code to display'),
          language: z.string().describe('The programming language of the code'),
        }),
        execute: async ({ code, language }: { code: string; language: string }) => {
          const block = {
            type: 'codeblock',
            props: {
              language,
              code,
            },
            children: [],
          }
          newBlocks.push(block as CustomPartialBlock)
          return `${capitalizeFirstLetter(language)} code block created.`
        },
      },
    },
  })
  return {
    response: result.text,
    newBlocks,
    toolCalls: result.toolCalls,
    toolResults: result.toolResults,
  }
}
