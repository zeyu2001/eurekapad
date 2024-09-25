'use client'

import { useMutation, useQuery } from 'convex/react'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'

import { Cover } from '@/components/cover'
import { Toolbar } from '@/components/toolbar'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useContent } from '@/hooks/use-content'
import { useOptimisticDocumentUpdate } from '@/hooks/use-optimistic-document-update'
import { getTitle } from '@/lib/utils'

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

interface DocumentIdPageProps {
  params: {
    documentId: Id<'documents'>
  }
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  })

  const generateUploadUrl = useMutation(api.documents.generateContentUploadUrl)
  const [isLoaded, initialContent] = useContent(document)

  const [content, setContent] = useState<string | undefined>(initialContent)
  const [debouncedContent] = useDebounceValue<string | undefined>(content, 1000)

  const update = useOptimisticDocumentUpdate()

  const onChange = async (content: string) => {
    setContent(content)
  }

  const saveContent = useCallback(
    async (content: string) => {
      const uploadUrl = await generateUploadUrl({})

      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: content,
      })

      const { storageId } = await result.json()

      update({
        id: params.documentId,
        contentId: storageId,
      })
    },
    [generateUploadUrl, params.documentId, update],
  )

  useEffect(() => {
    if (!isLoaded || debouncedContent === undefined) {
      return
    }
    saveContent(debouncedContent)
  }, [debouncedContent, isLoaded])

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

export default DocumentIdPage
