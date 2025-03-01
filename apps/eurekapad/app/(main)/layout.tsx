import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/nextjs'

import { SearchCommand } from '@/components/search-command'

import { Navigation } from './_components/navigation'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>
        <div className="flex h-full dark:bg-[#1F1F1F]">
          <Navigation />
          <main className="h-full flex-1 overflow-y-auto">
            <SearchCommand />
            {children}
          </main>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
