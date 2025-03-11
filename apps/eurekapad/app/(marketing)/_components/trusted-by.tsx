import Image from 'next/image'

import CambridgeImage from '@/images/cambridge.png'
import ImperialImage from '@/images/imperial.png'
import NUSImage from '@/images/nus.png'
import SUTDImage from '@/images/sutd-logo.png'

const universities = [
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
    <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-b">
      <div className="container mx-auto max-w-6xl">
        <p className="text-center text-sm text-gray-500 mb-8">
          Built by students and researchers from leading institutions
        </p>

        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
          {universities.map(university => (
            <div key={university.name} className="flex items-center opacity-80 hover:opacity-100 transition-opacity">
              <Image
                src={university.logo}
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
