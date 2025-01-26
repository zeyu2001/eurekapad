'use client'

import { useAction } from 'convex/react'
import { useState } from 'react'
import { toast } from 'sonner'

import { SingleFileDropzone } from '@/components/single-file-dropzone'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { api } from '@/convex/_generated/api'
import { useCoverImage } from '@/hooks/use-cover-image'
import { useDocumentId } from '@/hooks/use-documentId'
import { useOptimisticDocumentUpdate } from '@/hooks/use-optimistic-document-update'
import { upload } from '@/lib/client-uploads'

export const CoverImageModal = () => {
  const documentId = useDocumentId()
  const update = useOptimisticDocumentUpdate()
  const coverImage = useCoverImage()

  const [file, setFile] = useState<File>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getUploadUrl = useAction(api.uploads.getUploadUrl)

  const onClose = () => {
    setFile(undefined)
    setIsSubmitting(false)
    coverImage.onClose()
  }

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true)
      setFile(file)

      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB. Support for larger files coming soon!')
        return
      }

      const uploadUrl = await getUploadUrl({})
      const url = await upload(file, uploadUrl)

      if (!url) {
        toast.error('Failed to upload media.')
        return
      }

      await update({
        id: documentId,
        coverImage: url.href,
      })

      onClose()
    }
  }

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose} modal={false}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <SingleFileDropzone
          fileType="image"
          className="w-full outline-hidden"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  )
}
