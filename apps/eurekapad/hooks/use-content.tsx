import { useQuery } from 'convex/react'
import { useEffect, useState } from 'react'

import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'

/**
 * Fetches the content of a document from the storage service.
 * Returns the content, or undefined if the content is not yet fetched.
 */
export const useContent = (document: Doc<'documents'> | undefined | null): [boolean, string | undefined] => {
  const [content, setContent] = useState<string | undefined>(undefined)

  // document might not be loaded yet, in that case contentUrl is undefined
  const contentUrl = useQuery(api.documents.getContentUrl, document ? { contentId: document.contentId } : 'skip')

  useEffect(() => {
    if (contentUrl) {
      fetch(contentUrl)
        .then(response => response.text())
        .then(setContent)
    } else if (contentUrl === null) {
      setContent('')
    }
  }, [contentUrl])

  return [content !== undefined, content]
}
