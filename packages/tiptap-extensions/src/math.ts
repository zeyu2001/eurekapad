import { Node } from '@tiptap/core'

const INPUT_REGEX = /\$\$(.*?[^\\])\$\$/gi // matches for text inside $$

export const InlineMathExtension = Node.create({
  name: 'mathInline', // this must match the name of the inlineContentSpec
  content: 'text*',
  group: 'inline',
  inline: true,
  atom: true,
  marks: '',
  draggable: true,
  selectable: true,

  addInputRules() {
    // when a user types $$...$$, add a new math node
    return [
      {
        find: INPUT_REGEX,
        type: this.type,
        handler: ({ range: { from, to }, match, state }) =>
          state.tr.replaceWith(from, to, this.type.create(null, state.schema.text(match[1]))),
      },
    ]
  },
})
