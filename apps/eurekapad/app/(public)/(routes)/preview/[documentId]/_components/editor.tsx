'use client'

import { use } from 'react'

import Editor from '@/components/editor'
import type { Doc } from '@/convex/_generated/dataModel'
import { getUrlFriendlyTitle } from '@/lib/utils'

interface EditorPreviewProps {
  document: Doc<'documents'>
  contentPromise: Promise<string | undefined>
}

export default function EditorPreview({ contentPromise, document }: EditorPreviewProps) {
  const content = contentPromise && use(contentPromise)

  // Update url without reloading
  const url = getUrlFriendlyTitle(document.title, document._id)
  window.history.replaceState({ ...window.history.state, as: url, url }, '', url)

  return <Editor editable={false} initialContent={content} />
}
