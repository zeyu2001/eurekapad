'use client'

import dynamic from 'next/dynamic'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import codeBlockDemo from './codeBlockDemo.json'
import graphBlockDemo from './graphBlockDemo.json'
import mathBlockDemo from './mathBlockDemo.json'

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

const features = [
  {
    title: 'Math',
    description: 'Write complex mathematical equations with LaTeX support and real-time rendering.',
    initialContent: JSON.stringify(mathBlockDemo),
  },
  {
    title: 'Code',
    description: 'Write and format code with syntax highlighting for multiple programming languages.',
    initialContent: JSON.stringify(codeBlockDemo),
  },
  {
    title: 'Graph',
    description: 'Create beautiful graphs and diagrams directly in your notes.',
    initialContent: JSON.stringify(graphBlockDemo),
  },
  {
    title: 'Real-time Collaboration',
    description: 'Work together with your peers in real-time, perfect for group projects and research teams.',
    initialContent: JSON.stringify(mathBlockDemo), // Using math demo as placeholder for collaboration
  },
]

export default function DemoSection() {
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
          <Tabs defaultValue="Math" className="w-full">
            <div className="px-4 py-3 bg-gray-100 border-b">
              <TabsList>
                {features.map(feature => (
                  <TabsTrigger key={feature.title} value={feature.title}>
                    {feature.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="p-6">
              {features.map(feature => (
                <TabsContent key={feature.title} value={feature.title} className="mt-0 overflow-y-auto">
                  <div className="aspect-video bg-white dark:bg-[#1F1F1F] rounded-lg">
                    <Editor initialContent={feature.initialContent} onChange={() => {}} editable={true} />
                  </div>
                  <p className="mt-4 text-sm text-gray-600">{feature.description}</p>
                </TabsContent>
              ))}
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
