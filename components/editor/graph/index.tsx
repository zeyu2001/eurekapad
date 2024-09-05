import '@blocknote/mantine/style.css'

import { defaultProps, InlineContentSchema, StyleSchema } from '@blocknote/core'
import { createReactBlockSpec, ReactCustomBlockImplementation } from '@blocknote/react'
import { ChartLine } from 'lucide-react'

import { GraphBlock } from '@/components/editor/graph/graph-block'
import { CustomEditor } from '@/components/editor/schema'
import { insertBlockAndFocus } from '@/lib/insert-block'

export interface GraphBlockConfig {
  type: 'graph'
  isFileBlock: false
  readonly propSchema: typeof defaultProps & {
    state: {
      default: string
    }
  }
  content: 'none'
}

const graphBlockConfig: GraphBlockConfig = {
  type: 'graph',
  isFileBlock: false,
  propSchema: {
    ...defaultProps,
    state: {
      default: JSON.stringify({}),
    },
  },
  content: 'none',
}

const graphBlockImpl: ReactCustomBlockImplementation<GraphBlockConfig, InlineContentSchema, StyleSchema> = {
  render: GraphBlock,
}

export const graphBlockSpec = createReactBlockSpec<GraphBlockConfig, InlineContentSchema, StyleSchema>(
  graphBlockConfig,
  graphBlockImpl,
)

export const insertGraphBlock = (editor: CustomEditor) => ({
  title: 'Graph',
  onItemClick: () => {
    insertBlockAndFocus(editor, {
      type: 'graph',
    })
  },
  icon: <ChartLine size={16} />,
  aliases: ['graph', 'desmos'],
  group: 'Advanced',
  subtext: 'Embedded graphs, powered by Desmos',
})
