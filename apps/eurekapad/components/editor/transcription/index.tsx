import '@blocknote/mantine/style.css'

import { defaultProps, InlineContentSchema, StyleSchema } from '@blocknote/core'
import { createReactBlockSpec, ReactCustomBlockImplementation } from '@blocknote/react'
import { Mic } from 'lucide-react'

import { CustomEditor } from '@/components/editor/schema'
import { insertBlockAndFocus } from '@/lib/insert-block'

import { TranscriptionBlock } from './transcription-block'

export interface TranscriptionBlockConfig {
  type: 'transcription'
  isFileBlock: false
  readonly propSchema: typeof defaultProps
  content: 'inline'
}

const transcriptionBlockConfig: TranscriptionBlockConfig = {
  type: 'transcription',
  isFileBlock: false,
  propSchema: {
    ...defaultProps,
  },
  content: 'inline',
}

const transcriptionBlockImpl: ReactCustomBlockImplementation<
  TranscriptionBlockConfig,
  InlineContentSchema,
  StyleSchema
> = {
  render: TranscriptionBlock,
}

export const transcriptionBlockSpec = createReactBlockSpec<TranscriptionBlockConfig, InlineContentSchema, StyleSchema>(
  transcriptionBlockConfig,
  transcriptionBlockImpl,
)

export const insertTranscriptionBlock = (editor: CustomEditor) => ({
  title: 'Transcribe',
  onItemClick: () => {
    insertBlockAndFocus(editor, {
      type: 'transcription',
    })
  },
  icon: <Mic size={16} />,
  aliases: ['transcribe', 'microphone', 'audio', 'voice'],
  group: 'Advanced',
  subtext: 'Transcribe audio from your microphone',
})
