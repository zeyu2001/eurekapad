'use client'

import { langs } from '@uiw/codemirror-extensions-langs'
import { vscodeDarkInit, vscodeLightInit } from '@uiw/codemirror-theme-vscode'
import ReactCodeMirror from '@uiw/react-codemirror'
import { useQuery } from 'convex/react'
import { ArrowLeft, Copy, Download } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { toast } from 'sonner'

import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Textarea } from '@/components/ui/textarea'
import { api } from '@/convex/_generated/api'
import { useContent } from '@/hooks/use-content'
import { useCustomizationStore } from '@/hooks/use-customization-store'
import { useDocumentId } from '@/hooks/use-documentId'
import { useSwiftLatexEngine } from '@/hooks/use-swiftlatex-engine'
import { blocksToLaTeX, getAllImages } from '@/lib/latex'

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

export default function LatexExportEditor() {
  const documentId = useDocumentId()
  const document = useQuery(api.documents.getById, { documentId })
  const [isLoaded, initialContent] = useContent(document)
  const { engine, loaded: engineLoaded } = useSwiftLatexEngine()
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [rotation, setRotation] = useState(0)
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)

  const {
    fontType,
    fontSize,
    textColor,
    headingsColor,
    margins,
    lineSpacing,
    setFontType,
    setFontSize,
    setTextColor,
    setHeadingsColor,
    setMargins,
    setLineSpacing,
    reset: resetCustomization,
  } = useCustomizationStore()
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfLoadingState, setPdfLoadingState] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { theme } = useTheme()

  const onDocumentLoadSuccess = ({ numPages: nextNumPages }: { numPages: number }): void => {
    setNumPages(nextNumPages)
    setPageNumber(1) // Reset to first page when loading new document
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return // Don't handle shortcuts when typing in inputs
      }

      switch (e.key) {
        case 'ArrowLeft':
          setPageNumber(prev => Math.max(1, prev - 1))
          break
        case 'ArrowRight':
          setPageNumber(prev => Math.min(numPages, prev + 1))
          break
        case '+':
        case '=':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            setScale(prev => Math.min(2, prev + 0.1))
          }
          break
        case '-':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            setScale(prev => Math.max(0.5, prev - 0.1))
          }
          break
        case '0':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            setScale(1.0)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [numPages])

  // Function to fit page to width
  const handleFitToWidth = () => {
    if (containerRef && containerRef.clientWidth) {
      // Adjust for padding
      const containerWidth = containerRef.clientWidth - 32 // 2rem (p-4) padding
      setScale(containerWidth / 595) // 595 is standard PDF width in points
    }
  }

  // Function to fit page to container
  const handleFitToPage = () => {
    if (containerRef && containerRef.clientHeight) {
      // Adjust for padding and controls height
      const containerHeight = containerRef.clientHeight - 80 // Account for controls and padding
      setScale(containerHeight / 842) // 842 is standard PDF height in points
    }
  }

  const handleUpdatePreview = async () => {
    if (!isLoaded || !engineLoaded || !engine || !document) {
      toast.error('Please wait for the editor to fully load')
      return
    }

    try {
      setPdfLoadingState(true)
      const latex = blocksToLaTeX(JSON.parse(initialContent || '[]'))
      const images = await getAllImages(JSON.parse(initialContent || '[]'))

      const result = await engine.compile(latex, images)
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
    } catch (err) {
      console.error(err)
      toast.error('Failed to generate preview')
    } finally {
      setPdfLoadingState(false)
    }
  }

  const handleDownload = () => {
    if (!pdfUrl || !document) {
      toast.error('Please generate a preview first')
      return
    }

    const a = window.document.createElement('a')
    a.href = pdfUrl
    a.download = `${document?.title || 'document'}.pdf`
    a.click()
    toast.success('PDF downloaded!')
  }

  const handleCopyLatex = async () => {
    if (!isLoaded || !document) {
      toast.error('Please wait for the editor to fully load')
      return
    }

    try {
      const latex = blocksToLaTeX(JSON.parse(initialContent || '[]'))
      await navigator.clipboard.writeText(latex)
      toast.success('LaTeX code copied to clipboard!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to copy LaTeX code')
    }
  }

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

  if (!document || !isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-3 py-2 border-b">
        <h1 className="text-2xl font-bold">{document.title}</h1>
        <div className="flex items-center gap-4">
          <Link href={`/documents/${documentId}`}>
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Notes
            </Button>
          </Link>
        </div>
      </header>

      {/* Customization Toolbar */}
      <div className="flex flex-col px-3 py-2 border-b">
        <div className="flex flex-wrap items-center gap-4">
          {/* Font Settings */}
          <div className="flex items-center gap-2">
            <Label htmlFor="fontType">Font:</Label>
            <Select value={fontType} onValueChange={setFontType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Computer Modern">Computer Modern</SelectItem>
                <SelectItem value="Times">Times</SelectItem>
                <SelectItem value="Sans Serif">Sans Serif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="fontSize">Size:</Label>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10pt">10pt</SelectItem>
                <SelectItem value="11pt">11pt</SelectItem>
                <SelectItem value="12pt">12pt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Color Settings */}
          <div className="flex items-center gap-2">
            <Label htmlFor="textColor">Text Color:</Label>
            <Input
              id="textColor"
              type="color"
              value={textColor}
              onChange={e => setTextColor(e.target.value)}
              className="w-[60px] h-[38px] p-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="headingsColor">Headings Color:</Label>
            <Input
              id="headingsColor"
              type="color"
              value={headingsColor}
              onChange={e => setHeadingsColor(e.target.value)}
              className="w-[60px] h-[38px] p-1"
            />
          </div>

          {/* Layout Settings */}
          <div className="flex items-center gap-2">
            <Label htmlFor="margins">Margins:</Label>
            <Select value={margins} onValueChange={setMargins}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select margins" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.0">1 inch</SelectItem>
                <SelectItem value="0.75">0.75 inch</SelectItem>
                <SelectItem value="0.5">0.5 inch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="lineSpacing">Line Spacing:</Label>
            <Select value={lineSpacing} onValueChange={setLineSpacing}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select spacing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.0">Single</SelectItem>
                <SelectItem value="1.5">1.5</SelectItem>
                <SelectItem value="2.0">Double</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" onClick={resetCustomization}>
              Reset
            </Button>
            <Button variant="ghost" onClick={handleUpdatePreview}>
              Update Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* LaTeX Code */}
        <div className="w-1/2 p-4 border-r">
          <h2 className="text-lg font-semibold mb-2">LaTeX Code</h2>
          <pre className="bg-background rounded-md overflow-auto h-[calc(100vh-240px)]">
            {isLoaded ? (
              <ReactCodeMirror
                value={blocksToLaTeX(JSON.parse(initialContent || '[]'))}
                extensions={[langs.stex()]}
                theme={editorTheme}
                height="100%"
                // onChange={setLatex}
              />
            ) : (
              'Loading...'
            )}
          </pre>
        </div>
        {/* PDF Preview */}
        <div className="w-1/2 p-4">
          <h2 className="text-lg font-semibold mb-2">PDF Preview</h2>
          <div className="h-[calc(100vh-240px)] flex flex-col">
            {error ? (
              <div className="flex-1 bg-red-50 p-4 overflow-auto">
                <pre className="text-red-500 text-sm">{error}</pre>
              </div>
            ) : pdfUrl ? (
              <div className="flex-1 bg-gray-100 flex flex-col relative overflow-auto">
                <div className="sticky top-0 z-10 bg-background border-b flex items-center justify-between p-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                      disabled={pageNumber <= 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {pageNumber} of {numPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
                      disabled={pageNumber >= numPages}
                    >
                      Next
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}>
                      Zoom Out
                    </Button>
                    <span className="text-sm">{Math.round(scale * 100)}%</span>
                    <Button variant="outline" size="sm" onClick={() => setScale(prev => Math.min(2, prev + 0.1))}>
                      Zoom In
                    </Button>
                    <Select
                      value={(() => {
                        const scalePercent = Math.round(scale * 100)
                        if (scalePercent === Math.round(((containerRef?.clientWidth ?? 0) / 595) * 100)) {
                          return 'fit-width'
                        }
                        if (scalePercent === Math.round(((containerRef?.clientHeight ?? 0) / 842) * 100)) {
                          return 'fit-page'
                        }
                        return scale.toString()
                      })()}
                      onValueChange={value => {
                        if (value === 'fit-width') {
                          handleFitToWidth()
                        } else if (value === 'fit-page') {
                          handleFitToPage()
                        } else {
                          setScale(parseFloat(value))
                        }
                      }}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue>
                          {(() => {
                            const scalePercent = Math.round(scale * 100)
                            if (scalePercent === Math.round(((containerRef?.clientWidth ?? 0) / 595) * 100)) {
                              return 'Fit Width'
                            }
                            if (scalePercent === Math.round(((containerRef?.clientHeight ?? 0) / 842) * 100)) {
                              return 'Fit Page'
                            }
                            return `${scalePercent}%`
                          })()}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5">50%</SelectItem>
                        <SelectItem value="1.0">100%</SelectItem>
                        <SelectItem value="1.5">150%</SelectItem>
                        <SelectItem value="2.0">200%</SelectItem>
                        <SelectItem value="fit-width">Fit Width</SelectItem>
                        <SelectItem value="fit-page">Fit Page</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRotation(prev => (prev + 90) % 360)}
                      title="Rotate"
                    >
                      Rotate
                    </Button>
                  </div>
                </div>
                <div className="flex-1 flex justify-center p-4 overflow-hidden" ref={setContainerRef}>
                  <div
                    className="relative"
                    style={{
                      width: `${595 * scale}px`,
                      height: `${842 * scale}px`,
                      transition: 'width 0.2s, height 0.2s',
                    }}
                  >
                    <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} className="absolute inset-0">
                      <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        rotate={rotation}
                        className="shadow-lg"
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                        loading={
                          <div className="flex items-center justify-center h-[600px]">
                            <Spinner />
                          </div>
                        }
                        error={
                          <div className="flex items-center justify-center h-[600px] text-red-500">
                            Failed to load page
                          </div>
                        }
                      />
                    </Document>
                  </div>
                </div>
              </div>
            ) : pdfLoadingState ? (
              <div className="flex-1 bg-gray-200 flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <div className="flex-1 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Click &quot;Update Preview&quot; to generate PDF</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex justify-end gap-4 px-3 py-2 border-t">
        <Button className="flex items-center gap-2" onClick={handleDownload}>
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
        <Button variant="secondary" className="flex items-center gap-2" onClick={handleCopyLatex}>
          <Copy className="h-4 w-4" />
          Copy LaTeX
        </Button>
      </footer>
    </div>
  )
}
