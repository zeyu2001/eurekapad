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
import { useEffect } from 'react'
import { toast } from 'sonner'
import YPartyKitProvider from 'y-partykit/provider'
import * as Y from 'yjs'

import { customSchema } from '@/components/editor/schema'
import { CustomSlashMenu } from '@/components/editor/slash-menu'
import { api } from '@/convex/_generated/api'
import { useDocumentId } from '@/hooks/use-documentId'
import { useEditorContext } from '@/hooks/use-editor-context'
import { upload } from '@/lib/client-uploads'

const cursorColors = [
  '#FF6B6B',
  '#6BCB77',
  '#4D96FF',
  '#FFD93D',
  '#FF6EC7',
  '#6B8EFF',
  '#FFB347',
  '#8AFF80',
  '#B388FF',
  '#FF8A65',
  '#64FFDA',
  '#F06292',
  '#7C4DFF',
  '#A1887F',
  '#00E676',
]

const animalNames = [
  'Panda',
  'Koala',
  'Bunny',
  'Otter',
  'Fox',
  'Hedgehog',
  'Penguin',
  'Kitten',
  'Puppy',
  'Lamb',
  'Squirrel',
  'Raccoon',
  'Alpaca',
  'Sloth',
  'Chinchilla',
]

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

  const doc = new Y.Doc()

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
    collaboration: collab
      ? {
          provider: new YPartyKitProvider(
            process.env.NEXT_PUBLIC_YPARTYKIT_HOST ?? 'localhost:1999',
            documentId || 'default',
            doc,
            {
              params: {
                token: authToken,
                documentId,
              },
            },
          ),
          fragment: doc.getXmlFragment('prosemirror'),
          user: {
            name: user?.user?.fullName ?? 'Anonymous ' + animalNames[Math.floor(Math.random() * animalNames.length)],
            color: cursorColors[Math.floor(Math.random() * cursorColors.length)],
          },
          // showCursorLabels: 'always',
        }
      : undefined,
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

  const replaceWithSeparator = (block: CustomBlock) => {
    if (block.type !== 'paragraph') return
    const firstContent = block.content?.[0]
    if (!firstContent || firstContent.type !== 'text') return

    const text = (firstContent as StyledText<StyleSchema>).text
    const match = text.match(/^---(.*)$/)

    if (!match) return

    const label = match[1].trim()

    if (label) {
      editor.updateBlock(block.id, {
        type: 'separator',

        props: {
          label,
        },
      })
    } else {
      editor.updateBlock(block.id, {
        type: 'separator',
      })
    }

    editor.setTextCursorPosition({ id: block.id + 1 })
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

            if (
              currentBlock.type === 'paragraph' &&
              currentBlock.content?.[0]?.type === 'text' &&
              (currentBlock.content[0] as StyledText<StyleSchema>).text.startsWith('---')
            ) {
              event.preventDefault()
              replaceWithSeparator(currentBlock)
            }
          }
        }}
      >
        <CustomSlashMenu editor={editor} />
      </BlockNoteView>
    </div>
  )
}

export default Editor
