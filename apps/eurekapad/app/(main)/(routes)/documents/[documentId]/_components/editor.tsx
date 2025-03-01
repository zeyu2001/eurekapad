'use client'

import { Preloaded, usePreloadedQuery } from 'convex/react'
import { notFound } from 'next/navigation'

import { Cover } from '@/components/cover'
import Editor from '@/components/editor'
import { Toolbar } from '@/components/toolbar'
import { api } from '@/convex/_generated/api'
import { getUrlFriendlyTitle } from '@/lib/utils'

interface DocumentEditorProps {
  preloadedDocument: Preloaded<typeof api.documents.getById>
  canEdit: boolean
  authToken: string
}

export default function DocumentEditor({ preloadedDocument, canEdit, authToken }: DocumentEditorProps) {
  const document = usePreloadedQuery(preloadedDocument)

  if (document === null) {
    return notFound()
  }

  // Update url without reloading
  const url = getUrlFriendlyTitle(document.title, document._id)
  window.history.replaceState({ ...window.history.state, as: url, url }, '', url)

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
        <Toolbar initialData={document} />
        <Editor savable={canEdit} editable={canEdit} collab authToken={authToken} />
      </div>
    </div>
  )
}
