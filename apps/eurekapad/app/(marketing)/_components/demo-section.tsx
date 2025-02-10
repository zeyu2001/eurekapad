'use client'

import { Pause, Play } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function DemoSection() {
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">See EurekaPad in Action</h2>
          <p className="text-xl text-gray-600 mb-8">
            Experience the power of seamless note-taking and research organization.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <Tabs defaultValue="math" className="w-full">
            <div className="px-4 py-3 bg-gray-100 border-b">
              <TabsList>
                <TabsTrigger value="math">Math</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="graph">Graph</TabsTrigger>
                <TabsTrigger value="collaboration">Real-time Collaboration</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="math" className="mt-0">
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <Button variant="outline" size="icon" onClick={togglePlay} className="w-16 h-16 rounded-full">
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                  </Button>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Write complex mathematical equations with LaTeX support and real-time rendering.
                </p>
              </TabsContent>

              <TabsContent value="code" className="mt-0">
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">Code Demo</div>
                <p className="mt-4 text-sm text-gray-600">
                  Write and format code with syntax highlighting for multiple programming languages.
                </p>
              </TabsContent>

              <TabsContent value="graph" className="mt-0">
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">Graph Demo</div>
                <p className="mt-4 text-sm text-gray-600">
                  Create beautiful graphs and diagrams directly in your notes.
                </p>
              </TabsContent>

              <TabsContent value="collaboration" className="mt-0">
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  Real-time Collaboration Demo
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Work together with your peers in real-time, perfect for group projects and research teams.
                </p>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" variant="secondary">
            Try EurekaPad for Free
          </Button>
        </div>
      </div>
    </section>
  )
}
