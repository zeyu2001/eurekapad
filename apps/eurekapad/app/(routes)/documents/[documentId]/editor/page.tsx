'use client'

import { langs } from '@uiw/codemirror-extensions-langs'
import { vscodeDarkInit, vscodeLightInit } from '@uiw/codemirror-theme-vscode'
import ReactCodeMirror from '@uiw/react-codemirror'
import { useQuery } from 'convex/react'
import { ArrowLeft, Copy, Download } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useState } from 'react'
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

export default function LatexExportEditor() {
  const documentId = useDocumentId()
  const document = useQuery(api.documents.getById, { documentId })
  const [isLoaded, initialContent] = useContent(document)
  const { engine, loaded: engineLoaded } = useSwiftLatexEngine()

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
        <h1 className="text-2xl font-bold">EurekaPad</h1>
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
              <div className="flex-1 bg-gray-100 flex items-center justify-center">
                <iframe src={pdfUrl} className="w-full h-full" />
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
