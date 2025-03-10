'use client'

import { useState } from 'react'

import LatexModal from '@/components/modals/latex-modal'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Doc } from '@/convex/_generated/dataModel'

interface ExportProps {
  document: Doc<'documents'>
}

export const Export = ({ document }: ExportProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog modal={false} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[80%]" onOpenAutoFocus={e => e.preventDefault()}>
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>Export LaTeX and PDF</DialogTitle>
        </DialogHeader>
        <LatexModal document={document} />
      </DialogContent>
    </Dialog>
  )
}
