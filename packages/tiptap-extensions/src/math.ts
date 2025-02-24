import { InputRule, Mark } from '@tiptap/core'

// Matches math text via $$ as input
const mathInputRegex = /(?:^|\s)(\$\$(?!\s+\$\$)((?:[^$]+))\$\$(?!\s+\$\$))$/

// Matches math text via $$ while pasting
const mathPasteRegex = /(?:^|\s)(\$\$(?!\s+\$\$)((?:[^$]+))\$\$(?!\s+\$\$))/g

const mathInlineHandler: InputRule['handler'] = ({ range, match, chain, state }) => {
  const { from: start, to: end } = range
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
}

export const InlineMathExtension = Mark.create({
  name: 'inlineMathInput',

  addInputRules() {
    return [
      {
        find: mathInputRegex,
        handler: mathInlineHandler,
      },
    ]
  },

  addPasteRules() {
    return [
      {
        find: mathPasteRegex,
        handler: mathInlineHandler,
      },
    ]
  },
})
