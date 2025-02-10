'use client'
import { useConvexAuth } from 'convex/react'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'

import { Logo } from './logo'

export default function HeaderHero() {
  const { isAuthenticated, isLoading } = useConvexAuth()

  return (
    <section className="relative">
      {/* Dots pattern background */}
      <div
        className="absolute inset-0 z-99"
        style={{
          backgroundImage: `url(/dots-pattern.svg)`,
          backgroundSize: '32px 32px',
          opacity: 0.4,
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <header className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
            </Link>
            {isLoading && (
              <div className="w-full flex items-center justify-end">
                <Spinner size="lg" />
              </div>
            )}
            {isAuthenticated && !isLoading && (
              <Button asChild className="rounded-full">
                <Link href="/documents">
                  Enter EurekaPad
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            )}
            {!isAuthenticated && !isLoading && (
              <div className="flex items-center space-x-6">
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Login
                </Link>
                <Button variant="secondary">Try EurekaPad Now</Button>
              </div>
            )}
          </div>
        </header>

        {/* Hero */}
        <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="container mx-auto max-w-4xl">
            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              Transform Your STEM
              <br />
              Notes Into Knowledge
            </h1>

            {/* Subtitle */}
            <p className="text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
              The ultimate note-taking app designed specifically for STEM students and researchers. From complex
              equations to research papers, organize everything in one place.
            </p>

            {/* CTA Button */}
            <Button size="lg" className="mb-4" variant="secondary">
              Try EurekaPad for free
            </Button>

            {/* No commitment text */}
            <p className="text-sm text-gray-500">No credit card required • Cancel anytime</p>

            {/* Demo Image */}
            <div className="mt-16 relative rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/placeholder.svg?height=600&width=1200"
                alt="EurekaPad Interface Demo"
                width={1200}
                height={600}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
