import { useCallback, useEffect, useRef, useState } from 'react'

export const useResizable = (initialHeight: number, minHeight: number, maxHeight: number) => {
  const [height, setHeight] = useState(initialHeight)
  const [isResizing, setIsResizing] = useState(false)
  const startY = useRef(0)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true)
    startY.current = e.clientY
    e.preventDefault()
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return
      const deltaY = e.clientY - startY.current
      const newHeight = Math.min(maxHeight, Math.max(minHeight, height + deltaY))
      if (newHeight !== height) {
        setHeight(height => height + deltaY)
        startY.current = e.clientY
      }
    },
    [height, isResizing, maxHeight, minHeight],
  )

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return { height, handleMouseDown, isResizing }
}
