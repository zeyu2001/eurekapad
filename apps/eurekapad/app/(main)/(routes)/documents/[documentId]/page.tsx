'use client'

import { useAuth } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Cover } from '@/components/cover'
import { Toolbar } from '@/components/toolbar'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { useDocumentId } from '@/hooks/use-documentId'
import { getTitle, getUrlFriendlyTitle } from '@/lib/utils'

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

export default function DocumentIdPage() {
  const documentId = useDocumentId()
  const document = useQuery(api.documents.getById, { documentId })
  const documentPermissions = useQuery(api.documentPermissions.getUserPermissions, { documentId })

  const [authToken, setAuthToken] = useState<string | null>(null)

  const auth = useAuth()

  useEffect(() => {
    const fetchAuthData = async () => {
      setAuthToken(
        await auth.getToken({
          template: 'convex',
        }),
      )
    }
    fetchAuthData()
  }, [auth])

  if (documentPermissions && !documentPermissions.isViewer) {
    return notFound()
  }

  if (document === undefined || documentPermissions === undefined || authToken === null) {
    return (
      <div>
        <Cover.Skeleton />
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

  if (document === null) {
    return notFound()
  }

  // Update url without reloading
  const url = getUrlFriendlyTitle(document.title, document._id)
  window.history.replaceState({ ...window.history.state, as: url, url }, '', url)

  return (
    <>
      <title>{getTitle(document.title)}</title>
      <div className="pb-40">
        <Cover url={document.coverImage} />
        <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
          <Toolbar initialData={document} />
          <Editor
            savable={documentPermissions.isEditor}
            editable={documentPermissions.isEditor}
            collab
            authToken={authToken}
          />
        </div>
      </div>
    </>
  )
}
