import { CustomPartialBlock } from '@/components/editor/schema'
import { capitalizeFirstLetter } from '@/lib/utils'

export const createParagraph = ({ content }: { content: { type: string; text: string }[] }) => {
  const block = {
    type: 'paragraph',
    content: content.map(({ type, text }) => {
      switch (type) {
        case 'text':
          return {
            type: 'text',
            text,
            styles: {},
          }
        case 'math':
          return {
            type: 'mathInline',
            text,
            content: [
              {
                type: 'text',
                text: text,
                styles: {},
              },
            ],
          }
        case 'code':
          return {
            type: 'text',
            text,
            styles: {
              code: true,
            },
          }
        default:
          return {
            type: 'text',
            text,
            styles: {},
          }
      }
    }),
    children: [],
  }
  return {
    block: block as CustomPartialBlock,
    message: `Paragraph created.`,
  }
}

export const createGraph = ({
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
  return {
    block: block as CustomPartialBlock,
    message: `Graph created with expression ${expressions.map(expr => expr.latex).join(', ')}.`,
  }
}

export const createMathBlock = ({ expression }: { expression: string }) => {
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
  return {
    block: block as CustomPartialBlock,
    message: `Math block created with expression ${expression}.`,
  }
}

export const createCodeBlock = ({ code, language }: { code: string; language: string }) => {
  const block = {
    type: 'codeblock',
    props: {
      language,
      code,
    },
    children: [],
  }
  return {
    block: block as CustomPartialBlock,
    message: `${capitalizeFirstLetter(language)} code block created.`,
  }
}
