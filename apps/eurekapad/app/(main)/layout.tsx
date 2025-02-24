'use client'

import { RedirectToSignIn } from '@clerk/nextjs'
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react'

import { SearchCommand } from '@/components/search-command'
import { Spinner } from '@/components/spinner'

import { Navigation } from './_components/navigation'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthLoading>
        <div className="h-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </AuthLoading>
      <Authenticated>
        <div className="h-full flex dark:bg-[#1F1F1F]">
          <Navigation />
          <main className="flex-1 h-full overflow-y-auto">
            <SearchCommand />
            {children}
          </main>
        </div>
      </Authenticated>
      <Unauthenticated>
        <RedirectToSignIn />
      </Unauthenticated>
    </>
  )
}

export default MainLayout
