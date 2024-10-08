import '@fortawesome/fontawesome-free/css/all.min.css'

import { InlineContentSchema, StyleSchema } from '@blocknote/core'
import { ReactCustomBlockRenderProps } from '@blocknote/react'
import { langNames, langs } from '@uiw/codemirror-extensions-langs'
import { vscodeDarkInit, vscodeLightInit } from '@uiw/codemirror-theme-vscode'
import ReactCodeMirror from '@uiw/react-codemirror'
import clsx from 'clsx'
import { useAction } from 'convex/react'
import { Check, ChevronsDown, CircleAlert, Delete, Play } from 'lucide-react'
import { useTheme } from 'next-themes'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useDebounce } from 'usehooks-ts'

import { CodeBlockConfig } from '@/components/editor/code'
import { RUNNABLE_LANGUAGES } from '@/components/editor/code/constants'
import { Images, imagesJSONSchema } from '@/components/editor/code/schemas'
import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { api } from '@/convex/_generated/api'
import { useBlockFocus } from '@/hooks/use-block-focus'
import { useEditorContext } from '@/hooks/use-editor-context'
import { useJSRunner } from '@/hooks/use-js-runner'
import { usePythonRunner } from '@/hooks/use-python-runner'
import { useResizable } from '@/hooks/use-resizable'
import { upload } from '@/lib/client-uploads'
import { ansiToSpans, capitalizeFirstLetter, cn } from '@/lib/utils'

interface LanguageCommandItemProps {
  lang: { key: string; value: string }
  selected: boolean
  onSelect: (_selected: string) => void
}

function LanguageCommandItem({ lang, selected, onSelect }: LanguageCommandItemProps) {
  return (
    <CommandItem key={lang.key} value={lang.value} onSelect={onSelect}>
      <Check className={cn('mr-2 h-4 w-4', selected ? 'opacity-100' : 'opacity-0')} />
      {capitalizeFirstLetter(lang.value)}
    </CommandItem>
  )
}

interface LanguageDropdownProps {
  language: string
  onChange: (_lang: string) => void
}

