'use client'

import { useUser } from '@clerk/nextjs'
import { useMutation } from 'convex/react'
import { PlusCircle, Upload } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { usePdfDialog } from '@/hooks/use-pdf-dialog'
import homeImage from '@/images/two-humans.svg'
import homeImageDark from '@/images/two-humans-dark.svg'

const DocumentsPage = () => {
  const router = useRouter()
  const { user } = useUser()
  const create = useMutation(api.documents.create)
  const pdfDialog = usePdfDialog()

  const onCreate = () => {
    const promise = create({}).then(documentId => router.push(`/documents/${documentId}`))

    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New note created!',
      error: 'Failed to create a new note.',
    })
  }

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-6">
      <Image src={homeImage} width="350" alt="Empty" className="dark:hidden" />
      <Image src={homeImageDark} width="350" alt="Empty" className="hidden dark:block" />
      <h2 className="text-lg font-medium">Welcome to {user?.firstName}&apos;s EurekaPad</h2>
      <div className="flex space-x-4">
        <Button onClick={onCreate}>
          <PlusCircle className="mr-2 size-4" />
          Create a note
        </Button>
        <Button onClick={pdfDialog.onOpen}>
          <Upload className="mr-2 size-4" />
          Create from PDF
        </Button>
      </div>
    </div>
  )
}

export default DocumentsPage
