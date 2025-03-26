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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Doc } from '@/convex/_generated/dataModel'
import { useContainerDimensions } from '@/hooks/use-container-dimensions'
import { useContent } from '@/hooks/use-content'
import { useSwiftLatexEngine } from '@/hooks/use-swiftlatex-engine'
import { blocksToLaTeX, getAllImages } from '@/lib/latex'

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

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

const Loading = ({ message }: { message: string }) => (
  <div className="flex size-full items-center justify-center">
    <Spinner />
    <p className="ml-2 text-sm text-gray-500">{message}</p>
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

interface LatexModalProps {
  document: Doc<'documents'>
}

export default function LatexModal({ document }: LatexModalProps) {
  const { engine, loaded } = useSwiftLatexEngine()
  const [contentLoaded, content] = useContent(document)
  const [latex, setLatex] = useDebounceValue<string | undefined>(undefined, 500)

  useEffect(() => {
    const fetchLatex = async () => {
      if (content !== undefined) {
        const result = await blocksToLaTeX(JSON.parse(content || '[]'))
        setLatex(result)
      }
    }
    fetchLatex()
  }, [content])

  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [numPages, setNumPages] = useState(0)
  const { theme } = useTheme()
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const { height: editorHeight } = useContainerDimensions(editorContainerRef)
  const pdfContainerRef = useRef<HTMLDivElement>(null)
  const { width: pdfWidth } = useContainerDimensions(pdfContainerRef)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loaded || !engine || !contentLoaded || !latex) return

    const compileLatex = async () => {
      const images = await getAllImages(JSON.parse(content || '[]'))

      engine.compile(latex, images).then((result: CompileResult) => {
        console.log('compiled', result)
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
  }, [loaded, engine, contentLoaded, latex, content])

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
    <div className="grid h-[70vh] gap-4 md:grid-cols-2">
      <div ref={editorContainerRef} className="relative h-full overflow-auto">
        <div className="absolute right-4 top-0 z-10">
          <CopyButton text={latex || ''} />
        </div>
        <div className="h-full overflow-auto">
          {latex ? (
            <ReactCodeMirror
              value={latex}
              extensions={[langs.stex()]}
              theme={editorTheme}
              height={editorHeight.toString()}
              onChange={setLatex}
              editable={true}
            />
          ) : (
            <Loading message="Exporting LaTeX..." />
          )}
        </div>
      </div>
      <div ref={pdfContainerRef} className="relative h-full overflow-auto">
        {error ? (
          <div className="size-full overflow-auto bg-red-50 p-4">
            {error.split('\n').map((line, index) => (
              <p key={index} className="font-mono text-sm text-red-500">
                {line}
              </p>
            ))}
          </div>
        ) : pdfUrl ? (
          <>
            <div className="absolute right-1 top-2 z-10 space-x-2">
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
          <Loading message="Exporting PDF..." />
        )}
      </div>
    </div>
  )
}
