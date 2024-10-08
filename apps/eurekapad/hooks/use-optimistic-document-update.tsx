import { useMutation } from 'convex/react'

import { api } from '@/convex/_generated/api'

export function useOptimisticDocumentUpdate() {
  const update = useMutation(api.documents.update).withOptimisticUpdate((localStore, args) => {
    const { id, ...rest } = args
    const currentDocument = localStore.getQuery(api.documents.getById, {
      documentId: id,
    })

    if (currentDocument !== undefined) {
      localStore.setQuery(
        api.documents.getById,
        { documentId: id },
        {
          ...currentDocument,
          ...rest,
        },
      )

      const currentSidebarDocuments = localStore.getQuery(api.documents.getSidebar, {
        parentDocument: currentDocument.parentDocument,
      })

      if (currentSidebarDocuments !== undefined) {
        localStore.setQuery(
          api.documents.getSidebar,
          { parentDocument: currentDocument.parentDocument },
          currentSidebarDocuments.map(document => (document._id === id ? { ...document, ...rest } : document)),
        )
      }
    }
  })

  return update
}
