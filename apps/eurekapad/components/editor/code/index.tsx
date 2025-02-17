import '@blocknote/mantine/style.css'

import { InlineContentSchema, StyleSchema } from '@blocknote/core'
import { createReactBlockSpec, ReactCustomBlockImplementation } from '@blocknote/react'
import { Code } from 'lucide-react'

import { CodeBlock } from '@/components/editor/code/code-block'
import { CustomEditor } from '@/components/editor/schema'
import { insertBlockAndFocus } from '@/lib/insert-block'

import { CodeBlockConfig, codeBlockConfig } from './config'

const codeBlockImpl: ReactCustomBlockImplementation<CodeBlockConfig, InlineContentSchema, StyleSchema> = {
  render: CodeBlock,
  toExternalHTML: ({ block }) => {
    return (
      <pre>
        {/* @ts-expect-error: data exists here */}
        <code>{block?.props?.data}</code>
      </pre>
    )
  },
}

export const codeBlockSpec = createReactBlockSpec<CodeBlockConfig, InlineContentSchema, StyleSchema>(
  codeBlockConfig,
  codeBlockImpl,
)

export const insertCodeBlock = (editor: CustomEditor) => ({
  title: 'Code Block',
  onItemClick: () => {
    insertBlockAndFocus(editor, {
      type: 'codeblock',
      props: {
        language: 'python',
      },
    })
  },
  icon: <Code size={16} />,
  aliases: ['code', 'programming'],
  group: 'Advanced',
  subtext: 'Code block with syntax highlighting',
})
