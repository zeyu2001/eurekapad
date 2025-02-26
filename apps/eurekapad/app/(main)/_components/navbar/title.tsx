'use client'

import { useEffect, useRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Doc } from '@/convex/_generated/dataModel'
import { useOptimisticDocumentUpdate } from '@/hooks/use-optimistic-document-update'

interface TitleProps {
  initialData: Doc<'documents'>
}

export const Title = ({ initialData }: TitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const update = useOptimisticDocumentUpdate()

  const [title, setTitle] = useState(initialData.title)

  useEffect(() => {
    setTitle(initialData.title)
  }, [initialData.title])

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value
    setTitle(title)
    update({ id: initialData._id, title })
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      inputRef.current?.blur()
    }
  }

  return (
    <div className="flex items-center gap-x-1 flex-grow">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      <Input
        ref={inputRef}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={title}
        className="h-7 px-2 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 truncate"
        placeholder="Untitled"
      />
    </div>
  )
}

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-9 w-20 rounded-md" />
}
