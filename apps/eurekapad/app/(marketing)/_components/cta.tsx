'use client'
import { SignUpButton } from '@clerk/nextjs'
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react'
import Link from 'next/link'

import { Spinner } from '@/components/spinner'

export default function CTA() {
  return (
    <section className="relative pt-10 pb-16 lg:pt-18 lg:pb-24 bg-blue-600">
      <div className="absolute top-0 left-0 w-full overflow-hidden -translate-y-full">
        <div className="relative h-8">
          <div className="absolute bottom-0 w-full h-full bg-blue-600 rounded-t-[24px]" />
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to revolutionize your note-taking?
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-100">
          Join thousands of STEM professionals and students who&apos;ve transformed their workflow with EurekaPad.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          <AuthLoading>
            <button
              disabled
              className="rounded-md bg-white px-8 py-3 text-base font-medium text-blue-600 shadow-sm hover:bg-blue-50 transition-colors disabled:opacity-50 flex items-center gap-x-2"
            >
              <Spinner size="sm" />
              Get Started for Free
            </button>
          </AuthLoading>
          <Unauthenticated>
            <SignUpButton mode="modal">
              <button className="rounded-md bg-white px-8 py-3 text-base font-medium text-blue-600 shadow-sm hover:bg-blue-50 transition-colors">
                Get Started for Free
              </button>
            </SignUpButton>
          </Unauthenticated>
          <Authenticated>
            <Link
              href="/documents"
              className="rounded-md bg-white px-8 py-3 text-base font-medium text-blue-600 shadow-sm hover:bg-blue-50 transition-colors"
            >
              Get Started for Free
            </Link>
          </Authenticated>
          <p className="text-sm text-blue-200">No credit card required • Free forever plan available</p>
        </div>
      </div>
    </section>
  )
}
