import { InputRule, Mark } from '@tiptap/core'

const arrowHandler: InputRule['handler'] = ({ state, range: { from, to } }) =>
  state.tr.replaceWith(from, to, state.schema.text('→'))

export const ArrowConversionExtension = Mark.create({
  name: 'arrowConversion',

  addInputRules() {
    return [
      {
        find: /->/g,
        handler: arrowHandler,
        type: this.type,
      },
    ]
  },

  addPasteRules() {
    return [
      {
        find: /->/g,
        handler: arrowHandler,
        type: this.type,
      },
    ]
  },
})
