import { SendIcon } from 'lucide-react'
import { toast } from 'sonner'

import { InlineChatFormProps } from '@/components/editor/index'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const InlineChatForm = ({ refs, strategy, x, y, editor, inlineChatMutation }: InlineChatFormProps) => {
  return (
    <Card
      className="w-3/4"
      ref={refs.floating as React.RefObject<HTMLDivElement>}
      style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}
    >
      <CardHeader>
        <CardDescription>Ask EurekaPad is powered by AI. Mistakes are possible.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={async event => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const query = formData.get('query') as string
            const selectedBlock = editor.getTextCursorPosition().block
            const documentBlocks = editor.document
            if (query.length < 5) {
              toast.error('Please enter a longer query.')
              return
            }
            if (!selectedBlock) {
              toast.error('Please select a block to insert the response into.')
              return
            }
            const { response, newBlocks, toolCalls } = await inlineChatMutation.mutateAsync({
              query,
              selectedBlock: selectedBlock.id,
              documentBlocks,
            })
            editor.insertBlocks(newBlocks, selectedBlock.id, 'after')
            console.log('Tool Calls:', toolCalls)
            console.log('Response:', response)
          }}
        >
          <div className="grid w-full items-center gap-4">
            <div className="flex items-center space-x-2">
              <Input id="query" placeholder="Plot a graph of y = x^2" className="flex-1" name="query" />
              <Button type="submit" variant="outline" className="aspect-square p-2">
                <SendIcon className="size-4" />
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default InlineChatForm
