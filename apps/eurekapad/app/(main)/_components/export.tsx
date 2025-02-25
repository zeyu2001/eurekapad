'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Doc } from '@/convex/_generated/dataModel'

interface ExportProps {
  document: Doc<'documents'>
}

export const Export = ({ document }: ExportProps) => {
  const router = useRouter()

  return (
    <Button variant="ghost" size="sm" onClick={() => router.push(`/documents/${document._id}/editor`)}>
      Export
    </Button>
  )
}
