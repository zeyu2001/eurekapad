import { useQuery } from 'convex/react'
import { useEffect, useState } from 'react'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

export const useContent = (contentId: Id<'_storage'>) => {
  const [content, setContent] = useState<string>('')
  const getContentUrl = useQuery(api.documents.getContentUrl, {
    contentId,
  })

  useEffect(() => {
    if (getContentUrl) {
      fetch(getContentUrl)
        .then(response => response.text())
        .then(setContent)
    }
  }, [getContentUrl])

  return content
}
