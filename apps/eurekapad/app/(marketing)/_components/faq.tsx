'use client'

import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    question: 'Is there a mobile version?',
    answer: 'Currently, EurekaPad is optimized for desktop use, with mobile support coming soon.',
  },
  {
    question: 'Is it free to use?',
    answer: 'We offer a free tier with basic features. Premium features are available with our paid plans.',
  },
  {
    question: 'Is the chrome extension required?',
    answer: 'No, the Chrome extension is optional but recommended for enhanced functionality.',
  },
  {
    question: 'Do I need my team/company to use this app?',
    answer: 'No, EurekaLabs works great for individual users, but also offers powerful team collaboration features.',
  },
  {
    question: 'Can I sync EurekaLabs with other apps?',
    answer: 'Yes, we support integration with popular tools like Notion, Zotero, and other research platforms.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">FAQ</h2>
          <p className="text-gray-600">
            More questions? Reach out at{' '}
            <a href="mailto:hey@eurekalabs.dev" className="underline hover:text-gray-900">
              hey@eurekalabs.dev
            </a>
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-6 flex justify-between items-center text-left"
              >
                <span className="text-lg">{faq.question}</span>
                {openIndex === index ? (
                  <Minus className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <Plus className="h-5 w-5 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && <div className="pb-6 text-gray-600">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
