import { InlineContentSchema, StyleSchema } from '@blocknote/core'
import { ReactCustomBlockRenderProps } from '@blocknote/react'
import { usePathname } from 'next/navigation'
import { FC, useEffect, useRef } from 'react'

import { GraphBlockConfig } from './config'
import { graphStateJSONSchema, graphStateSchema } from './schemas'

export const GraphBlock: FC<ReactCustomBlockRenderProps<GraphBlockConfig, InlineContentSchema, StyleSchema>> = ({
  block,
  editor,
}) => {
  const pathname = usePathname()
  const graphRef = useRef<HTMLDivElement>(null)
  const calculatorRef = useRef<Desmos.Calculator | null>(null)

  // Initialize calculator only once
  useEffect(() => {
    if (!graphRef.current) return

    calculatorRef.current = Desmos.GraphingCalculator(graphRef.current, {
      keypad: !pathname?.startsWith('/preview'),
    })

    return () => {
      calculatorRef.current?.destroy()
      calculatorRef.current = null
    }
  }, [pathname])

  // Update calculator state when state changes externally (e.g. from upstream changes)
  useEffect(() => {
    const calculator = calculatorRef.current
    if (!calculator) return

    const editorStateResult = graphStateJSONSchema.safeParse(block.props.state)
    if (editorStateResult.success) {
      const currentStateResult = graphStateSchema.safeParse(calculator.getState())
      // Only update calculator if states are different
      // This will prevent the currently typing user from losing focus, while other users will lose focus
      // and see the updated state
      if (
        currentStateResult.success &&
        JSON.stringify(currentStateResult.data) !== JSON.stringify(editorStateResult.data)
      ) {
        calculator.setState(editorStateResult.data) // this causes the calculator to lose focus
      }
    }
  }, [block.props.state])

  useEffect(() => {
    const calculator = calculatorRef.current
    if (!calculator) return

    const handleChange = () => {
      const result = graphStateSchema.safeParse(calculator.getState())
      if (!result.success) return

      editor.updateBlock(block.id, {
        props: {
          ...block.props,
          state: JSON.stringify(result.data),
        },
      })
    }

    calculator.observeEvent('change', handleChange)

    return () => {
      calculator.unobserveEvent('change')
    }
  }, [block.id, block.props, editor])

  return <div ref={graphRef} className="flex h-96 w-full items-center justify-center"></div>
}
