'use client'
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react'
import Link from 'next/link'
import React from 'react'

import { Spinner } from '@/components/spinner'

import { Logo } from './logo'

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Logo darkMode={false} />
            </Link>

            <nav className="ml-10 hidden space-x-8 md:flex">
              {/* <div className="relative group">
                <button className="flex items-center text-slate-700 px-2 py-1 text-sm font-medium">
                  Features
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute left-0 top-full z-10 mt-1 w-56 origin-top-left rounded-md bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">
                      Equation Editor
                    </Link>
                    <Link href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">
                      Collaboration Tools
                    </Link>
                    <Link href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">
                      Research Templates
                    </Link>
                    <Link href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">
                      Citation Manager
                    </Link>
                    <Link href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">
                      Data Visualization
                    </Link>
                  </div>
                </div>
              </div> */}
              {/* <div className="relative group">
                <button className="flex items-center text-slate-700 px-2 py-1 text-sm font-medium">
                  Resources
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
                </button>


                <div className="absolute left-0 top-full z-10 mt-1 w-56 origin-top-left rounded-md bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">
                      Documentation
                    </Link>
                    <Link href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">
                      Tutorials
                    </Link>
                    <Link href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">
                      API Reference
                    </Link>
                    <Link href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">
                      Community Forum
                    </Link>
                    <Link href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">
                      Blog
                    </Link>
                  </div>
                </div>
              </div> */}
              <Link
                href="/changelog"
                className="text-slate-700 px-2 py-1 text-sm font-medium hover:text-blue-600 transition-colors"
              >
                Changelog
              </Link>
              {/* <Link
                href="#"
                className="text-slate-700 px-2 py-1 text-sm font-medium hover:text-blue-600 transition-colors"
              >
                Pricing
              </Link> */}
              <Link
                href="#"
                className="text-slate-700 px-2 py-1 text-sm font-medium hover:text-blue-600 transition-colors"
              >
                Community
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <AuthLoading>
              <button
                disabled
                className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-x-2"
              >
                <Spinner size="sm" />
                Sign in
              </button>
              <button
                disabled
                className="rounded-md border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-x-2"
              >
                <Spinner size="sm" />
                Start for free
              </button>
            </AuthLoading>
            <Unauthenticated>
              <SignInButton mode="modal">
                <button className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-md border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  Start for free
                </button>
              </SignUpButton>
            </Unauthenticated>
            <Authenticated>
              <UserButton />
              <Link
                href="/documents"
                className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Go to Eurekapad
              </Link>
            </Authenticated>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
