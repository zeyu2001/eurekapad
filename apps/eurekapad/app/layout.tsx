import './globals.css'

import { TooltipProvider } from '@radix-ui/react-tooltip'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import clsx from 'clsx'
import type { Metadata } from 'next'
import { Inter, Lexend } from 'next/font/google'
import Script from 'next/script'
import { Toaster } from 'sonner'

import { ConvexClientProvider } from '@/components/providers/convex-provider'
import { ModalProvider } from '@/components/providers/modal-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import Scroll from '@/components/scroll'

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
  title: {
    default: 'EurekaPad - The Ultimate Note-Taking Platform for STEM',
    template: '%s | EurekaPad',
  },
  description:
    'Capture complex ideas, equations, and research data with powerful tools designed specifically for scientists, engineers, mathematicians, and students.',
  metadataBase: new URL('https://eurekapad.app'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Scroll />
      <Analytics />
      <SpeedInsights />
      <body className={clsx(inter.className, lexend.variable)}>
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
      </body>
    </html>
  )
}
