import { PartialBlock } from '@blocknote/core'
import { v4 as uuidv4 } from 'uuid'

import { CustomEditor } from '@/components/editor/schema'

export const insertBlockAndFocus = (
  editor: CustomEditor,
  block: PartialBlock<
    CustomEditor['schema']['blockSchema'],
    CustomEditor['schema']['inlineContentSchema'],
    CustomEditor['schema']['styleSchema']
  >,
) => {
  const currentBlock = editor.getTextCursorPosition().block
  const id = uuidv4()
  editor.insertBlocks(
    [
      {
        id: id,
        ...block,
      },
    ],
    currentBlock,
  )
  editor.setTextCursorPosition({ id: id })
}
