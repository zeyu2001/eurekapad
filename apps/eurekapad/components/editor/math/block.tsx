declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<MathMLElement>, MathMLElement>
    }
  }
}

import '@blocknote/mantine/style.css'
import 'mathlive'

import { InlineContentSchema, StyledText, StyleSchema } from '@blocknote/core'
import { createReactBlockSpec, ReactCustomBlockImplementation, ReactCustomBlockRenderProps } from '@blocknote/react'
import { Radical } from 'lucide-react'
import { MathfieldElement } from 'mathlive'
import { usePathname } from 'next/navigation'
import { FC, useRef, useState } from 'react'

import { useBlockFocus } from '@/hooks/use-block-focus'
import { useCustomizeMathlive } from '@/hooks/use-customize-mathlive'
import { insertBlockAndFocus } from '@/lib/insert-block'

import { CustomEditor } from '../schema'
import { MathBlockConfig, mathBlockConfig } from './config'

MathfieldElement.fontsDirectory = `${window.location.origin}/_next/static/fonts`
// Setting `soundsDirectory` to null to prevent loading of custom sounds
MathfieldElement.soundsDirectory = null

const MathBlock: FC<ReactCustomBlockRenderProps<MathBlockConfig, InlineContentSchema, StyleSchema>> = ({
  block,
  editor,
}) => {
  const pathname = usePathname() || ''
  const content = block.content[0] as StyledText<StyleSchema>
  const [latex, setLatex] = useState(content?.text || '')
  const mathFieldRef = useRef<MathfieldElement>(null)

  useCustomizeMathlive(mathFieldRef, !pathname.startsWith('/preview'), !pathname.startsWith('/preview'))
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
