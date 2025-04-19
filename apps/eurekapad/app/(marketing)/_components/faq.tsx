'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const faqs = [
  {
    question: 'Do you support handwriting?',
    answer:
      "Not at the moment, but we're actively developing a feature that lets you upload handwritten notes and convert them into editable digital content.",
  },
  {
    question: 'Is it free to use?',
    answer: 'We offer a free tier with basic features. Premium features are available with our paid plans.',
  },
  {
    question: 'Is there a mobile version of the app?',
    answer:
      "The app isn't officially supported on mobile yet, so you might encounter bugs or layout issues. A mobile-friendly version is planned for future updates.",
  },
  {
    question: 'Does the app work offline?',
    answer:
      'At this time, an internet connection is required. However, offline access is a highly requested feature and is on our development roadmap.',
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
            <a href="mailto:support@eurekapad.app" className="text-blue-600 hover:text-blue-700 underline">
              support@eurekapad.app
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
