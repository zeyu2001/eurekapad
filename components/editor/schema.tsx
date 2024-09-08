import { BlockNoteSchema, defaultBlockSpecs, defaultStyleSpecs } from '@blocknote/core'

import { codeBlockSpec } from '@/components/editor/code'
import { mathBlockSpec } from '@/components/editor/math'
import { transcriptionBlockSpec } from '@/components/editor/transcription'

import { graphBlockSpec } from './graph'
import { Link } from './styles/link'

export const customSchema = BlockNoteSchema.create({
  styleSpecs: {
    ...defaultStyleSpecs,
    link: Link,
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
