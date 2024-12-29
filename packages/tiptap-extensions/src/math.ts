import { Extension } from '@tiptap/core'

const INPUT_REGEX = /\$\$(.*?[^\\])\$\$/gi // matches for text inside $$

export const InlineMathExtension = Extension.create({
  name: 'inlineMathInput',

  addInputRules() {
    return [
      {
        find: INPUT_REGEX,
        handler({ range, match, chain, state }) {
          const start = range.from
          const end = range.to
          if (match[1]) {
            const textNode = state.schema.text(match[1])

            // this should have been loaded through the blocknote schema
            const mathInlineType = state.schema.nodes.mathInline
            if (!mathInlineType) return

            chain()
              .command(({ tr }) => {
                tr.replaceRangeWith(start, end, mathInlineType.create(null, textNode))
                return true
              })
              .run()
          }
        },
      },
    ]
  },
})
