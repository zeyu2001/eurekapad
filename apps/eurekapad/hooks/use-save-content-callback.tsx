import { useMutation } from 'convex/react'
import { useCallback } from 'react'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

import { useOptimisticDocumentUpdate } from './use-optimistic-document-update'

export const useSaveContentCallback = () => {
  const generateUploadUrl = useMutation(api.documents.generateContentUploadUrl)
  const update = useOptimisticDocumentUpdate()

  return useCallback(
    async (content: string, documentId: Id<'documents'>) => {
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
        id: documentId,
        contentId: storageId,
      })
    },
    [generateUploadUrl, update],
  )
}
