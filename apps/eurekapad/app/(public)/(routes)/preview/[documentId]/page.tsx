'use client'

import { useQuery } from 'convex/react'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'

import { Cover } from '@/components/cover'
import { Toolbar } from '@/components/toolbar'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { useContent } from '@/hooks/use-content'
import { useDocumentId } from '@/hooks/use-documentId'
import { getUrlFriendlyTitle } from '@/lib/utils'

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

export default function DocumentIdPage() {
  const documentId = useDocumentId()

  const document = useQuery(api.documents.getById, { documentId })
  const [isLoaded, content] = useContent(document)

  const onChange = (_content: string) => {}

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
    return notFound()
  }

  // Update url without reloading
  const url = getUrlFriendlyTitle(document.title, document._id)
  window.history.replaceState({ ...window.history.state, as: url, url }, '', url)

  return (
    <div className="pb-40">
      <Cover preview url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar preview initialData={document} />
        <Editor editable={false} onChange={onChange} initialContent={content} />
      </div>
    </div>
  )
}
