'use client'

import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

import { CompileResult } from '@eurekapad/swiftlatex/dist/common'
import { langs } from '@uiw/codemirror-extensions-langs'
import { vscodeDarkInit, vscodeLightInit } from '@uiw/codemirror-theme-vscode'
import ReactCodeMirror from '@uiw/react-codemirror'
import { CheckIcon, CopyIcon, DownloadIcon, ExternalLinkIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { toast } from 'sonner'
import { useDebounceValue } from 'usehooks-ts'

import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Doc } from '@/convex/_generated/dataModel'
import { useContainerDimensions } from '@/hooks/use-container-dimensions'
import { useContent } from '@/hooks/use-content'
import { useSwiftLatexEngine } from '@/hooks/use-swiftlatex-engine'
import { blocksToLaTeX, getAllImages } from '@/lib/latex'

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

const Loading = () => (
  <div className="flex items-center justify-center w-full h-full">
    <Spinner />
    <p className="text-sm text-gray-500 ml-2">Exporting PDF...</p>
  </div>
)

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={() => copy()} variant="ghost" size="sm">
            {copied ? <CheckIcon size={16} className="text-green-500" /> : <CopyIcon size={16} />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">Copy</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const DownloadButton = ({ pdfUrl }: { pdfUrl: string }) => {
  const [downloaded, setDownloaded] = useState(false)

  const download = () => {
    const a = document.createElement('a')
    a.href = pdfUrl
    a.download = 'document.pdf'
    a.click()
    toast.success('Downloaded PDF!')
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 3000)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={download}
            variant="ghost"
            size="icon"
            className="text-black hover:bg-gray-200 hover:text-black"
          >
            {downloaded ? <CheckIcon size={16} className="text-green-500" /> : <DownloadIcon size={16} />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">Download</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const PreviewButton = ({ pdfUrl }: { pdfUrl: string }) => {
  const preview = () => {
    window.open(pdfUrl, '_blank')
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={preview}
            variant="ghost"
            size="icon"
            className="text-black hover:bg-gray-200 hover:text-black"
          >
            <ExternalLinkIcon size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">Open in new tab</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface ExportProps {
  document: Doc<'documents'>
}

export const Export = ({ document }: ExportProps) => {
  const { engine, loaded } = useSwiftLatexEngine()
  const [open, setOpen] = useState(false)
  const [contentLoaded, content] = useContent(document)
  const [latex, setLatex] = useDebounceValue<string>(blocksToLaTeX(JSON.parse(content || '[]')), 1000)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [numPages, setNumPages] = useState(0)
  const { theme } = useTheme()
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const { height: editorHeight } = useContainerDimensions(editorContainerRef)
  const pdfContainerRef = useRef<HTMLDivElement>(null)
  const { width: pdfWidth } = useContainerDimensions(pdfContainerRef)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const compileLatex = async () => {
      const images = await getAllImages(JSON.parse(content || '[]'))
      if (!loaded || !engine || !contentLoaded || !latex || !open) return

      engine.compile(latex, images).then((result: CompileResult) => {
        if (result.status === 0 && result.pdf) {
          const blob = new Blob([result.pdf], { type: 'application/pdf' })
          const url = URL.createObjectURL(blob)
          setError(null)
          setPdfUrl(url)
        } else {
          console.error(result.log)
          setError(result.log)
          toast.error('Failed to compile LaTeX')
        }
      })
    }
    compileLatex()
  }, [loaded, engine, contentLoaded, latex, open])

  const editorTheme =
    theme === 'light'
      ? vscodeLightInit({
          settings: {
            caret: '#000000',
            fontFamily: 'monospace',
          },
        })
      : vscodeDarkInit({
          settings: {
            caret: '#c6c6c6',
            fontFamily: 'monospace',
          },
        })

  const onDocumentLoadSuccess = ({ numPages: nextNumPages }: { numPages: number }): void => {
    setNumPages(nextNumPages)
  }

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
        <div className="grid md:grid-cols-2 gap-4 h-[70vh]">
          <div ref={editorContainerRef} className="h-full overflow-auto relative">
            <div className="absolute top-0 right-4 z-10">
              <CopyButton text={latex} />
            </div>
            <div className="h-full overflow-auto">
              <ReactCodeMirror
                value={latex}
                extensions={[langs.stex()]}
                theme={editorTheme}
                height={editorHeight.toString()}
                onChange={setLatex}
              />
            </div>
          </div>
          <div ref={pdfContainerRef} className="h-full overflow-auto relative">
            {error ? (
              <div className="w-full h-full overflow-auto p-4 bg-red-50">
                {error.split('\n').map((line, index) => (
                  <p key={index} className="text-sm text-red-500 font-mono">
                    {line}
                  </p>
                ))}
              </div>
            ) : pdfUrl ? (
              <>
                <div className="absolute top-0 right-4 z-10 space-x-2">
                  <DownloadButton pdfUrl={pdfUrl} />
                  <PreviewButton pdfUrl={pdfUrl} />
                </div>
                <div className="h-full overflow-auto">
                  <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} loading={<></>}>
                    {Array.from(new Array(numPages), (_el, index) => (
                      <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={pdfWidth - 16}
                        renderAnnotationLayer={true}
                        renderTextLayer={true}
                        className="mt-1"
                      />
                    ))}
                  </Document>
                </div>
              </>
            ) : (
              <Loading />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
