'use client'

import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you

import { useChat } from '@ai-sdk/react'
import { Loader2, SendIcon, WrenchIcon } from 'lucide-react'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import { toast } from 'sonner'

import { createCodeBlock, createGraph, createMathBlock, createParagraph } from '@/components/editor/ai/client-tools'
import type { InlineChatFormProps } from '@/components/editor/index'
import { CustomPartialBlock } from '@/components/editor/schema'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

const InlineChatForm = ({ refs, strategy, x, y, editor, update }: InlineChatFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const pendingBlocks = useRef<CustomPartialBlock[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  const selectedBlock = editor.getTextCursorPosition().block

  const {
    messages: allMessages,
    input,
    handleInputChange,
    handleSubmit,
  } = useChat({
    api: '/api/inlineChat',
    maxSteps: 10,

    initialMessages: [
      {
        id: '1',
        role: 'system',
        content: `Current block: ${selectedBlock.id}\nDocument content: ${JSON.stringify(editor.document)}`,
      },
    ],

    onFinish(message, { finishReason }) {
      if (finishReason === 'stop') {
        setTimeout(() => {
          editor.insertBlocks(pendingBlocks.current, selectedBlock.id, 'after')
          pendingBlocks.current = []
        }, 0)

        setIsLoading(false)
        if (pendingBlocks.current.length > 0) {
          toast.success('Blocks inserted successfully.')
        }
      }
    },

    // run client-side tools that are automatically executed:
    async onToolCall({ toolCall }) {
      const toolHandlers = {
        createParagraph,
        createGraph,
        createMathBlock,
        createCodeBlock,
      }

      console.log('Tool call:', toolCall.toolName, toolCall.args)
      if (toolCall.toolName in toolHandlers) {
        // @ts-expect-error toolCall.args is not typed
        const { block, message } = toolHandlers[toolCall.toolName as keyof typeof toolHandlers](toolCall.args)
        pendingBlocks.current.push(block)
        return message
      } else {
        console.error('Unknown tool call:', toolCall.toolName, toolCall.args)
        return 'Unknown tool call'
      }
    },
  })

  const messages = allMessages.slice(1)

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (input.length < 5) {
      toast.error('Please enter a longer query.')
      return
    }

    if (!selectedBlock) {
      toast.error('Please select a block to insert the response into.')
      return
    }

    handleSubmit(event)
    setIsLoading(true)
    update()
  }

  // Scroll down to the latest message when it is added
  useEffect(() => {
    if (scrollRef.current) {
      const lastChild = scrollRef.current.lastElementChild
      if (lastChild && !lastChild.checkVisibility()) {
        lastChild.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }
    }
  }, [messages])

  return (
    <Card
      className="w-3/4"
      ref={refs.floating as React.RefObject<HTMLDivElement>}
      style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}
    >
      <CardHeader>
        <CardDescription>Ask Euler is powered by AI. Mistakes are possible.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {messages.length > 0 && (
          <ScrollArea className="h-[300px] pr-4 [&_[data-radix-scroll-area-viewport]>:first-child]:!block">
            <div className="flex flex-col gap-3" ref={scrollRef}>
              {messages.map(message => (
                <div
                  key={message.id}
                  className={cn(
                    'flex flex-col rounded-lg p-3',
                    message.role === 'user'
                      ? 'ml-auto max-w-[60%] border border-blue-100 bg-blue-200 dark:border-blue-800 dark:bg-blue-600'
                      : 'self-start max-w-[80%] border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-700',
                  )}
                  style={{
                    alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div className="mb-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-200">
                    {message.role === 'user' && 'You'}
                    {message.role === 'assistant' && 'Euler'}
                    {message.createdAt && (
                      <span className="ml-auto">
                        {message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>

                  {message.parts.map((part, index) => {
                    switch (part.type) {
                      case 'text':
                        return (
                          <div className="my-2 space-y-2 text-sm *:space-y-2" key={index}>
                            <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                              {part.text}
                            </Markdown>
                          </div>
                        )
                      case 'tool-invocation':
                        {
                          const callId = part.toolInvocation.toolCallId
                          switch (part.toolInvocation.state) {
                            case 'partial-call':
                              return (
                                <div key={callId} className="my-2 space-y-2 text-xs">
                                  <div className="flex items-center text-sm font-semibold">
                                    <Loader2 className=" mr-1 inline-block size-3 animate-spin" />
                                    Calling {part.toolInvocation.toolName}...
                                  </div>
                                </div>
                              )
                            case 'call':
                              return (
                                <div key={callId} className="my-2 space-y-2 text-xs">
                                  <div className="flex items-center text-sm font-semibold">
                                    <Loader2 className=" mr-1 inline-block size-3 animate-spin" />
                                    Calling {part.toolInvocation.toolName}...
                                  </div>
                                </div>
                              )
                            case 'result':
                              return (
                                <div key={callId} className="my-2 space-y-2 text-xs">
                                  <div className="flex items-center text-sm font-semibold">
                                    <WrenchIcon className="mr-1 inline-block" size={12} />
                                    Called {part.toolInvocation.toolName}
                                  </div>
                                  <pre className="overflow-x-auto rounded bg-gray-50 p-1 dark:bg-gray-800">
                                    {part.toolInvocation.result}
                                  </pre>
                                </div>
                              )
                          }
                        }
                        break
                    }
                  })}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <form onSubmit={handleFormSubmit} className="w-full">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Plot a graph of y = x^2"
              className="flex-1"
              value={input}
              onChange={handleInputChange}
              disabled={isLoading}
              autoFocus
            />
            <Button type="submit" variant="outline" className="aspect-square p-2" disabled={isLoading}>
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : <SendIcon className="size-4" />}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default InlineChatForm
