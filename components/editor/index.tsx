'use client'

import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'
import './styles.css'

import { PartialBlock } from '@blocknote/core'
import { BlockNoteView } from '@blocknote/mantine'
import { useCreateBlockNote } from '@blocknote/react'
import { useAction, useConvexAuth } from 'convex/react'
import { useTheme } from 'next-themes'
import { memo, useEffect } from 'react'
import { toast } from 'sonner'

import { customSchema } from '@/components/editor/schema'
import { CustomSlashMenu } from '@/components/editor/slash-menu'
import { api } from '@/convex/_generated/api'
import { useEditorContext } from '@/hooks/use-editor-context'
import { upload } from '@/lib/client-uploads'

interface EditorProps {
  onChange: (_value: string) => void
  initialContent?: string
  editable?: boolean
  savable?: boolean
}

type CustomBlock = typeof customSchema.Block

const Editor = ({ onChange, initialContent, editable, savable }: EditorProps) => {
  const { resolvedTheme } = useTheme()
  const { isAuthenticated, isLoading } = useConvexAuth()

  const editorContext = useEditorContext()
  useEffect(() => {
    editorContext.setAuthenticated(isAuthenticated && !isLoading)
    editorContext.setSavable(savable ?? false)
  }, [isAuthenticated, isLoading, savable])

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
    initialContent: initialContent ? (JSON.parse(initialContent) as PartialBlock[]) : undefined,
    uploadFile: handleUpload,
  })

  const handleEditorChange = () => {
    const blocks = editor.document

    const updatedBlocks = blocks.map(block => {
      const updatedBlock = applyTriggerActions(block)
      return updatedBlock || block
    })

    onChange(JSON.stringify(updatedBlocks, null, 2))
  }

  // Update the type of applyTriggerActions
  const applyTriggerActions = (block: CustomBlock): CustomBlock | null => {
    const triggerActions = [
      {
        condition: (b: CustomBlock) =>
          b.type === 'paragraph' && b.content?.[0]?.type === 'text' && b.content[0].text.startsWith('```'),
        action: (b: CustomBlock) =>
          editor.updateBlock(b.id, {
            type: 'codeblock',
          }),
      },
    ]

    for (const { condition, action } of triggerActions) {
      if (condition(block)) {
        return action(block)
      }
    }

    return null
  }

  return (
    <div>
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        slashMenu={false}
        onChange={handleEditorChange}
      >
        <CustomSlashMenu editor={editor} />
      </BlockNoteView>
    </div>
  )
}

export default memo(Editor)
