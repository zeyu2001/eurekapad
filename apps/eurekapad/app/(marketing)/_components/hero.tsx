'use client'
import { SignUpButton } from '@clerk/nextjs'
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Spinner } from '@/components/spinner'

const Hero = () => {
  return (
    <div className="relative w-full overflow-hidden border-b border-slate-200 bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Background Pattern with Fade-out Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="relative h-full w-full">
          <svg className="h-full w-full" viewBox="0 0 1750 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Larger grid pattern */}
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1.5"></path>
              </pattern>
              {/* Gradient that fades out on both sides but with wider visible area */}
              <linearGradient id="fade-out" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="5%" stopColor="white" stopOpacity="1" />
                <stop offset="95%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <mask id="fade-mask">
                <rect width="100%" height="100%" fill="url(#fade-out)" />
              </mask>
            </defs>
            <g mask="url(#fade-mask)">
              <rect width="100%" height="100%" fill="url(#grid)" />
            </g>
          </svg>
        </div>
      </div>

      {/* Content Container */}
      <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col items-center text-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              The Ultimate Note-Taking Platform for STEM
            </h1>
            <p className="mt-6 text-xl text-slate-600">
              Capture complex ideas, equations, and research data with powerful tools designed specifically for
              scientists, engineers, mathematicians, and students.
            </p>
            <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
              <AuthLoading>
                <button
                  disabled
                  className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-x-2"
                >
                  <Spinner size="sm" />
                  Get Started for Free
                </button>
              </AuthLoading>
              <Unauthenticated>
                <SignUpButton mode="modal">
                  <button className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 transition-colors">
                    Get Started for Free
                  </button>
                </SignUpButton>
              </Unauthenticated>
              <Authenticated>
                <Link
                  href="/documents"
                  className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  Open EurekaPad
                </Link>
              </Authenticated>
              <Link
                href="/changelog"
                className="rounded-md border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
              >
                See What&apos;s New
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 max-w-5xl w-full">
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
              <Image
                src="/hero-image.webp"
                alt="EurekaPad app interface showing note-taking with equations"
                width={1200}
                height={630}
                className="w-full"
                priority
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
