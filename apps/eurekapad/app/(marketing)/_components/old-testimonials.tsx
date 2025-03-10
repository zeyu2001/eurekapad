'use client'

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
