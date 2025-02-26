'use client'

import { useAction } from 'convex/react'
import { useState } from 'react'
import { toast } from 'sonner'

import { SingleFileDropzone } from '@/components/single-file-dropzone'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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

  const getUploadUrl = useAction(api.uploads.getUploadUrl)

  const onChange = async (file?: File) => {
    if (file) {
      setFile(file)

      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB. Support for larger files coming soon!')
        setFile(undefined)
        return
      }

      const uploadUrl = await getUploadUrl({})
      const url = await upload(file, uploadUrl)

      if (!url) {
        toast.error('Failed to upload media.')
        setFile(undefined)
        return
      }

      await update({
        id: documentId,
        coverImage: url.href,
      })

      coverImage.onClose()
    }
  }

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose} modal={false}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <DialogTitle>
          <SingleFileDropzone
            fileType="image"
            className="w-full outline-none"
            disabled={file !== undefined}
            value={file}
            onChange={onChange}
          />
        </DialogTitle>
      </DialogContent>
    </Dialog>
  )
}
