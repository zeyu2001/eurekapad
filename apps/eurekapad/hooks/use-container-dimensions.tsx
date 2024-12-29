import { useEffect, useState } from 'react'

export const useContainerDimensions = (ref: React.RefObject<HTMLElement>) => {
  const [width, setWidth] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)

  useEffect(() => {
    const handleResize = () => {
      if (!ref.current) return
      setWidth(ref.current.offsetWidth)
      setHeight(ref.current.offsetHeight)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [ref.current])

  return { width, height }
}
