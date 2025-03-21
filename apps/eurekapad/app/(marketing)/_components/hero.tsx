'use client'
import {
  Architects_Daughter,
  Caveat,
  Comic_Neue,
  Indie_Flower,
  Kalam,
  Neucha,
  Patrick_Hand,
  Permanent_Marker,
  Shadows_Into_Light,
  Source_Code_Pro,
} from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'
import MathBackground from '@/images/math-background.svg'

const caveat = Caveat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
})
const architects_daughter = Architects_Daughter({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-architects-daughter',
})

const comic_neue = Comic_Neue({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-comic-neue',
})

const indie_flower = Indie_Flower({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-indie-flower',
})

const kalam = Kalam({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-kalam',
})

const neucha = Neucha({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-neucha',
})

const patrick_hand = Patrick_Hand({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-patrick-hand',
})

const permanent_marker = Permanent_Marker({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-permanent-marker',
})

const shadows_into_light = Shadows_Into_Light({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-shadows-into-light',
})

const source_code_pro = Source_Code_Pro({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-source-code-pro',
})

const _ = [
  caveat,
  architects_daughter,
  comic_neue,
  indie_flower,
  kalam,
  neucha,
  patrick_hand,
  permanent_marker,
  shadows_into_light,
  source_code_pro,
]

const Hero = () => {
  return (
    // <div className="relative w-full overflow-hidden border-b border-slate-200 bg-gradient-to-br from-blue-50 to-slate-100">
    //   {/* Background Pattern with Fade-out Effect */}
    //   <div className="absolute inset-0 overflow-hidden">
    //     <div className="relative h-full w-full">
    //       <svg className="h-full w-full" viewBox="0 0 1750 800" xmlns="http://www.w3.org/2000/svg">
    //         <defs>
    //           {/* Larger grid pattern */}
    //           <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
    //             <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1.5"></path>
    //           </pattern>
    //           {/* Gradient that fades out on both sides but with wider visible area */}
    //           <linearGradient id="fade-out" x1="0%" y1="0%" x2="100%" y2="0%">
    //             <stop offset="0%" stopColor="white" stopOpacity="0" />
    //             <stop offset="5%" stopColor="white" stopOpacity="1" />
    //             <stop offset="95%" stopColor="white" stopOpacity="1" />
    //             <stop offset="100%" stopColor="white" stopOpacity="0" />
    //           </linearGradient>
    //           <mask id="fade-mask">
    //             <rect width="100%" height="100%" fill="url(#fade-out)" />
    //           </mask>
    //         </defs>
    //         <g mask="url(#fade-mask)">
    //           <rect width="100%" height="100%" fill="url(#grid)" />
    //         </g>
    //       </svg>
    //     </div>
    //   </div>

    //   {/* Content Container */}
    //   <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
    //     <div className="flex flex-col items-center text-center">
    //       <div className="max-w-3xl">
    //         <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
    //           The Ultimate Note-Taking Platform for STEM
    //         </h1>
    //         <p className="mt-6 text-xl text-slate-600">
    //           Capture complex ideas, equations, and research data with powerful tools designed specifically for
    //           scientists, engineers, mathematicians, and students.
    //         </p>
    //         <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
    //           <AuthLoading>
    //             <button
    //               disabled
    //               className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-x-2"
    //             >
    //               <Spinner size="sm" />
    //               Get Started for Free
    //             </button>
    //           </AuthLoading>
    //           <Unauthenticated>
    //             <SignUpButton mode="modal">
    //               <button className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 transition-colors">
    //                 Get Started for Free
    //               </button>
    //             </SignUpButton>
    //           </Unauthenticated>
    //           <Authenticated>
    //             <Link
    //               href="/documents"
    //               className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
    //             >
    //               Open EurekaPad
    //             </Link>
    //           </Authenticated>
    //           <Link
    //             href="/changelog"
    //             className="rounded-md border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
    //           >
    //             See What&apos;s New
    //           </Link>
    //         </div>
    //       </div>

    //       {/* Hero Image */}
    //       <div className="mt-16 max-w-5xl w-full">
    //         <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
    //           <Image
    //             src="/hero-image.webp"
    //             alt="EurekaPad app interface showing note-taking with equations"
    //             width={1200}
    //             height={630}
    //             className="w-full"
    //             priority
    //           />

    //           {/* Gradient Overlay */}
    //           <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <section className="relative w-full overflow-hidden border-b border-neutral-200 bg-gradient-to-br from-blue-50 to-neutral-100">
      {/* Mathematical Background SVG */}
      <div className="absolute inset-0 w-full h-full opacity-30">
        <MathBackground aria-hidden="true" className="w-full h-full" preserveAspectRatio="xMidYMid slice" />
      </div>

      {/* Content Container */}
      <div className="container relative mx-auto px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="flex flex-col items-center text-center">
          <div className="max-w-3xl content-spacing">
            <h1 className="text-5xl font-display font-medium tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl ">
              Where{' '}
              <span className="relative whitespace-nowrap text-blue-600">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 418 42"
                  className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70 dark:fill-blue-500/70"
                  preserveAspectRatio="none"
                >
                  <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                </svg>
                <span className="relative">better, faster</span>
              </span>{' '}
              work happens.
            </h1>

            <p className="mt-6 text-xl leading-relaxed text-neutral-600">
              Capture complex ideas, equations, and research data with powerful tools designed specifically for
              scientists, engineers, mathematicians, and students.
            </p>

            <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
              <Button
                asChild
                size="lg"
                className="rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                <Link href="/signup">Get Started for Free</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-md border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <Link href="/changelog">See What&apos;s New</Link>
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 max-w-5xl w-full">
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-neutral-200 bg-white">
              <Image
                src="/hero-image.webp"
                alt="EurekaPad app interface showing note-taking with equations"
                width={1200}
                height={630}
                className="w-full"
                priority
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
