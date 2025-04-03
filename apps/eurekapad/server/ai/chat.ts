import { CoreMessage, streamText } from 'ai'
import { z } from 'zod'

import { gpt4o } from '@/server/ai/models'

export const inlineChat = async (messages: CoreMessage[]) => {
  const result = await streamText({
    model: gpt4o,
    system:
      'You are a helpful assistant that answers questions about and generates new technical STEM content. ' +
      'You are given a document with blocks of content, and you can refer to the blocks when answering questions. ' +
      'You can also generate new blocks of content using the tools provided. ' +
      'If the user asks a question, answer it. ' +
      'If the user asks you to generate new content, the new content you generate will be added after the selected block.',
    messages,
    toolCallStreaming: true,
    tools: {
      createParagraph: {
        description:
          'Create an inline paragraph based on the provided data. ' +
          'The resulting paragraph is the concatenation of the content array. ' +
          'You cannot insert math and code in text type content, they must be created using the math and code types.',
        parameters: z.object({
          content: z.array(
            z.union([
              z.object({
                type: z.literal('text').describe('The type of content to display'),
                text: z
                  .string()
                  .describe('The content to display. No math/LaTeX expressions or code allowed. No newlines.'),
              }),
              z.object({
                type: z.literal('math').describe('The type of content to display'),
                text: z.string().describe('The $$LaTeX$$ expression to display, e.g. $$x^2 + y^2 = 1$$'),
              }),
              z.object({
                type: z.literal('code').describe('The type of content to display'),
                text: z.string().describe('The code to display, e.g. print("Hello World")'),
              }),
            ]),
          ),
        }),
      },
      createGraph: {
        description: 'Create a graph based on the provided data',
        parameters: z.object({
          expressions: z
            .array(
              z.object({
                latex: z
                  .string()
                  .describe(
                    'The LaTeX expression to graph, e.g. y=mx+c. ' +
                      'There must only be one dependent variable and one independent variable, which is x. ' +
                      'The left hand side should always be a single letter with an optional, fully alphabetical or numeric subscript, e.g. y_0 = mx + c. ' +
                      'All other symbols should be constants or parameters, and must be defined, e.g. m=1, c=0. ' +
                      'Do not call this tool if these conditions are not met.',
                  ),
                color: z.string().optional().describe('The hex color of the expression line, e.g. #c74440'),
              }),
            )
            .describe('The expressions to graph. For example, ["y=mx+c", "m=1", "c=0"]'),
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
      },
      createMathBlock: {
        description: 'Create a math block based on the provided data',
        parameters: z.object({
          expression: z.string().describe('The LaTeX expression to display, e.g. x^2 + y^2 = 1'),
        }),
      },
      createCodeBlock: {
        description: 'Create a code block based on the provided data',
        parameters: z.object({
          code: z.string().describe('The code to display'),
          language: z.string().describe('The programming language of the code'),
        }),
      },
    },
  })
  return result.toDataStreamResponse({
    getErrorMessage: error => {
      if (error == null) {
        return 'unknown error'
      }

      if (typeof error === 'string') {
        return error
      }

      if (error instanceof Error) {
        return error.message
      }

      return JSON.stringify(error)
    },
  })
}
