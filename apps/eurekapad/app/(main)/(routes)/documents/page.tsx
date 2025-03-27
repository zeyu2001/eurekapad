import { currentUser } from '@clerk/nextjs/server'
import Image from 'next/image'

import homeImage from '@/images/two-humans.svg'
import homeImageDark from '@/images/two-humans-dark.svg'

import CreateNote from './_components/createNote'

export default async function DocumentsPage() {
  const user = await currentUser()

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-6">
      <Image src={homeImage} width="350" alt="Empty" className="dark:hidden" />
      <Image src={homeImageDark} width="350" alt="Empty" className="hidden dark:block" />
      <h2 className="text-lg font-medium">Welcome to {user!.firstName}&apos;s EurekaPad</h2>
      <CreateNote />
    </div>
  )
}
