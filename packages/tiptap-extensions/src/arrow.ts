import { Extension } from '@tiptap/core'

export const ArrowConversionExtension = Extension.create({
  name: 'arrowConversion',

  addInputRules: () => [
    {
      find: /->/g,
      handler: ({ state, range: { from, to } }) => state.tr.replaceWith(from, to, state.schema.text('→')),
    },
  ],
})
