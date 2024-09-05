declare global {
  // eslint-disable-next-line unused-imports/no-unused-vars
  namespace JSX {
    // eslint-disable-next-line unused-imports/no-unused-vars
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<MathMLElement>, MathMLElement>
    }
  }
}

import '@blocknote/mantine/style.css'
import 'mathlive'

import { defaultProps, InlineContentSchema, StyledText, StyleSchema } from '@blocknote/core'
import { createReactBlockSpec, ReactCustomBlockImplementation, ReactCustomBlockRenderProps } from '@blocknote/react'
import { Radical } from 'lucide-react'
import { FC, useRef, useState } from 'react'

import { useBlockFocus } from '@/hooks/use-block-focus'
import { insertBlockAndFocus } from '@/lib/insert-block'

import { CustomEditor } from './schema'

interface MathBlockConfig {
  type: 'math'
  readonly propSchema: typeof defaultProps
  content: 'inline'
}

const mathBlockConfig: MathBlockConfig = {
  type: 'math',
  propSchema: {
    ...defaultProps,
  },
  content: 'inline',
}

const MathBlock: FC<ReactCustomBlockRenderProps<MathBlockConfig, InlineContentSchema, StyleSchema>> = ({
  block,
  editor,
}) => {
  const content = block.content[0] as StyledText<StyleSchema>
  const [latex, setLatex] = useState(content?.text || '')
  const mathFieldRef = useRef<HTMLElement>(null)

  useBlockFocus<MathBlockConfig, InlineContentSchema, StyleSchema>(mathFieldRef, editor, block.id)

  return (
    <math-field
      ref={mathFieldRef}
      onInput={evt => {
        setLatex((evt.target as HTMLInputElement).value)
        editor.updateBlock(block, {
          content: (evt.target as HTMLInputElement).value,
        })
      }}
      style={{ backgroundColor: 'transparent', width: '100%' }}
    >
      {latex}
    </math-field>
  )
}

const mathBlockImpl: ReactCustomBlockImplementation<MathBlockConfig, InlineContentSchema, StyleSchema> = {
  render: MathBlock,
}

export const mathBlockSpec = createReactBlockSpec<MathBlockConfig, InlineContentSchema, StyleSchema>(
  mathBlockConfig,
  mathBlockImpl,
)

export const insertMathBlock = (editor: CustomEditor) => ({
  title: 'Block Equation',
  onItemClick: () => {
    insertBlockAndFocus(editor, {
      type: 'math',
      props: {
        textAlignment: 'center',
      },
    })
  },
  icon: <Radical size={16} />,
  aliases: ['math', 'equation', 'latex'],
  group: 'Advanced',
  subtext: 'Display a standalone equation',
})
