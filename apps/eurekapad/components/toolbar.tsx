'use client'

import { useMutation } from 'convex/react'
import { ImageIcon, Smile, X } from 'lucide-react'
import { ChangeEventHandler, ComponentRef, KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'
import { useCoverImage } from '@/hooks/use-cover-image'
import { useOptimisticDocumentUpdate } from '@/hooks/use-optimistic-document-update'

import { IconPicker } from './icon-picker'

interface ToolbarProps {
  initialData: Doc<'documents'>
  preview?: boolean
}

export const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const inputRef = useRef<ComponentRef<'textarea'>>(null)
  const [title, setTitle] = useState(initialData.title)

  useEffect(() => {
    setTitle(initialData.title)
  }, [initialData.title])

  const update = useOptimisticDocumentUpdate()
  const removeIcon = useMutation(api.documents.removeIcon)

  const coverImage = useCoverImage()

  const onTitleChange: ChangeEventHandler<HTMLTextAreaElement> = e => {
    const title = e.target.value
    setTitle(title)
    update({ id: initialData._id, title: title })
  }

  const disableNewLine: KeyboardEventHandler<HTMLTextAreaElement> = event => {
    if (event.key === 'Enter') {
      inputRef.current?.blur()
    }
  }

  const onIconSelect = (icon: string) => {
    update({
      id: initialData._id,
      icon,
    })
  }

  const onRemoveIcon = () => {
    removeIcon({
      id: initialData._id,
    })
  }

  return (
    <div className="pl-[54px] group relative">
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl hover:opacity-75 transition">{initialData.icon}</p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
            variant="outline"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && <p className="text-6xl pt-6">{initialData.icon}</p>}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button className="text-muted-foreground text-xs" variant="outline" size="sm">
              <Smile className="h-4 w-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button onClick={coverImage.onOpen} className="text-muted-foreground text-xs" variant="outline" size="sm">
            <ImageIcon className="h-4 w-4 mr-2" />
            Add cover
          </Button>
        )}
      </div>
      <TextareaAutosize
        ref={inputRef}
        onKeyDown={disableNewLine}
        value={title}
        onChange={onTitleChange}
        className="text-5xl bg-transparent font-bold break-words outline-none resize-none text-[#3F3F3F] dark:text-[#CFCFCF] placeholder:text-muted-foreground"
        placeholder="Untitled"
      />
    </div>
  )
}
