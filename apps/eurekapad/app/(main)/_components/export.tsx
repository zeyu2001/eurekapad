'use client'

import { CompileResult } from '@eurekapad/swiftlatex/dist/common'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Doc } from '@/convex/_generated/dataModel'
import { useContent } from '@/hooks/use-content'
import { useSwiftLatexEngine } from '@/hooks/use-swiftlatex-engine'
import { blocksToLaTeX } from '@/lib/latex'

interface ExportProps {
  document: Doc<'documents'>
}

export const Export = ({ document }: ExportProps) => {
  const { engine, loaded } = useSwiftLatexEngine()
  const [contentLoaded, content] = useContent(document)

  const handlePdfExport = async () => {
    if (!loaded || !contentLoaded || !engine) {
      toast.error("Hang tight, we're getting things ready...")
      return
    }

    const pdfDownload = new Promise<string>((resolve, reject) => {
      const latex = blocksToLaTeX(JSON.parse(content || '[]'))
      console.log(latex)
      engine.compile(latex).then((result: CompileResult) => {
        if (result.status === 0 && result.pdf) {
          const blob = new Blob([result.pdf], { type: 'application/pdf' })
          const url = URL.createObjectURL(blob)
          window.open(url, '_blank')
          resolve(url)
        }
        console.error(result.log)
        reject()
      })
    })

    toast.promise(pdfDownload, {
      loading: 'Exporting PDF...',
      success: url => (
        <span>
          PDF exported successfully! If the download did not start automatically, you can{' '}
          <a href={url} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
            click here to download
          </a>
          .
        </span>
      ),
      error: 'Failed to export PDF',
    })

    await pdfDownload
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" alignOffset={8}>
        <DropdownMenuItem>LaTeX</DropdownMenuItem>
        <DropdownMenuItem onClick={handlePdfExport}>PDF</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
