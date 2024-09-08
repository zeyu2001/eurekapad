import { createReactStyleSpec } from '@blocknote/react'

export const Link = createReactStyleSpec(
  {
    type: 'link',
    propSchema: 'string',
  },
  {
    render: props => (
      <span
        className="text-blue-600 hover:underline cursor-pointer dark:text-blue-400 font-medium"
        ref={props.contentRef}
      />
    ),
  },
)
