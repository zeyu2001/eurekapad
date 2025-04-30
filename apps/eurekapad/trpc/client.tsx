'use client'

import { useAuth } from '@clerk/nextjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { useEffect, useState } from 'react'

import type { AppRouter } from '@/trpc'

import { transformer } from './transformer'

function getBaseUrl() {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return ''
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export const trpc = createTRPCReact<AppRouter>()

export function TRPCClientProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const { getToken, isSignedIn } = useAuth()
  const [trpcClient, setTrpcClient] = useState<ReturnType<typeof trpc.createClient> | null>(null)

  useEffect(() => {
    async function createClient() {
      const client = trpc.createClient({
        links: [
          loggerLink({
            enabled: () => process.env.NODE_ENV === 'development',
          }),
          httpBatchLink({
            url: `${getBaseUrl()}/api/trpc`,
            headers: async () => {
              const token = await getToken()
              return {
                Authorization: token ? `Bearer ${token}` : '',
              }
            },
          }),
        ],
        transformer,
      })

      setTrpcClient(client)
    }

    createClient()
  }, [getToken, isSignedIn])

  if (!trpcClient) {
    // Simple loading state
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
    </trpc.Provider>
  )
}
