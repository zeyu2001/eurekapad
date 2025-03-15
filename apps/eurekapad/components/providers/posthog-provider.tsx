// app/providers.tsx
'use client'

import { useAuth, useUser } from '@clerk/nextjs'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { usePostHog } from 'posthog-js/react'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { Suspense, useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: '/ingest',
      ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
    })
  }, [])

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  )
}

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  const { isSignedIn, userId } = useAuth()
  const { user } = useUser()

  // Track pageviews
  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname
      const params = searchParams?.toString()
      if (params) {
        url = url + '?' + params
      }

      posthog.capture('$pageview', { $current_url: url })
    }
  }, [pathname, searchParams, posthog])

  useEffect(() => {
    // 👉 Check the sign-in status and user info,
    //    and identify the user if they aren't already
    if (isSignedIn && userId && user && !posthog._isIdentified()) {
      // 👉 Identify the user
      posthog.identify(userId, {
        email: user.primaryEmailAddress?.emailAddress,
        username: user.username,
      })
    }
  }, [posthog, user])

  return null
}

// Wrap PostHogPageView in Suspense to avoid the useSearchParams usage above
// from de-opting the whole app into client-side rendering
// See: https://nextjs.org/docs/messages/deopted-into-client-rendering
function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  )
}
