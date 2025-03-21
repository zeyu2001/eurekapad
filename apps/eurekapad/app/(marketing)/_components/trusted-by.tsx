import Image, { StaticImageData } from 'next/image'

import CambridgeImage from '@/images/cambridge.png'
import ImperialImage from '@/images/imperial.png'
import NUSImage from '@/images/nus.png'
import SUTDImage from '@/images/sutd-logo.png'
interface University {
  name: string
  logo: StaticImageData
}

const universities: University[] = [
  {
    name: 'NUS',
    logo: NUSImage,
  },
  {
    name: 'Cambridge',
    logo: CambridgeImage,
  },
  {
    name: 'SUTD',
    logo: SUTDImage,
  },
  {
    name: 'Imperial',
    logo: ImperialImage,
  },
]

export default function TrustedBy() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-200 bg-white">
      <div className="container mx-auto max-w-6xl">
        <p className="text-center text-sm font-medium text-neutral-500 mb-12">
          Built by students and researchers from leading institutions
        </p>

        <div className="flex flex-wrap justify-center items-center gap-x-20 gap-y-12">
          {universities.map(university => (
            <div
              key={university.name}
              className="flex items-center opacity-85 hover:opacity-100 transition-opacity duration-300"
            >
              <Image
                src={university.logo || '/placeholder.svg'}
                alt={`${university.name} logo`}
                width={150}
                height={32}
                className="h-10 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
