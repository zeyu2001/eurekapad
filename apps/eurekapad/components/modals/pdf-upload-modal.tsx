'use client'

import { useAction, useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { SingleFileDropzone } from '@/components/single-file-dropzone'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { api } from '@/convex/_generated/api'
import { usePdfDialog } from '@/hooks/use-pdf-dialog'
import { useSaveContentCallback } from '@/hooks/use-save-content-callback'
import { upload } from '@/lib/client-uploads'
import { analysisResultToBlocks } from '@/lib/docintelligence'

export const PdfUploadModal = () => {
  const parsePdf = useAction(api.ai.parsePdf)
  const pdfDialog = usePdfDialog()

  const [file, setFile] = useState<File>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getUploadUrl = useAction(api.uploads.getUploadUrl)
  const createDocument = useMutation(api.documents.create)
  const saveContent = useSaveContentCallback()

  const router = useRouter()

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
        setIsSubmitting(false)
        setFile(undefined)
        return
      }

      const uploadUrl = await getUploadUrl({})
      const url = await upload(file, uploadUrl)

      if (!url) {
        toast.error('Failed to upload media.')
        return
      }

      try {
        const [analyzeResult, figuresb64] = await parsePdf({ fileUrl: url.href })
        const figureUrls = await Promise.all(
          figuresb64.map(async (b64, index) => {
            const uploadUrl = await getUploadUrl({})
            const rawFigure = Buffer.from(b64, 'base64')
            const file = new File([rawFigure], `figure-${index}.png`, { type: 'image/png' })
            const url = await upload(file, uploadUrl)
            if (!url) {
              toast.error('Failed to process images in PDF.')
              return '#'
            }
            return url.href
          }),
        )
        const blocks = analysisResultToBlocks(analyzeResult, figureUrls)
        if (blocks.length === 0) {
          blocks.push({
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'No content found.',
                styles: {},
              },
            ],
          })
        }

        const documentId = await createDocument({ title: file.name.replace(/\.pdf$/, '') })
        const promise = saveContent(JSON.stringify(blocks), documentId).then(() =>
          router.push(`/documents/${documentId}`),
        )

        toast.promise(promise, {
          success: 'Redirecting to your new document...',
          error: 'Something went wrong while processing the PDF. Please try again.',
        })
      } catch (error) {
        console.error(error)
        toast.error('Something went wrong while processing the PDF. Please try again.')
      }

      onClose()
    }
  }

  return (
    <Dialog open={pdfDialog.isOpen} onOpenChange={pdfDialog.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Upload PDF</h2>
        </DialogHeader>
        <p className="text-center text-sm text-gray-500">
          As a beta feature, only the first 5 pages will be processed.
        </p>
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
