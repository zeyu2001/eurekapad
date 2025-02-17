import {
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  InlineContentSchema,
  StyleSchema,
} from '@blocknote/core'
import { createReactBlockSpec, createReactInlineContentSpec } from '@blocknote/react'
import { withMultiColumn } from '@blocknote/xl-multi-column'

import { CodeBlockConfig, codeBlockConfig } from './code/config'
import { GraphBlockConfig, graphBlockConfig } from './graph/config'
import { MathBlockConfig, mathBlockConfig, MathInlineConfig, mathInlineConfig } from './math/config'
import { transcriptionBlockSpec } from './transcription'

const { codeBlock: _, ...restDefaultBlockSpecs } = defaultBlockSpecs

export const serverCustomSchema = withMultiColumn(
  BlockNoteSchema.create({
    inlineContentSpecs: {
      ...defaultInlineContentSpecs,
      mathInline: createReactInlineContentSpec<MathInlineConfig, StyleSchema>(mathInlineConfig, {
        render: () => null,
      }),
    },
    blockSpecs: {
      ...restDefaultBlockSpecs,
      math: createReactBlockSpec<MathBlockConfig, InlineContentSchema, StyleSchema>(mathBlockConfig, {
        render: () => null,
      }),
      codeblock: createReactBlockSpec<CodeBlockConfig, InlineContentSchema, StyleSchema>(codeBlockConfig, {
        render: () => null,
      }),
      transcription: transcriptionBlockSpec,
      graph: createReactBlockSpec<GraphBlockConfig, InlineContentSchema, StyleSchema>(graphBlockConfig, {
        render: () => null,
      }),
    },
  }),
)

export type CustomEditor = typeof serverCustomSchema.BlockNoteEditor
export type CustomBlock = typeof serverCustomSchema.Block
export type CustomInlineContentSchema = typeof serverCustomSchema.inlineContentSchema
