'use client'

import { useQuery } from 'convex/react'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'

import { Cover } from '@/components/cover'
import { Toolbar } from '@/components/toolbar'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { useContent } from '@/hooks/use-content'
import { useDocumentId } from '@/hooks/use-documentId'
import { useSaveContentCallback } from '@/hooks/use-save-content-callback'
import { getTitle, getUrlFriendlyTitle } from '@/lib/utils'

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

export default function DocumentIdPage() {
  const documentId = useDocumentId()
  const document = useQuery(api.documents.getById, { documentId })

  const [isLoaded, initialContent] = useContent(document)

  const [content, setContent] = useState(initialContent)
  const debouncedSetContent = useDebounceCallback(setContent)

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

  if (document === undefined || !isLoaded) {
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
    return <div>Not found</div>
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
          <Editor onChange={onChange} savable initialContent={initialContent} />
        </div>
      </div>
    </>
  )
}
