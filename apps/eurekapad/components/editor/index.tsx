'use client'

import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'
import './styles.css'

import { locales, StyledText, StyleSchema } from '@blocknote/core'
import { BlockNoteView } from '@blocknote/mantine'
import { useCreateBlockNote } from '@blocknote/react'
import { locales as multiColumnLocales, multiColumnDropCursor } from '@blocknote/xl-multi-column'
import { useUser } from '@clerk/nextjs'
import { ArrowConversionExtension, InlineMathExtension } from '@eurekapad/tiptap-extensions'
import { langNames, LanguageName } from '@uiw/codemirror-extensions-langs'
import { useAction, useConvexAuth } from 'convex/react'
import { useTheme } from 'next-themes'
import { type KeyboardEvent, useEffect } from 'react'
import { toast } from 'sonner'

import { newCollabProvider } from '@/components/editor/collab'
import { customSchema } from '@/components/editor/schema'
import { CustomSlashMenu } from '@/components/editor/slash-menu'
import { api } from '@/convex/_generated/api'
import { useDocumentId } from '@/hooks/use-documentId'
import { useEditorContext } from '@/hooks/use-editor-context'
import { upload } from '@/lib/client-uploads'

type EditorProps =
  | {
      onChange?: (_value: string) => void
      initialContent?: string // without collab, initial content must be provided, otherwise assumed to be empty
      editable?: boolean
      savable?: boolean
      collab?: false
      authToken?: never
    }
  | {
      onChange?: (_value: string) => void
      initialContent?: never // content will be fetched from Yjs provider
      editable?: boolean
      savable?: boolean
      collab: true
      authToken: string // Clerk JWT for authenticating the websocket connection with Yjs provider
    }

type CustomBlock = typeof customSchema.Block

