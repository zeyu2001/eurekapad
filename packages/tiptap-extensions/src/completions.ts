import { Editor, Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    inlineCompletion: {
      /**
       * fetch inline suggestions
       */
      fetchSuggestion: () => ReturnType
    }
  }
}

export const inlineCompletionPluginKey = new PluginKey('inlineCompletion')

export interface InlineCompletionOptions {
  /**
   * fetch inline suggestions
   *
   * @param existingText -  existing text in the node
   * @returns {string} - the suggestion to be shown
   */
  fetchAutocompletion: (existingText: string) => Promise<string>
}

export interface InlineCompletionStorage {
  data: {
    currentSuggestion?: string
    nodeDetails?: {
      from: number
      to: number
    }
  }
}

const triggerPaste = (pasteText: string, editor: Editor) => {
  const clipboardData = new DataTransfer()
  clipboardData.setData('text/plain', pasteText)

  const pasteEvent = new ClipboardEvent('paste', {
    clipboardData,
    bubbles: true,
    cancelable: true,
  })

  editor.view.dom.dispatchEvent(pasteEvent)
}

export const InlineCompletionExtension = Extension.create<InlineCompletionOptions, InlineCompletionStorage>({
  name: 'inlineCompletion',

  addOptions() {
    return {
      fetchAutocompletion: async () => {
        const message = 'Please add a fetchSuggestion function to fetch suggestions from.'
        console.warn(message)
        return message
      },
    }
  },

  addStorage() {
    return {
      data: {},
    }
  },

  addCommands() {
    return {
      fetchSuggestion:
        () =>
        ({ state, chain, editor }) => {
          if (this.storage.data.currentSuggestion) {
            return chain()
              .command(() => {
                // Matches e.g. a $$...$$ block or a sequence of non-whitespace
                const latexOrNonWhitespace = /(\$\$.*?\$\$|\*\*.*?\*\*|\*.*?\*|``.*?``|[^\s]+)/g
                const chunkifiedSuggestion = this.storage.data.currentSuggestion!.match(latexOrNonWhitespace) || []

                this.storage.data = {}

                for (let i = 0; i < chunkifiedSuggestion.length; i++) {
                  const token = chunkifiedSuggestion[i]
                  // If it is a LaTeX block, paste it directly
                  // Otherwise append a space because we ignored whitespaces earlier
                  const textToPaste = token.startsWith('$$') && token.endsWith('$$') ? token : token + ' '

                  setTimeout(() => triggerPaste(textToPaste, editor), 2 * i)
                }
                return true
              })
              .run()
          }

          const { $from } = state.selection

          const node = $from.parent

          const [from, to] = [$from.start() - 1, $from.end() + 1]

          const existingText = node.textContent

          if (existingText) {
            this.options.fetchAutocompletion(existingText).then(res => {
              this.storage.data = {
                currentSuggestion: res,
                nodeDetails: {
                  from,
                  to,
                },
              }

              editor.view.dispatch(editor.view.state.tr.setMeta('addToHistory', false))
            })

            return true
          }

          return false
        },
    }
  },

  addProseMirrorPlugins() {
    const getStorage = () => this.storage

    const fetchSuggestion = () => this.editor.commands.fetchSuggestion()

    const handleNonTabKey = () => (this.storage.data = {})

    return [
      new Plugin({
        key: inlineCompletionPluginKey,
        state: {
          init() {
            return DecorationSet.empty
          },
          apply(tr) {
            const storage = getStorage().data

            if (storage.currentSuggestion && storage.nodeDetails) {
              const { from, to } = storage.nodeDetails

              const decoration = Decoration.inline(from, to, {
                'data-inline-suggestion': storage.currentSuggestion,
              })

              return DecorationSet.create(tr.doc, [decoration])
            }

            return DecorationSet.empty
          },
        },
        props: {
          decorations(state) {
            return this.getState(state)
          },
          handleKeyDown(_, event) {
            if (event.key === 'Tab' && event.shiftKey) {
              event.preventDefault()

              fetchSuggestion()

              return true
            }

            handleNonTabKey()
          },
        },
      }),
    ]
  },
})
