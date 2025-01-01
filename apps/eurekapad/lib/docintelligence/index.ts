import { AnalyzeResultOutput } from '@azure-rest/ai-document-intelligence'
import { PartialBlock } from '@blocknote/core'

import { CustomEditor } from '@/components/editor/schema'

import { createBlockFromParagraph, createContentFromParagraph, createImageBlock, extractFormulas } from './helpers'

export function analysisResultToBlocks(
  result: AnalyzeResultOutput,
  figureUrls: string[],
): PartialBlock<
  CustomEditor['schema']['blockSchema'],
  CustomEditor['schema']['inlineContentSchema'],
  CustomEditor['schema']['styleSchema']
>[] {
  const blocks: PartialBlock<
    CustomEditor['schema']['blockSchema'],
    CustomEditor['schema']['inlineContentSchema'],
    CustomEditor['schema']['styleSchema']
  >[] = []

  const { sections, paragraphs, figures, pages } = result
  if (!sections || !paragraphs || !pages) return blocks

  const formulas = extractFormulas(pages)

  let formulaIdx = 0
  let figureIdx = 0
  let paraIdx = 0

  for (const section of sections ?? []) {
    for (const element of section.elements ?? []) {
      const match = /^\/(\w+)\/(\d+)$/.exec(element)
      if (!match) continue

      const [_, type, indexStr] = match
      const index = parseInt(indexStr, 10)

      switch (type) {
        case 'paragraphs':
          while (paraIdx <= index) {
            const paragraph = paragraphs[paraIdx++]
            if (!paragraph) break

            if (paragraph.role === 'formulaBlock') {
              // Direct formula block
              const { content, formulaIdx: newFormulaIdx } = createContentFromParagraph(paragraph, formulas, formulaIdx)
              formulaIdx = newFormulaIdx
              blocks.push({
                type: 'math',
                content,
              })
            } else {
              // Regular paragraph with optional inline formulas
              const { content, formulaIdx: newFormulaIdx } = createContentFromParagraph(paragraph, formulas, formulaIdx)
              formulaIdx = newFormulaIdx
              blocks.push(createBlockFromParagraph(paragraph, content))
            }
          }
          break

        case 'figures':
          if (!figures) break
          if (!figures[index]) break
          blocks.push(createImageBlock(figures[index], figureUrls[figureIdx++]))
          break
      }
    }
  }

  return blocks
}
