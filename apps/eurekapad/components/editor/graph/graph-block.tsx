import 'desmos'

import { InlineContentSchema, StyleSchema } from '@blocknote/core'
import { ReactCustomBlockRenderProps } from '@blocknote/react'
import { usePathname } from 'next/navigation'
import { FC, useEffect, useRef, useState } from 'react'

import { GraphBlockConfig } from '.'
import { graphStateJSONSchema } from './schemas'
import { GraphState } from './types'

export const GraphBlock: FC<ReactCustomBlockRenderProps<GraphBlockConfig, InlineContentSchema, StyleSchema>> = ({
  block,
  editor,
}) => {
  const pathname = usePathname()
  const result = graphStateJSONSchema.safeParse(block.props.state)

  const graphRef = useRef<HTMLDivElement>(null)
  const [graphState, setGraphState] = useState<GraphState | null>(result.error ? null : result.data)

  const updateEditor = () => {
    editor.updateBlock(block.id, {
      props: {
        ...block.props,
        state: JSON.stringify(graphState),
      },
    })
  }

  // can only initialize GraphingCalculator after graphRef is mounted
  useEffect(() => {
    if (!graphRef.current) return

    const calculator = Desmos.GraphingCalculator(graphRef.current, { keypad: !pathname.startsWith('/preview') })

    if (graphState) calculator.setState(graphState)

    calculator.observeEvent('change', () => {
      setGraphState(calculator.getState() as GraphState)
    })

    // on subsequent callbacks, a duplicate graph is appended to the graphRef
    // this is a workaround to remove the duplicate graphs
    while (graphRef.current.children.length > 1) graphRef.current.removeChild(graphRef.current.lastChild as ChildNode)
  }, [graphRef, graphState, pathname])

  return (
    <div
      ref={graphRef}
      // update when Desmos input loses focus,
      // otherwise interactive element will lose focus while user is still typing
      onBlur={updateEditor}
      className="w-full h-96 flex items-center justify-center"
    ></div>
  )
}