function LanguageDropdown({ language, onChange }: Readonly<LanguageDropdownProps>) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(language)

  const languages = langNames.map(lang => ({
    key: lang.toLowerCase(),
    value: lang,
  }))

  const runnableLanguages = languages.filter(lang => RUNNABLE_LANGUAGES.includes(lang.value))
  const otherLanguages = languages.filter(lang => !RUNNABLE_LANGUAGES.includes(lang.value))

  const onSelect = (selected: string) => {
    const value = languages.find(lang => lang.key === selected)?.value
    if (!value) return
    setValue(value)
    onChange(value)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {capitalizeFirstLetter(value) || 'Select language...'}
          <ChevronsDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command className="max-h-64">
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No language found.</CommandEmpty>
          <ScrollArea className="overflow-auto">
            <CommandGroup>
              <p className="text-xs text-gray-500 px-4 py-2">Runnable</p>
              {runnableLanguages.map(lang => (
                <LanguageCommandItem lang={lang} selected={value === lang.value} onSelect={onSelect} key={lang.key} />
              ))}
              <p className="text-xs text-gray-500 px-4 py-2">Other</p>
              {otherLanguages.map(lang => (
                <LanguageCommandItem lang={lang} selected={value === lang.value} onSelect={onSelect} key={lang.key} />
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export const CodeBlock: FC<ReactCustomBlockRenderProps<CodeBlockConfig, InlineContentSchema, StyleSchema>> = ({
  block,
  editor,
}) => {
  const codeMirrorRef = useRef<HTMLDivElement>(null)
  useBlockFocus<CodeBlockConfig, InlineContentSchema, StyleSchema>(codeMirrorRef, editor, block.id)

  const code = block.props.code || ''
  const language = block.props.language || 'python'

  const [stdout, setStdout] = useState<string>(block.props.stdout || '')
  const [stderr, setStderr] = useState<string>(block.props.stderr || '')
  const [images, setImages] = useState<Images>(imagesJSONSchema.parse(block.props.images))
  const [isRunning, setIsRunning] = useState(false)
  const [isProcessingMedia, setIsProcessingMedia] = useState(false)

  const editorContext = useEditorContext()
  const getUploadUrl = useAction(api.uploads.getUploadUrl)

  const stdoutHandler = useCallback((msg: string) => setStdout((prev: string) => `${prev}\n${msg}`.trim()), [])

  const stderrHandler = useCallback((msg: string) => setStderr((prev: string) => `${prev}\n${msg}`.trim()), [])

  const imageHandler = useCallback(
    (format: string, b64Data: string) => {
      const toURL = async (format: string, b64Data: string) => {
        const dataUrl = `data:${format};base64,${b64Data}`

        if (!editorContext.authenticated || !editorContext.savable) {
          return new URL(dataUrl)
        }

        const response = await fetch(dataUrl)
        const blob = await response.blob()
        const file = new File([blob], 'image.png', { type: blob.type })

        const uploadUrl = await getUploadUrl({})
        const azBlobUrl = await upload(file, uploadUrl)

        return azBlobUrl
      }

      setIsProcessingMedia(true)
      toURL(format, b64Data).then(url => {
        setIsProcessingMedia(false)
        if (!url) {
          toast.error('Failed to upload media.')
          return
        }
        setImages(prev => [...prev, url])
      })
    },
    [getUploadUrl, editorContext],
  )

  const { runner: pythonRunner, loaded: pythonLoaded } = usePythonRunner()
  const { runner: jsRunner, loaded: jsLoaded } = useJSRunner()

  const handleInputChange = useCallback(
    ({ code, language, height }: { code?: string; language?: string; height?: number }) => {
      editor.updateBlock(block.id, {
        props: {
          ...block.props,
          language: language ?? block.props.language,
          code: code ?? block.props.code,
          height: height ?? block.props.height,
        },
      })
    },
    [block.id, block.props, editor],
  )

  const runCode = useCallback(async () => {
    const runnerConfig = {
      python: { runner: pythonRunner, loaded: pythonLoaded },
      javascript: { runner: jsRunner, loaded: jsLoaded },
      typescript: { runner: jsRunner, loaded: jsLoaded },
    }

    const config = runnerConfig[language as keyof typeof runnerConfig]

    if (!config) {
      toast.error('Unsupported language')
      return
    }

    if (!config.runner || !config.loaded) {
      toast.error(`Hang tight, ${language} runner is still getting ready...`)
      return
    }

    setStdout('')
    setStderr('')
    setImages([])
    setIsRunning(true)

    try {
      if (language === 'python' && 'runPython' in config.runner) {
        await config.runner.runPython(code, stdoutHandler, stderrHandler, imageHandler)
      } else if ((language === 'javascript' || language === 'typescript') && 'runJS' in config.runner) {
        await config.runner.runJS(code, language, stdoutHandler, stderrHandler)
      } else {
        throw new Error('Unexpected runner configuration')
      }
    } catch (error) {
      toast.error('An error occurred while running the code.')
    } finally {
      setIsRunning(false)
    }
  }, [pythonRunner, jsRunner, pythonLoaded, jsLoaded, language, code, stdoutHandler, stderrHandler, imageHandler])

  useEffect(() => {
    editor.updateBlock(block.id, {
      props: {
        ...block.props,
        stdout: stdout,
        stderr: stderr,
        images: JSON.stringify(images),
      },
    })
  }, [stdout, stderr, images, editor, block.id, block.props])

  const { theme } = useTheme()
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

  const runnable = RUNNABLE_LANGUAGES.includes(language)

  const { height, handleMouseDown, isResizing } = useResizable(block.props.height || 300, 100, 1000)
  const debouncedHeight = useDebounce(height, 1000)

  useEffect(() => {
    handleInputChange({ height: debouncedHeight })
  }, [debouncedHeight, handleInputChange])

  return (
    <div className="w-full border border-gray-200 rounded-lg dark:border-none">
      <div className="flex text-sm p-2 bg-background rounded-t-lg justify-between">
        <LanguageDropdown language={language} onChange={lang => handleInputChange({ language: lang })} />
        {runnable && (
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={runCode}>
                  {isRunning ? <Spinner /> : <Play size={16} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Run code</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setStdout('')
                    setStderr('')
                    setImages([])
                  }}
                >
                  <Delete size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear output</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
      <div ref={codeMirrorRef}>
        <ReactCodeMirror
          id={block?.id}
          placeholder={'Write your code here...'}
          extensions={[langs[language as keyof typeof langs]()]}
          value={code}
          theme={editorTheme}
          editable={editor.isEditable}
          width="100%"
          onChange={value => handleInputChange({ code: value })}
          height={`${height}px`}
        />
        <div
          className={clsx(
            'flex justify-center text-xs bg-secondary dark:bg-secondary-dark dark:text-gray-200 text-gray-700 p-2 cursor-row-resize',
            isResizing && 'bg-blue-200 dark:bg-blue-800',
          )}
          onMouseDown={handleMouseDown}
        >
          <ChevronsDown className="mr-2 h-4 w-4" />
        </div>
      </div>

      <div>
        {stdout && (
          <div className={clsx('font-mono p-4 bg-background border-green-600 border-l-4', stderr || 'rounded-b-lg')}>
            {stdout.split('\n').map((line, index) => (
              <div key={index}>{ansiToSpans(line)}</div>
            ))}
          </div>
        )}
        {stderr && (
          <div className="font-mono p-4 bg-background rounded-b-lg border-red-600 border-l-4">
            {stderr.split('\n').map((line, index) => (
              <div key={index}>
                {index === 0 && <CircleAlert className="mr-4 my-2 inline-block text-red-600" />}
                {ansiToSpans(line)}
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        className={clsx(
          'w-full place-items-center grid',
          images.length >= 2 ? 'grid-cols-2' : 'grid-cols-1',
          isProcessingMedia && 'h-64',
        )}
      >
        {isProcessingMedia ? (
          <Spinner />
        ) : (
          images.map((url, index) => <img key={index} src={url.href} alt="Image output" />)
        )}
      </div>
    </div>
  )
}
