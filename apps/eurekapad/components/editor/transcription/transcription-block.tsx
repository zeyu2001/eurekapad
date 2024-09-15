import { BlockNoteEditor, BlockSchemaWithBlock, InlineContentSchema, StyledText, StyleSchema } from '@blocknote/core'
import { ReactCustomBlockRenderProps } from '@blocknote/react'
import {
  AudioConfig,
  CancellationReason,
  ResultReason,
  SpeechConfig,
  SpeechRecognitionEventArgs,
} from 'microsoft-cognitiveservices-speech-sdk'
import { FC, useCallback, useEffect, useState } from 'react'
import { AiOutlineAudio } from 'react-icons/ai'
import { FaMagic, FaRegStopCircle } from 'react-icons/fa'

import { type TranscriptionBlockConfig } from '@/components/editor/transcription'
import { Spinner } from '@/components/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useSpeechToken } from '@/hooks/use-speech-token'
import { SingletonSpeechRecognizer } from '@/lib/singleton-recognizer'

const TranscriptionComponent = ({
  token,
  region,
  contentRef,
  blockId,
  editor,
}: {
  token: string
  region: string
  contentRef: (_node: HTMLElement | null) => void
  blockId: string
  editor: BlockNoteEditor<
    BlockSchemaWithBlock<'transcription', TranscriptionBlockConfig>,
    InlineContentSchema,
    StyleSchema
  >
}) => {
  const [isListening, setIsListening] = useState<boolean>(false)

  const speechConfig = SpeechConfig.fromAuthorizationToken(token, region)
  speechConfig.speechRecognitionLanguage = 'en-US'

  const audioConfig = AudioConfig.fromDefaultMicrophoneInput()

  const handleRecognizing = useCallback((e: SpeechRecognitionEventArgs) => {
    console.log('Recognizing:', e.result.text)
  }, [])

  const handleRecognized = useCallback(
    (e: SpeechRecognitionEventArgs) => {
      console.log('Recognized:', e.result.text)

      const block = editor.getBlock(blockId)
      if (!block) throw new Error('Block not found')

      const content = block.content as StyledText<StyleSchema>[]
      const currText = content[0]?.text || ''

      editor.updateBlock(blockId, {
        content: [
          {
            type: 'text',
            text: `${currText}\n${e.result.text}`,
            styles: {},
          },
        ],
      })
    },
    [editor, blockId],
  )

  const handleListen = useCallback(() => {
    const recognizer = SingletonSpeechRecognizer.getInstance(speechConfig, audioConfig)

    if (isListening) {
      recognizer.startListening()

      recognizer.setRecognizingHandler((s, e) => {
        handleRecognizing(e)
      })

      recognizer.setRecognizedHandler(async (s, e) => {
        if (e.result.reason == ResultReason.RecognizedSpeech) {
          handleRecognized(e)
        } else if (e.result.reason == ResultReason.NoMatch) {
          console.log('NOMATCH: Speech could not be recognized.')
        }
      })

      recognizer.setCanceledHandler((s, e) => {
        console.log(`CANCELED: Reason=${e.reason}`)

        if (e.reason == CancellationReason.Error) {
          console.log(`"CANCELED: ErrorCode=${e.errorCode}`)
          console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`)
          console.log('CANCELED: Did you set the speech resource key and region values?')
        }

        recognizer.stopListening()
        setIsListening(false)
      })

      recognizer.setSessionStoppedHandler(() => {
        console.log('\n    Session stopped event.')
      })
    } else {
      recognizer.stopListening()
    }
  }, [isListening, speechConfig, audioConfig, handleRecognized, handleRecognizing])

  useEffect(() => {
    handleListen()
  }, [isListening, handleListen])

  return (
    <Alert>
      <div className="flex items-center justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="mb-4" variant="outline" size="icon" onClick={() => setIsListening(l => !l)}>
              {isListening ? (
                <FaRegStopCircle color="red" className="h-4 w-4" />
              ) : (
                <AiOutlineAudio className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isListening ? 'Stop recording' : 'Start recording'}</TooltipContent>
        </Tooltip>

        <Popover>
          <PopoverTrigger asChild>
            <Button className="mb-4" variant="outline">
              <FaMagic className="mr-2" /> Summary
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Stay tuned!</h4>
              <p className="text-sm text-muted-foreground">AI features are coming soon.</p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <AlertDescription className="w-full max-h-52 overflow-y-scroll my-4 bg-background">
        <div ref={contentRef} className="w-full"></div>
      </AlertDescription>
    </Alert>
  )
}

export const TranscriptionBlock: FC<
  ReactCustomBlockRenderProps<TranscriptionBlockConfig, InlineContentSchema, StyleSchema>
> = ({ block, editor, contentRef }) => {
  const { token, region } = useSpeechToken()

  if (!token || !region) {
    return (
      <div className="flex items-center h-32 w-full justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <TranscriptionComponent token={token} region={region} contentRef={contentRef} blockId={block.id} editor={editor} />
  )
}
