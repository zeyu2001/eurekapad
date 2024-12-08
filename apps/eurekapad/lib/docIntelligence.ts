import { AnalyzeResultOutput } from '@azure-rest/ai-document-intelligence'
import { PartialBlock } from '@blocknote/core'

import { CustomEditor } from '@/components/editor/schema'

export const analysisResultToBlocks = (result: AnalyzeResultOutput, figureUrls: string[]) => {
  const blocks: PartialBlock<
    CustomEditor['schema']['blockSchema'],
    CustomEditor['schema']['inlineContentSchema'],
    CustomEditor['schema']['styleSchema']
  >[] = []
  // console.log(result)
  const { sections, paragraphs, figures, /*tables,*/ pages } = result
  if (!sections || !paragraphs || !pages) return blocks

  const formulas = pages.flatMap(page => page.formulas ?? [])

  let formulaIdx = 0
  let figureIdx = 0

  for (const section of sections ?? []) {
    for (const element of section.elements ?? []) {
      const match = /^\/(\w+)\/(\d+)$/.exec(element)
      if (!match) continue

      const [_, type, index] = match
      switch (type) {
        case 'paragraphs':
          const paragraph = paragraphs[parseInt(index) - 1]
          if (!paragraph) break

          if (paragraph.role == 'formulaBlock') {
            blocks.push({
              type: 'math',
              content: [
                {
                  type: 'text',
                  text: formulas[formulaIdx++].value,
                  styles: {},
                },
              ],
            })
          } else {
            const content = paragraph.content.split(/(:formula:)/).map((content, i) => {
              if (i % 2 === 0) {
                return {
                  type: 'text' as const,
                  text: content,
                  styles: {},
                }
              } else {
                const formula = formulas[formulaIdx++]
                return {
                  type: 'mathInline' as const,
                  content: [
                    {
                      type: 'text' as const,
                      text: formula.value,
                      styles: {},
                    },
                  ],
                }
              }
            })

            switch (paragraph.role) {
              case undefined:
                blocks.push({
                  type: 'paragraph',
                  content: content,
                })
                break

              case 'title':
                blocks.push({
                  type: 'heading',
                  props: {
                    level: 1,
                  },
                  content: content,
                })
                break

              case 'sectionHeading':
                blocks.push({
                  type: 'heading',
                  props: {
                    level: 2,
                  },
                  content: content,
                })
                break
            }
          }
          break

        case 'figures':
          if (!figures) break

          const figure = figures[parseInt(index)]
          if (!figure) break

          blocks.push({
            type: 'image',
            props: {
              url: figureUrls[figureIdx++],
              caption: figure.caption?.content,
              showPreview: true,
            },
          })
          break
      }
    }
  }

  return blocks
}
