'use client'

import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { File } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { api } from '@/convex/_generated/api'
import { useSearch } from '@/hooks/use-search'

export const SearchCommand = () => {
  const { user } = useUser()
  const router = useRouter()

  const toggle = useSearch(store => store.toggle)
  const isOpen = useSearch(store => store.isOpen)
  const onClose = useSearch(store => store.onClose)

  // only fetch documents when the search command is open
  const documents = useQuery(api.documents.getSearch, isOpen ? {} : 'skip')

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [toggle])

  const onSelect = (id: string) => {
    router.push(`/documents/${id}`)
    onClose()
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search ${user?.fullName}'s EurekaPad...`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map(document => (
            <CommandItem
              key={document._id}
              value={`${document._id}-${document.title}`}
              title={document.title || 'Untitled'}
              onSelect={() => onSelect(document._id)}
            >
              {document.icon ? <p className="mr-2 text-[18px]">{document.icon}</p> : <File className="mr-2 size-4" />}
              <span>{document.title || 'Untitled'}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
