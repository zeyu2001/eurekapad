import Link from 'next/link'

export default function CTA() {
  return (
    // <section className="relative mt-32">
    //   {/* Curved top edge - reduced radius */}
    //   <div className="absolute top-0 left-0 w-full overflow-hidden -translate-y-full">
    //     <div className="relative h-32">
    //       <div className="absolute bottom-0 w-full h-full bg-blue-600 rounded-t-[24px]" />
    //     </div>
    //   </div>

    //   {/* Content */}
    //   <div className="bg-blue-600 py-24 px-4 sm:px-6 lg:px-8">
    //     <div className="container mx-auto max-w-4xl text-center">
    //       <h2 className="text-4xl sm:text-5xl font-bold text-white mb-12">Ready to transform your note-taking?</h2>
    //       <div className="flex flex-col items-center gap-4">
    //         <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
    //           Get started for free
    //         </Button>
    //         <p className="text-sm text-gray-400">No credit card required • Free forever plan available</p>
    //       </div>
    //     </div>
    //   </div>
    // </section>

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
          <Link
            href="/note/note"
            className="rounded-md bg-white px-8 py-3 text-base font-medium text-blue-600 shadow-sm hover:bg-blue-50 transition-colors"
          >
            Get Started for Free
          </Link>
          <p className="text-sm text-blue-200">No credit card required • Free forever plan available</p>
        </div>
      </div>
    </section>
  )
}
