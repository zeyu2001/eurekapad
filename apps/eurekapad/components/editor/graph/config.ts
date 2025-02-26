import { defaultProps } from '@blocknote/core'

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

export const graphBlockConfig: GraphBlockConfig = {
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
