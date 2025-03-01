'use client'

import { useMutation } from 'convex/react'
import { ImageIcon, X } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { useCoverImage } from '@/hooks/use-cover-image'
import { useDocumentId } from '@/hooks/use-documentId'
import { cn } from '@/lib/utils'

interface CoverImageProps {
  url?: string
  preview?: boolean
}

export const Cover = ({ url, preview }: CoverImageProps) => {
  const documentId = useDocumentId()

  const coverImage = useCoverImage()
  const removeCoverImage = useMutation(api.documents.removeCoverImage)

  const onRemove = async () => {
    removeCoverImage({ id: documentId })
  }

  return (
    <div className={cn('relative w-full h-[35vh] group', !url && 'h-[12vh]', url && 'bg-muted')}>
      {!!url && <Image src={url} fill alt="Cover" className="object-cover" />}
      {url && !preview && (
        <div className="absolute bottom-5 right-5 flex items-center gap-x-2 opacity-0 group-hover:opacity-100">
          <Button
            onClick={() => coverImage.onReplace(url)}
            className="text-xs text-muted-foreground"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="mr-2 size-4" />
            Change cover
          </Button>
          <Button onClick={onRemove} className="text-xs text-muted-foreground" variant="outline" size="sm">
            <X className="mr-2 size-4" />
            Remove
          </Button>
        </div>
      )}
    </div>
  )
}
