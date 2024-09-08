import { useQuery } from 'convex/react'
import { useEffect, useState } from 'react'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

/**
 * Fetches the content of a document from the storage service.
 * Returns the content, or undefined if the content is not yet fetched.
 */
export const useContent = (contentId: Id<'_storage'> | undefined): [boolean, string | undefined] => {
  const [content, setContent] = useState<string | undefined>(undefined)
  const [isLoaded, setIsLoaded] = useState(false)
  const getContentUrl = useQuery(api.documents.getContentUrl, {
    contentId,
  })

  useEffect(() => {
    if (getContentUrl) {
      fetch(getContentUrl)
        .then(response => response.text())
        .then(setContent)
    } else if (getContentUrl !== undefined) {
      setContent('')
    }
  }, [getContentUrl])

  useEffect(() => {
    if (content !== undefined) {
      setIsLoaded(true)
    }
  }, [content])

  return [isLoaded, content]
}
