import { Extension } from '@tiptap/core'

export const ArrowConversionExtension = Extension.create({
  name: 'arrowConversion',
  addInputRules: () => [
    {
      find: /->/g,
      handler: ({ state, range: { from, to } }) => {
        console.log(from)
        console.log(to)
        return state.tr.replaceWith(from, to, state.schema.text('→'))
      },
    },
  ],
})
