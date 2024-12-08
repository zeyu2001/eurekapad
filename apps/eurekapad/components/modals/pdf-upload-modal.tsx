'use client'

import { useAction } from 'convex/react'
import { useState } from 'react'
import { toast } from 'sonner'

import { SingleFileDropzone } from '@/components/single-file-dropzone'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { api } from '@/convex/_generated/api'
import { usePdfDialog } from '@/hooks/use-pdf-dialog'
import { upload } from '@/lib/client-uploads'

export const PdfUploadModal = () => {
  const parsePdf = useAction(api.ai.parsePdf)
  const pdfDialog = usePdfDialog()

  const [file, setFile] = useState<File>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getUploadUrl = useAction(api.uploads.getUploadUrl)

  const onClose = () => {
    setFile(undefined)
    setIsSubmitting(false)
    pdfDialog.onClose()
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

      const result = await parsePdf({ fileUrl: url.href })
      console.log(result)

      onClose()
    }
  }

  return (
    <Dialog open={pdfDialog.isOpen} onOpenChange={pdfDialog.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Upload PDF</h2>
        </DialogHeader>
        <SingleFileDropzone
          fileType="pdf"
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  )
}
