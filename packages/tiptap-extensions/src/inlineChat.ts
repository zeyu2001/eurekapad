import { Extension } from '@tiptap/core'
import { Plugin } from 'prosemirror-state'

export const InlineChatPlugin = Extension.create<{
  onTrigger: (node: HTMLElement | null) => void
}>({
  name: 'inlineChat',

  addOptions() {
    return {
      onTrigger: () => {},
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleKeyDown: (view, event) => {
            if (event.ctrlKey && event.key === 'i') {
              event.preventDefault()

              const { from } = view.state.selection
              const domAtPos = view.domAtPos(from)
              const node = domAtPos.node as HTMLElement
              const el = node.nodeType === 3 ? node.parentElement : node

              this.options.onTrigger(el)
              return true
            }
            return false
          },
        },
      }),
    ]
  },
})
