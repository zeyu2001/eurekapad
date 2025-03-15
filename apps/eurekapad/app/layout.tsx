import './globals.css'

import { TooltipProvider } from '@radix-ui/react-tooltip'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import clsx from 'clsx'
import { Inter, Lexend } from 'next/font/google'
import Script from 'next/script'
import type { Metadata } from 'next/types'
import { Toaster } from 'sonner'

import { ConvexClientProvider } from '@/components/providers/convex-provider'
import { ModalProvider } from '@/components/providers/modal-provider'
import { PostHogProvider } from '@/components/providers/posthog-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import Scroll from '@/components/scroll'
import { ClientProvider } from '@/utils/trpc'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
})

export const metadata: Metadata = {
  title: 'EurekaPad',
  description: 'Where better, faster work happens.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientProvider>
      <html lang="en" suppressHydrationWarning>
        <Scroll />
        <Analytics />
        <SpeedInsights />
        <body className={clsx(inter.className, lexend.variable)}>
          <PostHogProvider>
            <Script
              src="https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"
              strategy="beforeInteractive"
            />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              storageKey="eurekapad-theme-2"
            >
              <ConvexClientProvider>
                <TooltipProvider>
                  <Toaster position="bottom-center" />
                  <ModalProvider />
                  {children}
                </TooltipProvider>
              </ConvexClientProvider>
            </ThemeProvider>
          </PostHogProvider>
        </body>
      </html>
    </ClientProvider>
  )
}
