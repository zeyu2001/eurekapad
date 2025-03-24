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

interface CustomSlashMenuProps {
  editor: CustomEditor
}

const groupOrder = ['Headings', 'Basic blocks', 'Advanced', 'Media', 'Others']

export const CustomSlashMenu = ({ editor }: CustomSlashMenuProps) => {
  return (
    <SuggestionMenuController
      triggerCharacter={'/'}
      getItems={async query => {
        const customSort = (a: { title: string; group?: string }, b: { title: string; group?: string }) => {
          if (query.toLowerCase() === 'graph' && a.title === 'Graph') return -1
          if (query.toLowerCase() === 'graph' && b.title === 'Graph') return 1

          return groupOrder.indexOf(a.group || '') - groupOrder.indexOf(b.group || '') || a.title.localeCompare(b.title)
        }

        return filterSuggestionItems(
          combineByGroup(
            [
              ...getDefaultReactSlashMenuItems(editor),
              insertMathBlock(editor),
              insertCodeBlock(editor),
              insertTranscriptionBlock(editor),
              insertGraphBlock(editor),
            ].sort(customSort),
            getMultiColumnSlashMenuItems(editor),
          ),
          query,
        )
      }}
    />
  )
}
