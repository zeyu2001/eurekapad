import { BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs } from '@blocknote/core'

import { codeBlockSpec } from '@/components/editor/code'
import { mathBlockSpec } from '@/components/editor/math/block'
import { transcriptionBlockSpec } from '@/components/editor/transcription'

import { graphBlockSpec } from './graph'
import { mathInlineSpec } from './math/inline'

export const customSchema = BlockNoteSchema.create({
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    mathInline: mathInlineSpec,
  },
  blockSpecs: {
    ...defaultBlockSpecs,
    math: mathBlockSpec,
    codeblock: codeBlockSpec,
    transcription: transcriptionBlockSpec,
    graph: graphBlockSpec,
  },
})

export type CustomEditor = typeof customSchema.BlockNoteEditor
export type CustomBlock = typeof customSchema.Block
export type CustomInlineContentSchema = typeof customSchema.inlineContentSchema
