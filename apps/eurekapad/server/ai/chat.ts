import { CoreMessage, streamText } from 'ai'
import { z } from 'zod'

import { o3Mini } from '@/server/ai/models'

export const inlineChat = async (messages: CoreMessage[]) => {
  const result = await streamText({
    model: o3Mini,
    system:
      'You are a highly capable technical assistant specializing in STEM content creation and editing. ' +
      'Your role is to analyze and enhance technical documents by writing accurate, concise, and well-structured content. ' +
      'You are provided with a document containing blocks of content, which you are inserting new content into. ' +
      'When writing new content, ensure it is relevant, technical, and adds value to the document. ' +
      'Incorporate rich elements such as mathematical expressions, graphs, and code snippets where appropriate. ' +
      'Always strive for clarity and precision in your responses. ' +
      'Generate new content using the tools provided. The content you generate will be inserted after the currently selected block. ' +
      'You may generate multiple blocks. If the document is small, generating multiple blocks is preferred.',
    messages,
    toolCallStreaming: true,
    maxSteps: 5,
    tools: {
      createParagraph: {
        description:
          'Generate an inline paragraph based on the provided data. ' +
          'The paragraph is constructed by concatenating elements from the content array. ' +
          'Each element must be of one of the following types: text, math, or code. ' +
          'Text elements must not include math/LaTeX expressions or code, and should not contain newlines. ' +
          'You cannot insert math and code in text type content, they must be created using the math and code types.',
        parameters: z.object({
          content: z.array(
            z.union([
              z.object({
                type: z.literal('text').describe('The type of content to display'),
                text: z
                  .string()
                  .describe('The text to display. No math/LaTeX expressions or code allowed. No newlines.'),
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
        description: 'Generate a graph based on the provided data',
        parameters: z.object({
          expressions: z
            .array(
              z.object({
                latex: z
                  .string()
                  .describe(
                    'The LaTeX expression to graph, e.g. y=mx+c. ' +
                      'Ensure there is only one dependent variable and only one independent variable. ' +
                      'The independent variable must be called x, and must be on the right-hand side of the equation. ' +
                      'If the independent variable is conventionally called something else, e.g. r for radius,' +
                      'use x as the independent variable and define the other variable in terms of x by adding ' +
                      'a dummy expression to the end of the expressions list, e.g. r=x. ' +
                      'The dependent variable must be a single letter with an optional subscript, e.g. F = \\frac{GMm}{r^2}. ' +
                      'Make sure that the terms are descriptive, e.g. F for force, v for velocity, etc. ' +
                      'All other symbols must be constants or parameters, which must be defined, e.g. G=6.67430\\times10^{-11}. ' +
                      'Do not call this tool if these conditions are not met.',
                  ),
                color: z.string().describe('The hex color of the expression line, e.g. #c74440'),
              }),
            )
            .describe(
              'The expressions to graph, e.g. ["F=\\frac{GMm}{r^2}", "G=6.67430\\times10^{-11}, M=5.972\\times10^{24}, ' +
                'm=100\\times10 ^ 3, r=x"]',
            ),
          bounds: z
            .object({
              xMin: z.number().describe('Minimum x value'),
              xMax: z.number().describe('Maximum x value'),
              yMin: z.number().describe('Minimum y value'),
              yMax: z.number().describe('Maximum y value'),
            })
            .describe(
              'The initial bounds of the graph. The x-axis ranges from xMin to xMax, and the y-axis ranges from yMin to yMax.',
            ),
        }),
      },
      createMathBlock: {
        description: 'Generate a standalone math block based on the provided data',
        parameters: z.object({
          expression: z.string().describe('The LaTeX expression to display, e.g. x^2 + y^2 = 1'),
        }),
      },
      createCodeBlock: {
        description: 'Generate a standalone code block based on the provided data',
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
