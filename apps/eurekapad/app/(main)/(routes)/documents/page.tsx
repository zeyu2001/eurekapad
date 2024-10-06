'use client'

import { useUser } from '@clerk/nextjs'
import { useMutation } from 'convex/react'
import { PlusCircle } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import homeImage from '@/images/two-humans.svg'
import homeImageDark from '@/images/two-humans-dark.svg'

const DocumentsPage = () => {
  const router = useRouter()
  const { user } = useUser()
  const create = useMutation(api.documents.create)

  const onCreate = () => {
    const promise = create({ title: 'Untitled' }).then(documentId => router.push(`/documents/${documentId}`))

    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New note created!',
      error: 'Failed to create a new note.',
    })
  }

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-6">
      <Image src={homeImage} width="350" alt="Empty" className="dark:hidden" />
      <Image src={homeImageDark} width="350" alt="Empty" className="hidden dark:block" />
      <h2 className="text-lg font-medium">Welcome to {user?.firstName}&apos;s EurekaPad</h2>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
  )
}

export default DocumentsPage
