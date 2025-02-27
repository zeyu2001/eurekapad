import { InlineContentSchema, StyleSchema } from '@blocknote/core'
import { ReactCustomBlockRenderProps } from '@blocknote/react'
import { usePathname } from 'next/navigation'
import { FC, useEffect, useRef } from 'react'

import { GraphBlockConfig } from './config'

export const GraphBlock: FC<ReactCustomBlockRenderProps<GraphBlockConfig, InlineContentSchema, StyleSchema>> = ({
  block,
  editor,
}) => {
  const pathname = usePathname()
  const graphRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!graphRef.current) return

    const calculator = Desmos.GraphingCalculator(graphRef.current, {
      keypad: !pathname?.startsWith('/preview'),
    })

    // @ts-expect-error desmos is typed wrongly here
    calculator.observeEvent('change', ({ isUserInitiated }: { isUserInitiated: boolean }) => {
      if (isUserInitiated)
        editor.updateBlock(block.id, {
          props: {
            ...block.props,
            state: JSON.stringify(calculator.getState()),
          },
        })
    })

    return () => calculator.destroy()
  }, [block.id, block.props, editor, pathname])

  return <div ref={graphRef} className="flex h-96 w-full items-center justify-center"></div>
}
