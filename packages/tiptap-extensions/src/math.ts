import { Node } from '@tiptap/core'

const INPUT_REGEX = /\$\$([^\$]*)\$\$/gi // matches for text inside $$

export const InlineMathExtension = Node.create({
  name: 'mathInline', // this must match the name of the inlineContentSpec
  content: 'text*',
  group: 'inline',
  marks: '',
  draggable: true,

  addInputRules() {
    // when a user types $$...$$, add a new math node
    return [
      {
        find: INPUT_REGEX,
        type: this.type,
        handler({ range, match, chain, state }) {
          const start = range.from
          let end = range.to
          if (match[1]) {
            const text = state.schema.text(match[1])
            chain()
              .command(({ tr }) => {
                //@ts-ignore
                tr.replaceRangeWith(start, end, this.type.create(null, text))
                return true
              })
              .run()
          }
        },
      },
    ]
  },
})
