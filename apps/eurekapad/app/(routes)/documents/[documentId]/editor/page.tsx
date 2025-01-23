'use client'

import { useQuery } from 'convex/react'
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  Download,
  HelpCircle,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Textarea } from '@/components/ui/textarea'
import { api } from '@/convex/_generated/api'
import { useContent } from '@/hooks/use-content'
import { useDocumentId } from '@/hooks/use-documentId'
import { useSwiftLatexEngine } from '@/hooks/use-swiftlatex-engine'
import { blocksToLaTeX, getAllImages } from '@/lib/latex'

export default function LatexExportEditor() {
  const router = useRouter()
  const documentId = useDocumentId()
  const document = useQuery(api.documents.getById, { documentId })
  const [isLoaded, initialContent] = useContent(document)
  const { engine, loaded: engineLoaded } = useSwiftLatexEngine()

  const [font, setFont] = useState('Computer Modern')
  const [fontSize, setFontSize] = useState('Medium')
  const [colorTheme, setColorTheme] = useState('Default')
  const [margins, setMargins] = useState('1.0')
  const [showAdvanced, setShowAdvanced] = useState(false)
  // const [customPackages, setCustomPackages] = useState('')
  // const [customMacros, setCustomMacros] = useState('')
  // const [customPreamble, setCustomPreamble] = useState('')
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, _] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const handleUpdatePreview = async () => {
    if (!isLoaded || !engineLoaded || !engine || !document) {
      toast.error('Please wait for the editor to fully load')
      return
    }

    try {
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

  if (!document || !isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">NotePro</h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="flex items-center gap-2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back to Notes
          </Button>
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Customization Toolbar */}
      <div className="flex flex-col p-4 border-b">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="font">Font:</Label>
            <Select value={font} onValueChange={setFont}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Computer Modern">Computer Modern</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Arial">Arial</SelectItem>
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
                <SelectItem value="Small">Small</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="colorTheme">Color Theme:</Label>
            <Select value={colorTheme} onValueChange={setColorTheme}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Default">Default</SelectItem>
                <SelectItem value="Dark">Dark</SelectItem>
                <SelectItem value="Sepia">Sepia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="margins">Margins:</Label>
            <Input
              id="margins"
              type="number"
              value={margins}
              onChange={e => setMargins(e.target.value)}
              className="w-20"
            />
            <span>in</span>
          </div>
          <Button onClick={handleUpdatePreview}>Update Preview</Button>
          <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)} className="ml-auto">
            {showAdvanced ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Hide Advanced
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Show Advanced
              </>
            )}
          </Button>
        </div>
        {showAdvanced && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <Label htmlFor="customPackages">Custom Packages</Label>
              {/* <Textarea
                id="customPackages"
                placeholder="Enter custom LaTeX packages"
                value={customPackages}
                onChange={(e) => setCustomPackages(e.target.value)}
              /> */}
            </div>
            <div>
              <Label htmlFor="customMacros">Custom Macros</Label>
              {/* <Textarea
                id="customMacros"
                placeholder="Enter custom LaTeX macros"
                value={customMacros}
                onChange={(e) => setCustomMacros(e.target.value)}
              /> */}
            </div>
            <div>
              <Label htmlFor="customPreamble">Custom Preamble</Label>
              {/* <Textarea
                id="customPreamble"
                placeholder="Enter custom LaTeX preamble"
                value={customPreamble}
                onChange={(e) => setCustomPreamble(e.target.value)}
              /> */}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* LaTeX Code */}
        <div className="w-1/2 p-4 border-r">
          <h2 className="text-lg font-semibold mb-2">LaTeX Code</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto h-[calc(100vh-240px)]">
            <code>{isLoaded ? blocksToLaTeX(JSON.parse(initialContent || '[]')) : 'Loading...'}</code>
          </pre>
        </div>
        {/* PDF Preview */}
        <div className="w-1/2 p-4">
          <h2 className="text-lg font-semibold mb-2">PDF Preview</h2>
          <div className="bg-white border rounded-md p-4 h-[calc(100vh-240px)] flex flex-col">
            {error ? (
              <div className="flex-1 bg-red-50 p-4 overflow-auto">
                <pre className="text-red-500 text-sm">{error}</pre>
              </div>
            ) : pdfUrl ? (
              <div className="flex-1 bg-gray-100 flex items-center justify-center">
                <iframe src={pdfUrl} className="w-full h-full" />
              </div>
            ) : (
              <div className="flex-1 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Click &quot;Update Preview&quot; to generate PDF</p>
              </div>
            )}
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <Button size="icon" variant="outline">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex justify-end gap-4 p-4 border-t">
        <Button className="flex items-center gap-2" onClick={handleDownload}>
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
        <Button variant="outline" className="flex items-center gap-2" onClick={handleCopyLatex}>
          <Copy className="h-4 w-4" />
          Copy LaTeX
        </Button>
      </footer>
    </div>
  )
}
