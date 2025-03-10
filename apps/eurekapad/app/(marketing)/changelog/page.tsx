import { glob } from 'glob'
import { ArrowRight, Beaker, ChevronDownIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import Navbar from '../_components/navbar'

interface Tag {
  name: string
  color: string
  textColor: string
  dotColor: string
}

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
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Redesigned Hero Section - Full Width */}
        <div className="relative w-full overflow-hidden border-b border-slate-200 bg-gradient-to-br from-blue-50 to-slate-100">
          {/* Background Pattern - Full Width */}
          <div className="absolute inset-0">
            <svg className="h-full w-full" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="1"></path>
                </pattern>
                <pattern id="circles" width="100" height="100" patternUnits="userSpaceOnUse">
                  <circle cx="50" cy="50" r="2" fill="rgba(59, 130, 246, 0.1)"></circle>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)"></rect>
              <rect width="100%" height="100%" fill="url(#circles)"></rect>
            </svg>
          </div>

          {/* Content Container */}
          <div className="container relative mx-auto px-4 py-[60px] sm:px-6 lg:px-8 lg:py-[90px]">
            <div className="flex flex-col items-center">
              <div className="max-w-3xl text-center">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                  EurekaPad Changelog
                </h1>
                <p className="mt-4 text-base sm:text-lg text-slate-600">
                  Track our journey as we build the ultimate note-taking tool for STEM researchers and students.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Container for changelog entries - Wider Layout */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-7xl">
          {posts.map(post => (
            <div key={post.id} className="relative border-b border-slate-200 py-[40px] sm:py-[50px] lg:py-[90px] group">
              <div className="grid lg:grid-cols-[200px_1fr_100px] gap-6">
                {/* Date on the left */}
                <div className="mb-6 lg:mb-0">
                  <div className="lg:sticky lg:top-24">
                    <div className="flex flex-col items-start">
                      <div className="text-sm font-medium text-blue-600">{formatDate(post.dateTime)}</div>
                      <div className="mt-2 h-1 w-12 rounded-full bg-blue-600 opacity-80"></div>
                    </div>
                  </div>
                </div>

                {/* Content in the middle - Now wider */}
                <div className="transform transition-all duration-300 ease-in-out max-w-4xl">
                  <div className="mb-6 flex flex-wrap gap-2">
                    {post.tags.map((tag: Tag, index: number) => (
                      <span
                        key={index}
                        className={`inline-flex items-center rounded-full ${tag.color} px-3 py-1 text-xs font-medium ${tag.textColor} shadow-sm`}
                      >
                        <span className={`mr-1.5 h-2 w-2 rounded-full ${tag.dotColor}`}></span>
                        {tag.name}
                      </span>
                    ))}
                  </div>

                  <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                    {post.title}
                  </h2>

                  <div className="prose prose-slate sm:prose-base prose-headings:font-semibold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl max-w-none text-sm sm:text-base">
                    {post.content()}
                  </div>

                  {/* Feature Media - Image or Video */}
                  {post.featureMedia && (
                    <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 shadow-md bg-white transition-all hover:shadow-lg">
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
                            className="w-full object-cover rounded-md"
                            loading="lazy"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Read more link */}
                  <div className="mt-6 flex justify-end">
                    <a
                      href="#"
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 group"
                    >
                      Read full release notes
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </div>

                {/* Right column (smaller for balance) */}
                <div></div>
              </div>
            </div>
          ))}

          {/* Modern Load more button */}
          <div className="py-16 flex justify-center">
            <button className="group inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <span>Load more updates</span>
              <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 ease-in-out group-hover:translate-y-1" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-200 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <Beaker className="h-6 w-6 text-blue-400" />
                <span className="ml-2 text-lg font-bold text-white">EurekaPad</span>
              </div>
              <p className="mt-4 text-sm text-slate-400">
                The ultimate note-taking platform for STEM students and professionals.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Product</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Changelog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-700 pt-8">
            <p className="text-sm text-slate-400">&copy; 2025 EurekaPad. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
