import { InlineContent, StyledText, StyleSchema } from '@blocknote/core'

import { CustomBlock, CustomEditor, CustomInlineContentSchema } from '@/components/editor/schema'
import { INLINE_MATH_REGEX } from '@/lib/constants'

export const mathShortcutAction = (editor: CustomEditor) => (b: CustomBlock) => {
  const newContent = []
  if (!Array.isArray(b.content)) return

  for (const content of b.content as InlineContent<CustomInlineContentSchema, StyleSchema>[]) {
    if (content.type === 'text') {
      const textContent = content as StyledText<StyleSchema>
      if (!INLINE_MATH_REGEX.test(textContent.text)) continue

      const parts = textContent.text.split(INLINE_MATH_REGEX)

      newContent.push({
        ...textContent,
        text: parts[0],
      })

      newContent.push({
        type: 'mathInline',
        content: [
          {
            type: 'text',
            text: parts[1],
            styles: {},
          } as StyledText<StyleSchema>,
        ],
        styles: {},
      })

      newContent.push({
        ...textContent,
        text: parts[2],
      })
    } else {
      newContent.push(content)
    }
  }

  editor.updateBlock(b.id, {
    content: newContent,
  })

  // TODO: Set cursor position to the end of the inserted math content
  editor.setTextCursorPosition(b.id, 'end')
}
