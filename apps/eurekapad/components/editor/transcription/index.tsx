import '@blocknote/mantine/style.css'

import { InlineContentSchema, StyleSchema } from '@blocknote/core'
import { createReactBlockSpec, ReactCustomBlockImplementation } from '@blocknote/react'
import { Mic } from 'lucide-react'

import { CustomEditor } from '@/components/editor/schema'
import { insertBlockAndFocus } from '@/lib/insert-block'

import { TranscriptionBlockConfig, transcriptionBlockConfig } from './config'
import { TranscriptionBlock } from './transcription-block'

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
