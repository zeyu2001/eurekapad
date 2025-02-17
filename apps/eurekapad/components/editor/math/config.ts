import { defaultProps } from '@blocknote/core'

export interface MathBlockConfig {
  type: 'math'
  readonly propSchema: typeof defaultProps
  content: 'inline'
}

export const mathBlockConfig: MathBlockConfig = {
  type: 'math',
  propSchema: {
    ...defaultProps,
  },
  content: 'inline',
}

export interface MathInlineConfig {
  type: string
  readonly propSchema: typeof defaultProps
  content: 'styled'
}

export const mathInlineConfig: MathInlineConfig = {
  type: 'mathInline',
  propSchema: {
    ...defaultProps,
  },
  content: 'styled',
}
