'use client'

import '@blocknote/core/fonts/inter.css'

import { filterSuggestionItems } from '@blocknote/core'
import { combineByGroup } from '@blocknote/core'
import { getDefaultReactSlashMenuItems, SuggestionMenuController } from '@blocknote/react'
import { getMultiColumnSlashMenuItems } from '@blocknote/xl-multi-column'

import { insertCodeBlock } from '@/components/editor/code'
import { insertMathBlock } from '@/components/editor/math/block'
import { CustomEditor } from '@/components/editor/schema'
import { insertTranscriptionBlock } from '@/components/editor/transcription'

import { insertGraphBlock } from './graph'
import { insertSeparatorBlock } from './separator'

interface CustomSlashMenuProps {
  editor: CustomEditor
}

const groupOrder = ['Headings', 'Basic Blocks', 'Advanced', 'Media', 'Others']

export const CustomSlashMenu = ({ editor }: CustomSlashMenuProps) => {
  return (
    <SuggestionMenuController
      triggerCharacter={'/'}
      getItems={async query =>
        filterSuggestionItems(
          combineByGroup(
            [
              ...getDefaultReactSlashMenuItems(editor),
              insertMathBlock(editor),
              insertCodeBlock(editor),
              insertTranscriptionBlock(editor),
              insertGraphBlock(editor),
              insertSeparatorBlock(editor),
            ].sort(
              (a, b) =>
                groupOrder.indexOf(a.group || '') - groupOrder.indexOf(b.group || '') || a.title.localeCompare(b.title),
            ),
            getMultiColumnSlashMenuItems(editor),
          ),
          query,
        )
      }
    />
  )
}
