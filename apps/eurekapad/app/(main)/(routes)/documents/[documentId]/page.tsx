import { fetchQuery, preloadQuery } from 'convex/nextjs'
import { notFound } from 'next/navigation'

import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { getAuthToken } from '@/lib/convex-auth'

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

  return (
    <DocumentEditor preloadedDocument={preloadedDocument} authToken={token} canEdit={documentPermissions.isEditor} />
  )
}
