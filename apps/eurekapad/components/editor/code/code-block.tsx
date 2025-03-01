import '@fortawesome/fontawesome-free/css/all.min.css'

import { InlineContentSchema, StyleSchema } from '@blocknote/core'
import { ReactCustomBlockRenderProps } from '@blocknote/react'
import { standardKeymap } from '@codemirror/commands'
import { Prec } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import { langNames, langs } from '@uiw/codemirror-extensions-langs'
import { vscodeDarkInit, vscodeLightInit } from '@uiw/codemirror-theme-vscode'
import ReactCodeMirror from '@uiw/react-codemirror'
import clsx from 'clsx'
import { useAction } from 'convex/react'
import { Check, ChevronsDown, CircleAlert, Delete, Play } from 'lucide-react'
import { useTheme } from 'next-themes'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useDebounceValue } from 'usehooks-ts'

import { CodeBlockConfig } from '@/components/editor/code/config'
import { RUNNABLE_LANGUAGES } from '@/components/editor/code/constants'
import { Images, imagesJSONSchema } from '@/components/editor/code/schemas'
import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
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

const LanguageCommandItem = ({
  lang,
  selected,
  onSelect,
}: {
  lang: { key: string; value: string }
  selected: boolean
  onSelect: (_selected: string) => void
}) => (
  <CommandItem key={lang.key} value={lang.value} onSelect={onSelect}>
    <Check className={cn('mr-2 h-4 w-4', selected ? 'opacity-100' : 'opacity-0')} />
    {capitalizeFirstLetter(lang.value)}
  </CommandItem>
)

const LanguageDropdown = ({
  language,
  onChange,
}: Readonly<{
  language: string
  onChange: (_lang: string) => void
}>) => {
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
          <ChevronsDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command className="max-h-64">
          <CommandInput placeholder="Search language..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <ScrollArea className="overflow-auto">
              <CommandGroup>
                <p className="px-4 py-2 text-xs text-gray-500">Runnable</p>
                {runnableLanguages.map(lang => (
                  <LanguageCommandItem lang={lang} selected={value === lang.value} onSelect={onSelect} key={lang.key} />
                ))}
                <p className="px-4 py-2 text-xs text-gray-500">Other</p>
                {otherLanguages.map(lang => (
                  <LanguageCommandItem lang={lang} selected={value === lang.value} onSelect={onSelect} key={lang.key} />
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
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

  const { runner: pythonRunner, loaded: pythonLoaded } = usePythonRunner(language)
  const { runner: jsRunner, loaded: jsLoaded } = useJSRunner(language)

  const handleInputChange = useCallback(
    ({ code, language, height }: { code?: string; language?: string; height?: number }) => {
      editor.updateBlock(block.id, {
        props: {
          language: language ?? block.props.language,
          code: code ?? block.props.code,
          height: height ?? block.props.height,
        },
      })
    },
    [block.id, block.props, editor],
  )

  useEffect(() => {
    // TODO: Terminate any code if still running

    // Reset stderr, stdout and images
    setStdout('')
    setStderr('')
    setImages([])
  }, [language])

  const runCode = useCallback(async () => {
    if (isRunning) {
      toast.error(`Hang tight, ${capitalizeFirstLetter(language)} runner is still running...`)
      return
    }

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
      toast.error(`Hang tight, ${capitalizeFirstLetter(language)} runner is still getting ready...`)
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
    } catch {
      toast.error('An error occurred while running the code.')
    } finally {
      setIsRunning(false)
    }
  }, [
    isRunning,
    pythonRunner,
    pythonLoaded,
    jsRunner,
    jsLoaded,
    language,
    code,
    stdoutHandler,
    stderrHandler,
    imageHandler,
  ])

  useEffect(() => {
    // https://github.com/ueberdosis/tiptap/discussions/5801#discussioncomment-11151337
    // Causes error: flushSync was called from inside a lifecycle method
    queueMicrotask(() => {
      editor.updateBlock(block.id, {
        props: {
          stdout: stdout,
          stderr: stderr,
          images: JSON.stringify(images),
        },
      })
    })
  }, [stdout, stderr, images, editor, block.id, block.props])

  const customKeymap = Prec.highest(
    keymap.of([
      {
        key: 'Mod-Enter',
        run: () => {
          if (runnable) runCode()
          return runnable
        },
      },
    ]),
  )

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
  const [debouncedHeight] = useDebounceValue(height, 1000)

  useEffect(() => {
    handleInputChange({ height: debouncedHeight })
  }, [debouncedHeight, handleInputChange])

  return (
    <div className="w-full rounded-lg border border-gray-200 dark:border-none">
      <div className="flex justify-between rounded-t-lg bg-background p-2 text-sm">
        <LanguageDropdown language={language} onChange={lang => handleInputChange({ language: lang })} />
        {runnable && (
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={runCode} disabled={isRunning}>
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
          extensions={[langs[language as keyof typeof langs](), keymap.of(standardKeymap), customKeymap]}
          value={code}
          theme={editorTheme}
          editable={editor.isEditable}
          width="100%"
          onChange={value => handleInputChange({ code: value })}
          height={`${height}px`}
        />
        <div
          className={clsx(
            'flex cursor-row-resize justify-center bg-secondary p-2 text-xs text-gray-700 dark:text-gray-200',
            isResizing && 'bg-blue-200 dark:bg-blue-800',
          )}
          onMouseDown={handleMouseDown}
        >
          <ChevronsDown className="mr-2 size-4" />
        </div>
      </div>

      <div>
        {stdout && (
          <div className={clsx('border-l-4 border-green-600 bg-background p-4 font-mono', stderr || 'rounded-b-lg')}>
            {stdout.split('\n').map((line, index) => (
              <div key={index}>{ansiToSpans(line)}</div>
            ))}
          </div>
        )}
        {stderr && (
          <div className="rounded-b-lg border-l-4 border-red-600 bg-background p-4 font-mono">
            {stderr.split('\n').map((line, index) => (
              <div key={index}>
                {index === 0 && <CircleAlert className="my-2 mr-4 inline-block text-red-600" />}
                {ansiToSpans(line)}
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        className={clsx(
          'grid w-full place-items-center',
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
