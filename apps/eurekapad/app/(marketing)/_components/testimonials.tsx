import Image from 'next/image'

const featuredTestimonial = {
  body: "The UI is so amazing, I love the flexibility and diverse features that EurekaPad offers. It's a game changer!",
  author: {
    name: 'Gracie Zhou',
    role: 'Computer Science @ Cambridge',
    imageUrl: '/placeholder.svg?height=400&width=400',
    logoUrl: '/placeholder.svg?height=100&width=100',
  },
}

const testimonials = [
  [
    [
      {
        body: 'EurekaPad is the perfect middle ground between Google Docs and LaTeX. I never knew how much I needed this until I started using it.',
        author: {
          name: 'Kai Xuan Lee',
          role: 'Computer Science @ NUS',
          imageUrl: '/placeholder.svg?height=400&width=400',
          logoUrl: '/placeholder.svg?height=100&width=100',
        },
      },
      {
        body: 'The math input feature alone saved me hours of work. Being able to just speak equations and have them formatted perfectly is incredible.',
        author: {
          name: 'Sophia Rodriguez',
          role: 'Physics PhD @ MIT',
          imageUrl: '/placeholder.svg?height=400&width=400',
          logoUrl: '/placeholder.svg?height=100&width=100',
        },
      },
    ],
    [
      {
        body: 'I use EurekaPad for all my research notes now. The ability to collaborate with my lab partners in real-time has streamlined our entire workflow.',
        author: {
          name: 'James Wilson',
          role: 'Biochemistry @ Stanford',
          imageUrl: '/placeholder.svg?height=400&width=400',
          logoUrl: '/placeholder.svg?height=100&width=100',
        },
      },
      {
        body: 'As someone who struggles with LaTeX syntax, EurekaPad has been a lifesaver for my mathematics coursework. I can focus on the content instead of formatting.',
        author: {
          name: 'Emma Chen',
          role: 'Mathematics @ ETH Zurich',
          imageUrl: '/placeholder.svg?height=400&width=400',
          logoUrl: '/placeholder.svg?height=100&width=100',
        },
      },
    ],
  ],
  [
    [
      {
        body: 'As a big Notion fan, this is truly the best of both worlds: super clean UI with academic friendly features like PDF to WYSWYG to LaTeX to PDF!',
        author: {
          name: 'Chad Spensky',
          role: 'CEO @ Allthenticate',
          imageUrl: '/placeholder.svg?height=400&width=400',
          logoUrl: '/placeholder.svg?height=100&width=100',
        },
      },
      {
        body: 'The live transcription feature has completely changed how I take notes during lectures. I can actually pay attention instead of frantically typing.',
        author: {
          name: 'Olivia Taylor',
          role: 'Engineering @ Georgia Tech',
          imageUrl: '/placeholder.svg?height=400&width=400',
          logoUrl: '/placeholder.svg?height=100&width=100',
        },
      },
    ],
    [
      {
        body: "I've tried every note-taking app out there, and EurekaPad is the only one that truly understands the needs of STEM students. It's become essential to my studies.",
        author: {
          name: 'David Park',
          role: 'Computer Engineering @ UC Berkeley',
          imageUrl: '/placeholder.svg?height=400&width=400',
          logoUrl: '/placeholder.svg?height=100&width=100',
        },
      },
      {
        body: 'The seamless integration between handwritten notes and digital formatting is brilliant. EurekaPad has completely transformed my research documentation process.',
        author: {
          name: 'Aisha Johnson',
          role: 'Neuroscience @ Johns Hopkins',
          imageUrl: '/placeholder.svg?height=400&width=400',
          logoUrl: '/placeholder.svg?height=100&width=100',
        },
      },
    ],
  ],
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Testimonials() {
  return (
    <div className="relative isolate bg-white pb-32 pt-24 sm:pt-32">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr from-blue-300 to-blue-600"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 flex transform-gpu overflow-hidden pt-32 opacity-25 blur-3xl sm:pt-40 xl:justify-end"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="ml-[-22rem] aspect-[1313/771] w-[82.0625rem] flex-none origin-top-right rotate-[30deg] bg-gradient-to-tr from-blue-300 to-blue-600 xl:ml-0 xl:mr-[calc(50%-12rem)]"
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-blue-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why students love EurekaPad
          </p>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            By students, for students. EurekaPad is the app that speaks your language.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
          <figure className="col-span-2 hidden sm:block rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 sm:col-span-2 xl:col-start-2 xl:row-end-1">
            <blockquote className="p-12 text-xl font-semibold leading-8 tracking-tight text-gray-900">
              <p>{`"${featuredTestimonial.body}"`}</p>
            </blockquote>
            <figcaption className="flex items-center gap-x-4 border-t border-gray-900/10 px-6 py-4">
              <Image
                src={featuredTestimonial.author.imageUrl || '/placeholder.svg'}
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 rounded-full bg-gray-50"
              />
              <div className="flex-auto">
                <div className="font-semibold">{featuredTestimonial.author.name}</div>
                <div className="text-gray-600">{featuredTestimonial.author.role}</div>
              </div>
              <Image
                src={featuredTestimonial.author.logoUrl || '/placeholder.svg'}
                alt=""
                width={40}
                height={40}
                className="h-10 w-auto"
              />
            </figcaption>
          </figure>
          {testimonials.map((columnGroup, columnGroupIdx) => (
            <div key={columnGroupIdx} className="space-y-8 xl:contents xl:space-y-0">
              {columnGroup.map((column, columnIdx) => (
                <div
                  key={columnIdx}
                  className={classNames(
                    (columnGroupIdx === 0 && columnIdx === 0) ||
                      (columnGroupIdx === testimonials.length - 1 && columnIdx === columnGroup.length - 1)
                      ? 'xl:row-span-2'
                      : 'xl:row-start-1',
                    'space-y-8',
                  )}
                >
                  {column.map(testimonial => (
                    <figure
                      key={testimonial.author.name}
                      className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5"
                    >
                      <blockquote className="text-gray-900">
                        <p>{`"${testimonial.body}"`}</p>
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-x-4">
                        <Image
                          src={testimonial.author.imageUrl || '/placeholder.svg'}
                          alt=""
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full bg-gray-50"
                        />
                        <div>
                          <div className="font-semibold">{testimonial.author.name}</div>
                          <div className="text-gray-600">{testimonial.author.role}</div>
                        </div>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
