import { defaultProps } from '@blocknote/core'

export interface TranscriptionBlockConfig {
  type: 'transcription'
  isFileBlock: false
  readonly propSchema: typeof defaultProps
  content: 'inline'
}

export const transcriptionBlockConfig: TranscriptionBlockConfig = {
  type: 'transcription',
  isFileBlock: false,
  propSchema: {
    ...defaultProps,
  },
  content: 'inline',
}
