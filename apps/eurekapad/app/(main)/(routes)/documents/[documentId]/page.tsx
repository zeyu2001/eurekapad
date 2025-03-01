import { fetchQuery, preloadQuery } from 'convex/nextjs'
import { notFound } from 'next/navigation'

import { CoverSkeleton } from '@/components/coverSkeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { getAuthToken } from '@/convex/utils/auth'

import DocumentEditor from './_components/editor'

interface DocumentPageProps {
  params: Promise<{ documentId: string }>
}

export default async function DocumentPage(props: DocumentPageProps) {
  const { documentId: documentIdWithTitle } = await props.params
  const documentId = documentIdWithTitle.split('-').pop() as Id<'documents'>

  const token = await getAuthToken()
  const documentPermissions = await fetchQuery(api.documentPermissions.getUserPermissions, { documentId }, { token })
  const preloadedDocument = await preloadQuery(api.documents.getById, { documentId }, { token })

  if (documentPermissions && !documentPermissions.isViewer) {
    return notFound()
  }

  // TODO: also return this skeleton if in collab mode and still loading
  if (preloadedDocument === undefined) {
    return (
      <div>
        <CoverSkeleton />
        <div className="mx-auto mt-10 md:max-w-3xl lg:max-w-4xl">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-1/2" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <DocumentEditor preloadedDocument={preloadedDocument} authToken={token} canEdit={documentPermissions.isEditor} />
  )
}
