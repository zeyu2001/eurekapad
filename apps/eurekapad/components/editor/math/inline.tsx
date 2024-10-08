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

import { defaultProps, InlineContentFromConfig, StyledText, StyleSchema } from '@blocknote/core'
import { createReactInlineContentSpec, ReactInlineContentImplementation } from '@blocknote/react'
import { MathfieldElement } from 'mathlive'
import { useEffect, useRef, useState } from 'react'

import { useCustomizeMathlive } from '@/hooks/use-customize-mathlive'

interface MathInlineConfig {
  type: string
  readonly propSchema: typeof defaultProps
  content: 'styled'
}

const mathInlineConfig: MathInlineConfig = {
  type: 'mathInline',
  propSchema: defaultProps,
  content: 'styled',
}

interface MathInlineProps {
  inlineContent: InlineContentFromConfig<MathInlineConfig, StyleSchema>
  contentRef: (_node: HTMLElement | null) => void
}

MathfieldElement.fontsDirectory = `${window.location.origin}/_next/static/fonts`
// Setting `soundsDirectory` to null to prevent loading of custom sounds
MathfieldElement.soundsDirectory = null

function MathInline({ inlineContent, contentRef }: MathInlineProps) {
  const content = inlineContent.content[0] as StyledText<StyleSchema>

  const [latex, setLatex] = useState<string>(content?.text || '')
  const mathFieldRef = useRef<MathfieldElement>(null)
  const hiddenContentRef = useRef<HTMLSpanElement | null>(null)

  useCustomizeMathlive(mathFieldRef, false, false)
  useEffect(() => {
    setLatex(content?.text || '')
  }, [content?.text])

  return (
    <>
      <span>
        <math-field
          ref={mathFieldRef}
          default-mode="inline-math"
          onInput={evt => {
            const value = (evt.target as HTMLInputElement).value
            setLatex(value)

            // Update hidden span so that BlockNote updates the block's content
            if (hiddenContentRef.current) {
              const child = hiddenContentRef.current.firstChild as HTMLSpanElement
              if (child) child.innerText = value
            }
          }}
          style={{ backgroundColor: 'transparent' }}
        >
          {latex}
        </math-field>
      </span>
      <span
        className="hidden"
        ref={el => {
          // ref callback to register multiple refs
          hiddenContentRef.current = el
          contentRef(el) // blocknote's contentRef
        }}
      ></span>
    </>
  )
}

const mathInlineImpl: ReactInlineContentImplementation<MathInlineConfig, StyleSchema> = {
  render: MathInline,
}

export const mathInlineSpec = createReactInlineContentSpec<MathInlineConfig, StyleSchema>(
  mathInlineConfig,
  mathInlineImpl,
)
