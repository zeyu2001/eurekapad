import { glob } from 'glob'
import { ArrowRight, Calendar } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import Navbar from '../_components/navbar'

// Function to format date string from "DD-MM-YYYY" to "Month DD, YYYY"
const formatDate = (dateString: string) => {
  // Parse the date string (assuming format is "DD-MM-YYYY")
  const [day, month, year] = dateString.split('-').map(part => parseInt(part, 10))

  // Create a Date object (months are 0-indexed in JavaScript)
  const date = new Date(year, month - 1, day)

  // Format the date to "Month DD, YYYY"
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function Changelog() {
  const posts = await Promise.all(
    glob
      .sync(`*.mdx`, { cwd: 'content/changelog/' })
      .map(file => file.replace(/ /g, '-').slice(0, -4).trim())
      .map(async slug => {
        const data = await import(`@/content/changelog/${slug}.mdx`)
        return {
          id: slug,
          title: data.meta.title,
          href: `/changelog/${slug}`,
          dateTime: data.meta.lastUpdated,
          content: data.default,
          featureMedia: data.meta.featureMedia || null,
          tags: data.meta.tags || [],
        }
      }),
  ).then(posts => {
    return posts.toSorted((a, b) => Date.parse(b.dateTime) - Date.parse(a.dateTime))
  })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <Navbar />
      {/* Main Content */}
      <main>
        <div className="relative w-full overflow-hidden border-b border-slate-200 bg-gradient-to-br from-blue-50 to-slate-100">
          {/* Background Pattern */}
          <div className="absolute inset-0 overflow-hidden opacity-80">
            <div className="relative h-full w-full">
              <svg className="h-full w-full" viewBox="0 0 1750 650" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                    <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1.5"></path>
                  </pattern>
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
          <div className="container relative mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
            <div className="flex flex-col items-center">
              <div className="max-w-3xl text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
                  Product Updates
                </h1>
                <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600">
                  Track our journey as we build the ultimate note-taking tool for STEM researchers and students.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Container for changelog entries */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-6xl">
          {/* Changelog Entry */}

          {posts.map(post => (
            <div key={post.id} className="relative border-b border-slate-100 py-10 sm:py-16 md:py-20 group">
              <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-4 lg:gap-8">
                {/* Date on the left */}
                <div className="mb-4 lg:mb-0">
                  <div className="lg:sticky lg:top-24">
                    <div className="flex flex-row lg:flex-col items-center lg:items-start">
                      <div className="flex items-center text-sm font-medium text-blue-600">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatDate(post.dateTime)}
                      </div>
                      <div className="hidden lg:block mt-2 h-1 w-12 rounded-full bg-blue-600"></div>
                    </div>
                  </div>
                </div>

                {/* Content in the middle */}
                <div className="transform transition-all duration-300 ease-in-out max-w-4xl">
                  <div className="mb-4 sm:mb-6 flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                    >
                      <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500"></span>
                      New Feature
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200"
                    >
                      <span className="mr-1.5 h-2 w-2 rounded-full bg-amber-500"></span>
                      Enhancement
                    </Badge>
                  </div>

                  <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                    {post.title}
                  </h2>

                  <div className="prose prose-slate sm:prose-base prose-headings:font-semibold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl max-w-none text-sm sm:text-base">
                    {post.content()}
                  </div>

                  {post.featureMedia && (
                    <div className="mt-6 sm:mt-10 overflow-hidden rounded-xl border border-slate-200 shadow-md bg-white transition-all hover:shadow-lg">
                      <div className="p-2">
                        {post.featureMedia.type === 'video' ? (
                          <video
                            src={post.featureMedia.src}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full rounded-md"
                            width={1000}
                            height={500}
                          />
                        ) : (
                          <Image
                            src={post.featureMedia.src}
                            alt={post.featureMedia.alt || 'Feature image'}
                            width={1000}
                            height={500}
                            className="w-full object-cover rounded-lg"
                            loading="lazy"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Read more link */}
                  <div className="mt-6 sm:mt-8 flex justify-end">
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      Read full release notes
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Load more button */}
          {/* <div className="py-10 sm:py-16 flex justify-center">
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600 hover:border-blue-700 transition-colors duration-200 min-h-[44px] px-6 active:scale-[0.98]"
            >
              Load more updates
            </Button>
          </div> */}
        </div>
      </main>
    </div>
  )
}
