import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";

export const useOptimisticDocumentUpdate = () => {
  const update = useMutation(api.documents.update).withOptimisticUpdate(
    (localStore, args) => {
      const { id, ...rest } = args;
      const currentDocument = localStore.getQuery(api.documents.getById, {
        documentId: id
      });
  
      if (currentDocument !== undefined) {
        localStore.setQuery(api.documents.getById, {documentId: id}, {
          ...currentDocument,
          ...rest,
        })
      }
    }
  );

  return update
}
