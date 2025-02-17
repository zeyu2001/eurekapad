'use client'

import { useQuery } from 'convex/react'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'

import { Cover } from '@/components/cover'
import { Toolbar } from '@/components/toolbar'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { useContent } from '@/hooks/use-content'
import { useDocumentId } from '@/hooks/use-documentId'
import { useSaveContentCallback } from '@/hooks/use-save-content-callback'
import { getTitle, getUrlFriendlyTitle } from '@/lib/utils'
import { trpc } from '@/utils/trpc'

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

export default function DocumentIdPage() {
  const documentId = useDocumentId()
  const document = useQuery(api.documents.getById, { documentId })
  const documentPermissions = useQuery(api.documentPermissions.getUserPermissions, { documentId })

  const [isLoaded, initialContent] = useContent(document)

  const [content, setContent] = useState(initialContent)
  const debouncedSetContent = useDebounceCallback(setContent)

  const isFirstLoad = useRef(true)
  const {
    data: ydoc,
    isLoading: isLoading,
    error: _error,
  } = trpc.blocksToYDoc.useQuery(initialContent ? JSON.parse(initialContent) : [], {
    enabled: isFirstLoad.current, // only get the YDoc from blocks on first load, after that the YJS provider will handle it
  })

  useEffect(() => {
    if (isFirstLoad.current && ydoc !== undefined) {
      isFirstLoad.current = false
    }
  }, [ydoc])

  const onChange = async (content: string) => {
    debouncedSetContent(content)
  }

  const saveContent = useSaveContentCallback()

  useEffect(() => {
    if (!isLoaded || content === undefined) {
      return
    }
    saveContent(content, documentId)
  }, [content, isLoaded])

  if (documentPermissions && !documentPermissions.isViewer) {
    return notFound()
  }

  if (document === undefined || documentPermissions === undefined || !isLoaded || (isLoading && isFirstLoad.current)) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    )
  }

  if (document === null) {
    return notFound()
  }

  // Update url without reloading
  const url = getUrlFriendlyTitle(document.title, document._id)
  window.history.replaceState({ ...window.history.state, as: url, url }, '', url)

  return (
    <>
      <title>{getTitle(document.title)}</title>
      <div className="pb-40">
        <Cover url={document.coverImage} />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
          <Toolbar initialData={document} />
          <Editor
            onChange={onChange}
            savable={documentPermissions.isEditor}
            editable={documentPermissions.isEditor}
            ydoc={ydoc}
            collab
          />
        </div>
      </div>
    </>
  )
}
