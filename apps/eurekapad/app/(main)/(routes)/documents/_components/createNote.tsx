'use client'

import { useMutation } from 'convex/react'
import { PlusCircle, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { usePdfDialog } from '@/hooks/use-pdf-dialog'

export default function CreateNote() {
  const router = useRouter()
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
  )
}
