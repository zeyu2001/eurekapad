'use client'

// const testimonials = [
//   [
//     {
//       content:
//         'EurekaPad is the perfect middle ground between Google Docs and LaTeX. I never knew how much I needed this until I started using it.',
//       author: {
//         name: 'Kai Xuan Lee',
//         role: 'Computer Science at NUS',
//         image: nusImage,
//       },
//     },
//   ],
//   [
//     {
//       content:
//         "The UI is so amazing. I love the flexibility and diverse features that EurekaPad offers. It's a game changer!",
//       author: {
//         name: 'Gracie Zhou',
//         role: 'Computer Science at Cambridge',
//         image: cambridgeImage,
//       },
//     },
//   ],
//   [
//     {
//       content:
//         'As a big Notion fan, this is truly the best of both worlds: super clean UI with academic friendly features like PDF to WYSWYG to LaTeX to PDF!',
//       author: {
//         name: 'Chad Spensky',
//         role: 'CEO @ Allthenticate',
//         image: allthenticateImage,
//       },
//     },
//   ],
// ]
// function QuoteIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
//   return (
//     <svg aria-hidden="true" width={105} height={78} {...props}>
//       <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z" />
//     </svg>
//   )
// }
// export function Testimonials() {
//   return (
//     <section id="testimonials" aria-label="What our customers are saying" className="py-20 sm:py-32">
//       <div className="container">
//         <div className="mx-auto max-w-2xl md:text-center">
//           <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
//             Why students love EurekaPad
//           </h2>
//           <p className="mt-4 text-lg tracking-tight text-slate-700 dark:text-slate-300">
//             By students, for students. EurekaPad is the app that speaks your language.
//           </p>
//         </div>
//         <ul
//           role="list"
//           className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
//         >
//           {testimonials.map((column, columnIndex) => (
//             <li key={columnIndex}>
//               <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
//                 {column.map((testimonial, testimonialIndex) => (
//                   <li key={testimonialIndex}>
//                     <figure className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10 dark:bg-slate-800 dark:shadow-blue-500/20">
//                       <QuoteIcon className="absolute left-6 top-6 fill-slate-100 dark:fill-slate-900" />
//                       <blockquote className="relative">
//                         <p className="text-lg tracking-tight text-slate-900 dark:text-slate-100">
//                           {testimonial.content}
//                         </p>
//                       </blockquote>
//                       <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
//                         <div>
//                           <div className="font-display text-base text-slate-900 dark:text-slate-100">
//                             {testimonial.author.name}
//                           </div>
//                           <div className="mt-1 text-sm text-slate-500 dark:text-slate-300">
//                             {testimonial.author.role}
//                           </div>
//                         </div>
//                         <div className="overflow-hidden">
//                           <Image
//                             className="w-14 object-cover"
//                             src={testimonial.author.image}
//                             alt=""
//                             width={56}
//                             height={56}
//                           />
//                         </div>
//                       </figcaption>
//                     </figure>
//                   </li>
//                 ))}
//               </ul>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </section>
//   )
// }
import Image from 'next/image'

import allthenticateImage from '@/images/allthenticate.png'
import cambridgeImage from '@/images/cambridge_square.png'
import nusImage from '@/images/nus_crest.png'

import { useScrollAnimation } from '../utils/useScrollAnimation'

const testimonials = [
  {
    quote:
      'EurekaPad is the perfect middle ground between Google Docs and LaTeX. I never knew how much I needed this until I started using it.',
    author: 'Kai Xuan Lee',
    role: 'Computer Science @ NUS',
    logo: nusImage,
  },
  {
    quote:
      "The UI is so amazing, I love the flexibility and diverse features that EurekaPad offers. It's a game changer!",
    author: 'Gracie Zhou',
    role: 'Computer Science @ Cambridge',
    logo: cambridgeImage,
  },
  {
    quote:
      'As a big Notion fan, this is truly the best of both worlds: super clean UI with academic friendly features like PDF to WYSWYG to LaTeX to PDF!',
    author: 'Chad Spensky',
    role: 'CEO @ Allthenticate',
    logo: allthenticateImage,
  },
]

export default function Testimonials() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section
      ref={ref}
      className={`py-24 px-4 sm:px-6 lg:px-8 transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why students love EurekaPad</h2>
          <p className="text-xl text-gray-600">
            By students, for students. EurekaPad is the app that speaks your language.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`flex flex-col p-8 rounded-2xl bg-gray-50 transition-all duration-1000 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <blockquote className="flex-1 text-lg mb-8">{testimonial.quote}</blockquote>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
                <Image
                  src={testimonial.logo || '/placeholder.svg'}
                  alt={`${testimonial.author}'s institution logo`}
                  width={48}
                  height={48}
                  className="rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
