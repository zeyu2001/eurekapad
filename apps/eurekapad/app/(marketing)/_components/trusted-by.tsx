import Image from 'next/image'

const universities = [
  {
    name: 'MIT',
    logo: '/placeholder.svg?height=40&width=120',
  },
  {
    name: 'Stanford',
    logo: '/placeholder.svg?height=40&width=120',
  },
  {
    name: 'Harvard',
    logo: '/placeholder.svg?height=40&width=120',
  },
  {
    name: 'Berkeley',
    logo: '/placeholder.svg?height=40&width=120',
  },
  {
    name: 'Cambridge',
    logo: '/placeholder.svg?height=40&width=120',
  },
]

export default function TrustedBy() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-b">
      <div className="container mx-auto max-w-6xl">
        <p className="text-center text-sm text-gray-500 mb-8">
          Built by students and researchers from leading institutions
        </p>

        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
          {universities.map(university => (
            <div
              key={university.name}
              className="flex items-center grayscale opacity-70 hover:opacity-100 transition-opacity"
            >
              <Image
                src={university.logo || '/placeholder.svg'}
                alt={`${university.name} logo`}
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
