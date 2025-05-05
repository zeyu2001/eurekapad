import { BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs } from '@blocknote/core'
import { withMultiColumn } from '@blocknote/xl-multi-column'

import { codeBlockSpec } from '@/components/editor/code'
import { mathBlockSpec } from '@/components/editor/math/block'
import { transcriptionBlockSpec } from '@/components/editor/transcription'

import { graphBlockSpec } from './graph'
import { mathInlineSpec } from './math/inline'

const { codeBlock: _, ...restDefaultBlockSpecs } = defaultBlockSpecs

export const customSchema = withMultiColumn(
  BlockNoteSchema.create({
    inlineContentSpecs: {
      ...defaultInlineContentSpecs,
      mathInline: mathInlineSpec,
    },
    blockSpecs: {
      ...restDefaultBlockSpecs,
      math: mathBlockSpec,
      codeblock: codeBlockSpec,
      transcription: transcriptionBlockSpec,
      graph: graphBlockSpec,
    },
  }),
)

export type CustomEditor = typeof customSchema.BlockNoteEditor
export type CustomBlock = typeof customSchema.Block
export type CustomPartialBlock = typeof customSchema.PartialBlock
export type CustomInlineContentSchema = typeof customSchema.inlineContentSchema
