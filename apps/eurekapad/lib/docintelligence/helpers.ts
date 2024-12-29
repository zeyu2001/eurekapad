import {
  AnalyzeResultOutput,
  DocumentFigureOutput,
  DocumentFormulaOutput,
  DocumentParagraphOutput,
} from '@azure-rest/ai-document-intelligence'
import { PartialBlock, PartialInlineContent } from '@blocknote/core'

import { CustomEditor } from '@/components/editor/schema'

type Block = PartialBlock<
  CustomEditor['schema']['blockSchema'],
  CustomEditor['schema']['inlineContentSchema'],
  CustomEditor['schema']['styleSchema']
>

type Content = Extract<Block['content'], PartialInlineContent<any, any>>

/**
 * Extracts all formulas from the given pages.
 */
export function extractFormulas(pages: AnalyzeResultOutput['pages']): DocumentFormulaOutput[] {
  if (!pages) return []
  return pages.flatMap(page => page.formulas ?? [])
}

/**
 * Creates inline content for a paragraph. This may include text nodes and inline formulas.
 * Returns the created content and updates the formula index.
 */
export function createContentFromParagraph(
  paragraph: DocumentParagraphOutput,
  formulas: DocumentFormulaOutput[],
  formulaIdx: number,
): { content: Content; formulaIdx: number } {
  // Paragraph content may contain inline formulas denoted by ":formula:"
  const parts = paragraph.content.replace(/(:selected:|:unselected:)/g, '').split(/(:formula:)/)

  if (paragraph.role === 'formulaBlock') {
    return {
      content: [
        {
          type: 'text' as const,
          text: parts.map((part, i) => (i % 2 === 0 ? part : formulas[formulaIdx++].value)).join(''),
          styles: {},
        },
      ],
      formulaIdx,
    }
  }

  const content = parts.map((part, i) => {
    if (i % 2 === 0) {
      return {
        type: 'text' as const,
        text: part,
        styles: {},
      }
    } else {
      const formula = formulas[formulaIdx++]
      return {
        type: 'mathInline' as const,
        content: [
          {
            type: 'text' as const,
            text: formula?.value ?? '',
            styles: {},
          },
        ],
      }
    }
  })

  return { content, formulaIdx }
}

/**
 * Converts a paragraph and its computed content into a corresponding block, depending on paragraph role.
 */
export function createBlockFromParagraph(paragraph: DocumentParagraphOutput, content: Content): Block {
  switch (paragraph.role) {
    case 'title':
      return {
        type: 'heading',
        props: { level: 1 },
        content,
      }
    case 'sectionHeading':
      return {
        type: 'heading',
        props: { level: 2 },
        content,
      }
    default:
      return {
        type: 'paragraph',
        content,
      }
  }
}

/**
 * Creates an image block from a figure and its associated URL.
 */
export function createImageBlock(figure: DocumentFigureOutput, figureUrl: string): Block {
  return {
    type: 'image',
    props: {
      url: figureUrl,
      caption: figure.caption?.content,
      showPreview: true,
    },
  }
}
