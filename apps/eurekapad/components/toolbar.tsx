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
    <div className="group relative pl-[54px]">
      {!!initialData.icon && !preview && (
        <div className="group/icon flex items-center gap-x-2 pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl transition hover:opacity-75">{initialData.icon}</p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full text-xs text-muted-foreground opacity-0 transition group-hover/icon:opacity-100"
            variant="outline"
            size="icon"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && <p className="pt-6 text-6xl">{initialData.icon}</p>}
      <div className="flex items-center gap-x-1 py-4 opacity-0 group-hover:opacity-100">
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button className="text-xs text-muted-foreground" variant="outline" size="sm">
              <Smile className="mr-2 size-4" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button onClick={coverImage.onOpen} className="text-xs text-muted-foreground" variant="outline" size="sm">
            <ImageIcon className="mr-2 size-4" />
            Add cover
          </Button>
        )}
      </div>
      <TextareaAutosize
        ref={inputRef}
        onKeyDown={disableNewLine}
        value={title}
        onChange={onTitleChange}
        className="resize-none break-words bg-transparent text-5xl font-bold text-[#3F3F3F] outline-none placeholder:text-muted-foreground dark:text-[#CFCFCF]"
        placeholder="Untitled"
      />
    </div>
  )
}
