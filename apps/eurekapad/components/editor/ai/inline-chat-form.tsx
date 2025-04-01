'use client'

import { Loader2, SendIcon, WrenchIcon } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import { toast } from 'sonner'

import type { InlineChatFormProps } from '@/components/editor/index'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

type MessageType = 'user' | 'assistant'

interface ChatMessage {
  id: string
  type: MessageType
  content: string
  timestamp: Date
  toolResults?: Awaited<ReturnType<InlineChatFormProps['inlineChatMutation']['mutateAsync']>>['toolResults']
}

const InlineChatForm = ({ refs, strategy, x, y, editor, inlineChatMutation, update }: InlineChatFormProps) => {
  const [chatLog, setChatLog] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const query = formData.get('query') as string

    if (query.length < 5) {
      toast.error('Please enter a longer query.')
      return
    }

    const selectedBlock = editor.getTextCursorPosition().block
    if (!selectedBlock) {
      toast.error('Please select a block to insert the response into.')
      return
    }

    // Add user message to chat log
    const userMessageId = crypto.randomUUID()
    const userMessage: ChatMessage = {
      id: userMessageId,
      type: 'user',
      content: query,
      timestamp: new Date(),
    }

    setChatLog(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    // This will cause the floating card to change in height.
    // We need to make sure it still appears above the text cursor.
    update()

    try {
      const documentBlocks = editor.document
      const { response, newBlocks, toolResults } = await inlineChatMutation.mutateAsync({
        query,
        selectedBlock: selectedBlock.id,
        documentBlocks,
      })

      // Add assistant response to chat log
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        toolResults: toolResults,
      }

      setChatLog(prev => [...prev, assistantMessage])
      update()

      // Insert blocks into the editor
      editor.insertBlocks(newBlocks, selectedBlock.id, 'after')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to get a response. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card
      className="w-3/4"
      ref={refs.floating as React.RefObject<HTMLDivElement>}
      style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}
    >
      <CardHeader>
        <CardDescription>Ask EurekaPad is powered by AI. Mistakes are possible.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {chatLog.length > 0 && (
          <ScrollArea className="h-[300px] pr-4">
            <div className="flex flex-col gap-3">
              {chatLog.map(message => (
                <div
                  key={message.id}
                  className={cn(
                    'flex flex-col rounded-lg p-3',
                    message.type === 'user'
                      ? 'ml-auto border border-blue-100 bg-blue-200 dark:border-blue-800 dark:bg-blue-600'
                      : 'border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-700',
                  )}
                  style={{
                    maxWidth: '80%',
                    alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div className="mb-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-200">
                    {message.type === 'user' && 'You'}
                    {message.type === 'assistant' && 'EurekaPad AI'}
                    <span className="ml-auto">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="text-sm">{message.content}</div>

                  {message.toolResults && message.toolResults.length > 0 && (
                    <>
                      {message.toolResults.map((toolResult, index) => (
                        <div key={index} className="mt-2 space-y-2 text-xs">
                          <div className="text-sm font-semibold">
                            <WrenchIcon className="mr-1 inline-block" size={16} />
                            {toolResult.toolName}
                          </div>
                          <div className="font-semibold">Arguments:</div>
                          <pre className="overflow-x-auto rounded bg-gray-50 p-1 dark:bg-gray-800">
                            {JSON.stringify(toolResult.args, null, 2)}
                          </pre>
                          <div className="font-semibold">Result:</div>
                          <pre className="overflow-x-auto rounded bg-gray-50 p-1 dark:bg-gray-800">
                            {toolResult.result}
                          </pre>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex items-center space-x-2">
            <Input
              id="query"
              name="query"
              placeholder="Plot a graph of y = x^2"
              className="flex-1"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              disabled={isLoading}
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
