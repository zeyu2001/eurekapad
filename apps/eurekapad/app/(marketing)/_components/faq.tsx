'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

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
  return (
    <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-6 text-neutral-900">Frequently Asked Questions</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            More questions? Reach out at{' '}
            <a href="mailto:hey@eurekalabs.dev" className="text-blue-600 hover:text-blue-700 underline">
              hey@eurekalabs.dev
            </a>
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-6">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-neutral-200 rounded-lg overflow-hidden shadow-sm"
              >
                <AccordionTrigger className="px-6 py-4 flex justify-between items-center text-left text-lg font-medium text-neutral-900 hover:bg-neutral-50">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2 text-neutral-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
