import { fetchQuery } from 'convex/nextjs'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { Cover } from '@/components/cover'
import { Toolbar } from '@/components/toolbar'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'

import Editor from './_components/editor'

interface PreviewDocumentPageProps {
  params: Promise<{ documentId: string }>
}

export default async function PreviewDocumentPage(props: PreviewDocumentPageProps) {
  const { documentId: documentIdWithTitle } = await props.params
  const documentId = documentIdWithTitle.split('-').pop() as Id<'documents'>

  const document = await fetchQuery(api.documents.getById, { documentId })

  if (document === null) {
    return notFound()
  }

  const contentPromise = fetchQuery(api.documents.getContentUrl, { contentId: document.contentId }).then(contentUrl =>
    contentUrl ? fetch(contentUrl).then(resp => resp.text()) : undefined,
  )

  return (
    <div className="pb-40">
      <Cover preview url={document.coverImage} />
      <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
        <Toolbar preview initialData={document} />
        <Suspense
          fallback={
            <div className="mx-auto mt-10 md:max-w-3xl lg:max-w-4xl">
              <div className="space-y-4 pl-8">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            </div>
          }
        >
          <Editor document={document} contentPromise={contentPromise} />
        </Suspense>
      </div>
    </div>
  )
}