const Editor = ({ onChange, editable, savable, collab, initialContent, authToken }: EditorProps) => {
  const { resolvedTheme } = useTheme()
  const { isAuthenticated, isLoading } = useConvexAuth()
  const user = useUser()
  const documentId = useDocumentId()

  const { setAuthenticated, setSavable } = useEditorContext()
  useEffect(() => {
    setAuthenticated(isAuthenticated && !isLoading)
    setSavable(savable ?? false)
  }, [isAuthenticated, isLoading, savable, setAuthenticated, setSavable])

  const getUploadUrl = useAction(api.uploads.getUploadUrl)

  const handleUpload = async (file: File) => {
    if (!useEditorContext.getState().authenticated) {
      toast.error('You must be logged in to upload files.')
      return ''
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB. Support for larger files coming soon!')
      return ''
    }

    // Don't need to upload blob if editor is not savable in the first place
    if (!useEditorContext.getState().savable) {
      return URL.createObjectURL(file)
    }

    const uploadUrl = await getUploadUrl({})
    const url = await upload(file, uploadUrl)

    if (!url) {
      toast.error('Failed to upload media.')
      return ''
    }

    return url.href ?? ''
  }

  const editor = useCreateBlockNote({
    schema: customSchema,
    dropCursor: multiColumnDropCursor,
    dictionary: {
      ...locales.en,
      multi_column: multiColumnLocales.en,
    },
    // initialContent: initialContent ? (JSON.parse(initialContent) as CustomBlock[]) : undefined,
    uploadFile: handleUpload,
    _tiptapOptions: {
      extensions: [InlineMathExtension, ArrowConversionExtension],
    },
    initialContent: initialContent && !collab ? (JSON.parse(initialContent) as CustomBlock[]) : undefined,
    collaboration: collab ? newCollabProvider(documentId, authToken, user?.user?.fullName) : undefined,
  })

  const replaceWithCodeBlock = (block: CustomBlock) => {
    if (block.type !== 'paragraph' || block.content?.[0]?.type !== 'text') return

    const language = (block.content[0] as StyledText<StyleSchema>).text.substring(3)
    if (langNames.includes(language as LanguageName)) {
      editor.updateBlock(block.id, {
        type: 'codeblock',
        props: { language },
      })
    } else {
      editor.updateBlock(block.id, {
        type: 'codeblock',
      })
    }

    editor.setTextCursorPosition({ id: block.id })
  }

  const handleCodeBlockShortcut = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      // Check if user is enterring a code block
      const currentBlock = editor.getTextCursorPosition().block

      if (
        currentBlock.type === 'paragraph' &&
        currentBlock.content?.[0]?.type === 'text' &&
        (currentBlock.content[0] as StyledText<StyleSchema>).text.startsWith('```')
      ) {
        event.preventDefault()
        replaceWithCodeBlock(currentBlock)
      }
    }
  }

  // temporary fix: https://github.com/TypeCellOS/BlockNote/issues/1516
  const handleSelectAll = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') {
      // let default behavior happen first
      setTimeout(() => {
        if (editor.getSelection() !== undefined) return

        const firstBlockWithContent = editor.document.find(
          block => block.content && 'length' in block.content && block.content.length > 0,
        )
        const lastBlockWithContent = editor.document
          .reverse()
          .find(block => block.content && 'length' in block.content && block.content.length > 0)

        if (firstBlockWithContent && lastBlockWithContent) {
          if (firstBlockWithContent !== lastBlockWithContent) {
            editor.setSelection(firstBlockWithContent, lastBlockWithContent)
          } else {
            const dummyBlock = editor.insertBlocks(
              [
                {
                  type: 'paragraph',
                  content: '',
                },
              ],
              firstBlockWithContent.id,
              'after',
            )[0]
            editor.setSelection(firstBlockWithContent, dummyBlock)
          }
        }
      }, 0)
    }
  }

  // handles the case where we are deleting an empty block right after a block with content
  // https://github.com/TypeCellOS/BlockNote/issues/605
  const handleBackspace = (event: KeyboardEvent) => {
    if (event.key === 'Backspace') {
      const selection = editor.getSelection()
      const position = editor.getTextCursorPosition()

      const blockTypesToNotDelete = [
        'audio',
        'codeblock',
        'file',
        'graph',
        'image',
        'math',
        'table',
        'transcription',
        'video',
      ]

      if (selection === undefined && position && position.block.type === 'paragraph') {
        const block = position.block
        const blockPos = editor._tiptapEditor.state.doc.resolve(editor._tiptapEditor.state.selection.anchor)
        const offset = editor._tiptapEditor.state.selection.$anchor.parentOffset

        const isTopBlock = blockPos.depth === 3
        const isEmptyBlock = block.content.length === 0 && block.children.length === 0
        const isEmptyContentWithChildren = block.content.length === 0 && block.children.length > 0
        const isAtStart = offset === 0

        if (!isAtStart) return

        if (isTopBlock && isEmptyBlock) {
          event.stopPropagation()
          event.preventDefault()
          editor.removeBlocks([block])

          if (position.prevBlock) {
            editor.setTextCursorPosition(position.prevBlock, 'end')
          }
        } else if (
          isTopBlock &&
          position.prevBlock &&
          isEmptyContentWithChildren &&
          Array.isArray(position.prevBlock.children)
        ) {
          event.stopPropagation()
          event.preventDefault()
          editor.updateBlock(position.prevBlock, {
            children: position.prevBlock.children.concat(block.children),
          })
          editor.removeBlocks([block])

          if (position.prevBlock) {
            editor.setTextCursorPosition(position.prevBlock, 'end')
          }
        } else if (position.prevBlock && blockTypesToNotDelete.includes(position.prevBlock.type)) {
          // when cursor is at the start of non-empty block, it also shouldn't immediately delete the previous block
          // this only applies to rich blocks like codeblock, graph, etc.
          // BlockNote already handles merging of blocks with content
          event.stopPropagation()
          event.preventDefault()
          editor.setTextCursorPosition(position.prevBlock, 'end')
        }
      }
    }
  }

  return (
    <div>
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        slashMenu={false}
        onChange={() => onChange?.(JSON.stringify(editor.document, null, 2))}
        onKeyDownCapture={event => {
          handleCodeBlockShortcut(event)
          handleBackspace(event)
          handleSelectAll(event)
        }}
      >
        <CustomSlashMenu editor={editor} />
      </BlockNoteView>
    </div>
  )
}

export default Editor
