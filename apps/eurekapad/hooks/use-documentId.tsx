import { useParams } from 'next/navigation'

import { Id } from '@/convex/_generated/dataModel'

export function useDocumentId() {
  const params = useParams()
  if (typeof params.documentId !== 'string') {
    return undefined as unknown as Id<'documents'>
  }
  const actualDocumentId = params.documentId.split('-').pop()
  return actualDocumentId as Id<'documents'>
}
