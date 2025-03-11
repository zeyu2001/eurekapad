'use client'

import { SignUpButton } from '@clerk/nextjs'
import { Authenticated, Unauthenticated } from 'convex/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState } from 'react'

import codeBlockDemo from './codeBlockDemo.json'
import graphBlockDemo from './graphBlockDemo.json'
import mathBlockDemo from './mathBlockDemo.json'

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

const features = [
  {
    title: 'Math',
    id: 'math',
    description: 'Write complex mathematical equations with LaTeX support and real-time rendering.',
    initialContent: JSON.stringify(mathBlockDemo),
  },
  {
    title: 'Code',
    id: 'code',
    description: 'Write and format code with syntax highlighting for multiple programming languages.',
    initialContent: JSON.stringify(codeBlockDemo),
  },
  {
    title: 'Graph',
    id: 'graph',
    description: 'Create beautiful graphs and diagrams directly in your notes.',
    initialContent: JSON.stringify(graphBlockDemo),
  },
  {
    title: 'Real-time Collaboration',
    id: 'collaboration',
    description: 'Work together with your peers in real-time, perfect for group projects and research teams.',
    initialContent: JSON.stringify(mathBlockDemo), // Using math demo as placeholder for collaboration
  },
]

export default function DemoSection() {
  const [activeTab, setActiveTab] = useState('math')

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">See EurekaPad in Action</h2>
          <p className="mt-4 text-xl text-slate-600">
            Experience the power of seamless note-taking and research organization.
          </p>
        </div>

        <div className="mt-12 max-w-5xl mx-auto">
          {/* Add state for active tab */}
          {(() => {
            return (
              <>
                <div className="flex gap-4 justify-center mb-8">
                  <button
                    onClick={() => setActiveTab('math')}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      activeTab === 'math'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Math
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      activeTab === 'code'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Code
                  </button>
                  <button
                    onClick={() => setActiveTab('graph')}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      activeTab === 'graph'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Graph
                  </button>
                  <button
                    onClick={() => setActiveTab('collaboration')}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      activeTab === 'collaboration'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Real-time Collaboration
                  </button>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-xl bg-white">
                  <div className="aspect-video bg-white dark:bg-[#1F1F1F] p-4">
                    {activeTab === 'math' && (
                      <Editor
                        initialContent={features.find(f => f.id === 'math')?.initialContent}
                        onChange={() => {}}
                        editable={true}
                      />
                    )}
                    {activeTab === 'code' && (
                      <Editor
                        initialContent={features.find(f => f.id === 'code')?.initialContent}
                        onChange={() => {}}
                        editable={true}
                      />
                    )}
                    {activeTab === 'graph' && (
                      <Editor
                        initialContent={features.find(f => f.id === 'graph')?.initialContent}
                        onChange={() => {}}
                        editable={true}
                      />
                    )}
                    {activeTab === 'collaboration' && (
                      <Editor
                        initialContent={features.find(f => f.id === 'collaboration')?.initialContent}
                        onChange={() => {}}
                        editable={true}
                      />
                    )}
                  </div>
                  <div className="p-4 border-t border-slate-200">
                    <p className="text-sm text-slate-600">{features.find(f => f.id === activeTab)?.description}</p>
                  </div>
                </div>
              </>
            )
          })()}

          <div className="mt-12 text-center">
            <Unauthenticated>
              <SignUpButton mode="modal">
                <button className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 transition-colors">
                  Try EurekaPad for Free
                </button>
              </SignUpButton>
            </Unauthenticated>
            <Authenticated>
              <Link
                href="/documents"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 transition-colors"
              >
                Try EurekaPad for Free
              </Link>
            </Authenticated>
          </div>
        </div>
      </div>
    </section>
  )
}
