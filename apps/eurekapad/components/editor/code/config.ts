import { defaultProps } from '@blocknote/core'
import { langNames } from '@uiw/codemirror-extensions-langs'

export interface CodeBlockConfig {
  type: 'codeblock'
  isFileBlock: false
  readonly propSchema: typeof defaultProps & {
    language: {
      default: string
      values: string[]
    }
    code: {
      default: string
    }
    stdout: {
      default: string
    }
    stderr: {
      default: string
    }
    images: {
      default: string
    }
    height: {
      default: number
    }
  }
  content: 'none'
}

export const codeBlockConfig: CodeBlockConfig = {
  type: 'codeblock',
  isFileBlock: false,
  propSchema: {
    ...defaultProps,
    language: {
      default: 'python',
      values: langNames,
    },
    code: {
      default: '',
    },
    stdout: {
      default: '',
    },
    stderr: {
      default: '',
    },
    images: {
      default: JSON.stringify([]),
    },
    height: {
      default: 300,
    },
  },
  content: 'none',
}
