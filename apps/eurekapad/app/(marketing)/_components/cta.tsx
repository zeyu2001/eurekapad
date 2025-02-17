import { Button } from '@/components/ui/button'

export default function CTA() {
  return (
    <section className="relative mt-32">
      {/* Curved top edge - reduced radius */}
      <div className="absolute top-0 left-0 w-full overflow-hidden -translate-y-full">
        <div className="relative h-32">
          <div className="absolute bottom-0 w-full h-full bg-blue-600 rounded-t-[24px]" />
        </div>
      </div>

      {/* Content */}
      <div className="bg-blue-600 py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-12">Ready to transform your note-taking?</h2>
          <div className="flex flex-col items-center gap-4">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              Get started for free
            </Button>
            <p className="text-sm text-gray-400">No credit card required • Free forever plan available</p>
          </div>
        </div>
      </div>
    </section>
  )
}
