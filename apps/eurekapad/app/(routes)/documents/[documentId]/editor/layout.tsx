'use client'

import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/nextjs'
import { useConvexAuth } from 'convex/react'

import { Spinner } from '@/components/spinner'

const EditorLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth()

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <>
      <SignedIn>
        <div className="h-full flex dark:bg-[#1F1F1F]">
          <main className="flex-1 h-full overflow-y-auto">{children}</main>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      {!isAuthenticated && <RedirectToSignIn />}
    </>
  )
}

export default EditorLayout
