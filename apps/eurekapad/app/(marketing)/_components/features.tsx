'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Brain, Edit3, FileText, Sparkles } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

export default function Features() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-base/7 font-semibold text-blue-600">Capture Knowledge</h2>
        <p className="mt-2 max-w-2xl text-pretty text-4xl font-medium tracking-tight text-gray-950 sm:text-5xl">
          The ultimate note-taking app for STEM professionals.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
          {/* From Notes → LaTeX → PDF */}
          <div
            className="relative lg:col-span-3"
            onMouseEnter={() => setHovered('latex')}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] lg:rounded-tl-[calc(2rem+1px)]">
              <div className="relative h-80 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                    <motion.div
                      className="relative"
                      animate={{
                        scale: hovered === 'latex' ? 1.05 : 1,
                        y: hovered === 'latex' ? -10 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Handwritten notes mockup */}
                      <div className="absolute -left-64 top-0 h-64 w-48 rotate-6 rounded-lg bg-white p-4 shadow-lg">
                        <div className="h-4 w-32 rounded bg-gray-200"></div>
                        <div className="mt-3 h-3 w-full rounded bg-gray-200"></div>
                        <div className="mt-2 h-3 w-full rounded bg-gray-200"></div>
                        <div className="mt-2 h-3 w-3/4 rounded bg-gray-200"></div>
                        <div className="mt-6 h-16 w-full rounded bg-gray-200"></div>
                      </div>

                      {/* LaTeX document mockup */}
                      <div className="absolute -left-8 top-10 h-72 w-56 rounded-lg bg-white p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                          <div className="h-6 w-24 rounded bg-emerald-100"></div>
                          <div className="h-6 w-6 rounded-full bg-emerald-100"></div>
                        </div>
                        <div className="mt-4 h-4 w-full rounded bg-gray-100"></div>
                        <div className="mt-2 h-4 w-full rounded bg-gray-100"></div>
                        <div className="mt-2 h-4 w-3/4 rounded bg-gray-100"></div>
                        <div className="mt-6 flex justify-center">
                          <div className="h-12 w-32 rounded bg-emerald-100 p-2">
                            <div className="flex h-full items-center justify-center text-lg font-medium text-emerald-800">
                              ∫<sub>0</sub>
                              <sup>∞</sup> e<sup>-x</sup> dx
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 h-4 w-full rounded bg-gray-100"></div>
                        <div className="mt-2 h-4 w-full rounded bg-gray-100"></div>
                      </div>

                      {/* PDF document mockup */}
                      <div className="absolute left-56 top-20 h-64 w-48 -rotate-6 rounded-lg bg-white p-4 shadow-lg">
                        <div className="h-6 w-full rounded bg-emerald-600"></div>
                        <div className="mt-4 h-3 w-full rounded bg-gray-300"></div>
                        <div className="mt-2 h-3 w-full rounded bg-gray-300"></div>
                        <div className="mt-2 h-3 w-3/4 rounded bg-gray-300"></div>
                        <div className="mt-6 flex justify-center">
                          <div className="h-12 w-32 rounded bg-emerald-100 p-2">
                            <div className="flex h-full items-center justify-center text-lg font-medium text-emerald-800">
                              ∫<sub>0</sub>
                              <sup>∞</sup> e<sup>-x</sup> dx
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 h-3 w-full rounded bg-gray-300"></div>
                        <div className="mt-2 h-3 w-full rounded bg-gray-300"></div>
                      </div>

                      {/* Arrows connecting the documents */}
                      <div className="absolute left-0 top-32 h-2 w-32 bg-emerald-400"></div>
                      <div className="absolute left-64 top-40 h-2 w-32 bg-emerald-400"></div>
                    </motion.div>
                  </div>
                </div>
              </div>
              <div className="p-10 pt-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  <h3 className="text-sm/4 font-semibold text-emerald-600">Document Conversion</h3>
                </div>
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-gray-950">From Notes → LaTeX → PDF</p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600">
                  Transform your handwritten notes into beautifully formatted LaTeX documents and professional PDFs
                  without writing a single line of code. Our AI-powered conversion maintains all equations and diagrams.
                </p>
                <Button variant="link" className="mt-4 px-0 text-emerald-600">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]" />
          </div>

          {/* Collaborative Editing */}
          <div
            className="relative lg:col-span-3"
            onMouseEnter={() => setHovered('collab')}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-tr-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-tr-[calc(2rem+1px)]">
              <div className="relative h-80 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      scale: hovered === 'collab' ? 1.05 : 1,
                      y: hovered === 'collab' ? -10 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Document mockup with multiple cursors */}
                    <div className="relative h-64 w-[500px] rounded-lg bg-white p-6 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="h-6 w-32 rounded bg-blue-100"></div>
                        <div className="flex gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
                            A
                          </div>
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                            B
                          </div>
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-white">
                            C
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 h-4 w-full rounded bg-gray-100"></div>
                      <div className="mt-2 h-4 w-full rounded bg-gray-100"></div>

                      {/* User A cursor and edit */}
                      <div className="relative mt-6">
                        <div className="h-4 w-3/4 rounded bg-gray-100"></div>
                        <div className="absolute -right-2 top-0 h-5 w-1 bg-blue-500"></div>
                        <div className="absolute -right-6 -top-6 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                          A
                        </div>
                      </div>

                      {/* User B cursor and comment */}
                      <div className="relative mt-6">
                        <div className="h-4 w-full rounded bg-gray-100"></div>
                        <div className="absolute left-1/2 top-0 h-5 w-1 bg-green-500"></div>
                        <div className="absolute left-1/2 -top-10 w-48 rounded-lg bg-green-100 p-2 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-white text-[10px]">
                              B
                            </div>
                            <span className="font-medium text-green-800">Should we add a reference here?</span>
                          </div>
                        </div>
                      </div>

                      {/* User C active typing */}
                      <div className="relative mt-6">
                        <div className="h-4 w-1/2 rounded bg-gray-100"></div>
                        <div className="absolute -right-2 top-0 h-5 w-1 animate-pulse bg-purple-500"></div>
                        <div className="absolute -right-6 -top-6 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-xs text-white">
                          C
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
              <div className="p-10 pt-6">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm/4 font-semibold text-blue-600">Real-time Collaboration</h3>
                </div>
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-gray-950">Collaborative Editing</p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600">
                  Work together in real-time with your research team. See who&apos;s editing what, track changes, leave
                  comments, and resolve discussions—all in a seamless collaborative environment.
                </p>
                <Button variant="link" className="mt-4 px-0 text-blue-600">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-tr-[2rem]" />
          </div>

          {/* Live Transcription */}
          <div
            className="relative lg:col-span-3"
            onMouseEnter={() => setHovered('transcription')}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-bl-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-bl-[calc(2rem+1px)]">
              <div className="relative h-80 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50">
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      scale: hovered === 'transcription' ? 1.05 : 1,
                      y: hovered === 'transcription' ? -10 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Audio waveform and transcription */}
                    <div className="relative h-64 w-[500px] rounded-lg bg-white p-6 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-purple-100 p-1.5">
                            <div className="h-full w-full rounded-full bg-purple-600"></div>
                          </div>
                          <div className="h-5 w-32 rounded bg-purple-100"></div>
                        </div>
                        <div className="text-sm font-medium text-purple-600">12:34 / 45:00</div>
                      </div>

                      {/* Audio waveform */}
                      <div className="mt-6 flex h-16 items-center gap-1">
                        {Array.from({ length: 40 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-${Math.floor(Math.random() * 16)} w-1.5 rounded-full ${
                              i < 25 ? 'bg-purple-600' : 'bg-gray-300'
                            }`}
                            style={{
                              height: `${Math.floor(Math.random() * 64)}px`,
                              opacity: i < 25 ? 1 : 0.5,
                            }}
                          ></div>
                        ))}
                      </div>

                      {/* Live transcription */}
                      <div className="mt-6">
                        <div className="text-xs font-medium text-gray-500">LIVE TRANSCRIPTION</div>
                        <div className="mt-2 text-sm text-gray-800">
                          &quot;...and when we look at the second derivative of this function, we can see that the
                          critical points occur at x equals plus or minus 3, which gives us the local maximum and
                          minimum values...&quot;
                        </div>
                      </div>

                      {/* AI Summary */}
                      <div className="mt-4 rounded-lg bg-purple-50 p-3">
                        <div className="flex items-center gap-1 text-xs font-medium text-purple-800">
                          <Sparkles className="h-3 w-3" /> AI SUMMARY
                        </div>
                        <div className="mt-1 text-xs text-purple-900">
                          The speaker is analyzing the critical points of a function by examining its second derivative,
                          identifying local extrema at x = &plusmn;3.
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
              <div className="p-10 pt-6">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <h3 className="text-sm/4 font-semibold text-purple-600">AI-Powered Audio</h3>
                </div>
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-gray-950">Live Transcription & Summary</p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600">
                  Record lectures or meetings and get instant transcriptions with AI-powered summaries that highlight
                  key concepts, formulas, and action items. Never miss important information again.
                </p>
                <Button variant="link" className="mt-4 px-0 text-purple-600">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-bl-[2rem]" />
          </div>

          {/* Seamless Math Input */}
          <div
            className="relative lg:col-span-3"
            onMouseEnter={() => setHovered('math')}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-br-[calc(2rem+1px)]">
              <div className="relative h-80 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-orange-50">
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      scale: hovered === 'math' ? 1.05 : 1,
                      y: hovered === 'math' ? -10 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Math input interface */}
                    <div className="relative h-64 w-[500px] rounded-lg bg-white p-6 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="h-6 w-32 rounded bg-amber-100"></div>
                        <div className="flex gap-2">
                          <div className="rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                            Type
                          </div>
                          <div className="rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                            Draw
                          </div>
                          <div className="rounded-md bg-amber-600 px-2 py-1 text-xs font-medium text-white">Voice</div>
                        </div>
                      </div>

                      {/* Voice input visualization */}
                      <div className="mt-6 rounded-lg bg-amber-50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-amber-800">Voice Input</div>
                          <div className="h-4 w-4 animate-pulse rounded-full bg-amber-600"></div>
                        </div>
                        <div className="mt-2 text-sm text-amber-900">
                          &quot;the integral of x squared plus 2x from 0 to 1&quot;
                        </div>
                      </div>

                      {/* Processing animation */}
                      <div className="mt-4 flex items-center gap-2">
                        <div className="h-0.5 w-full rounded-full bg-gray-200">
                          <div className="h-full w-3/4 rounded-full bg-amber-600"></div>
                        </div>
                        <div className="text-xs text-gray-500">Processing...</div>
                      </div>

                      {/* Result */}
                      <div className="mt-6 flex justify-center">
                        <div className="rounded-lg bg-white p-4 shadow-md">
                          <div className="text-center text-2xl">
                            ∫<sub>0</sub>
                            <sup>1</sup> (x<sup>2</sup> + 2x) dx
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
              <div className="p-10 pt-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <h3 className="text-sm/4 font-semibold text-amber-600">Intuitive Input</h3>
                </div>
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-gray-950">Seamless Math Input</p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600">
                  Write complex equations naturally with our intuitive math editor. Draw symbols, use voice input, or
                  type in plain English—no LaTeX knowledge required. Perfect for complex formulas and equations.
                </p>
                <Button variant="link" className="mt-4 px-0 text-amber-600">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]" />
          </div>
        </div>
      </div>
    </div>
  )
}
