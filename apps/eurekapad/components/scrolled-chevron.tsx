import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ScrolledChevron() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="absolute bottom-4 flex w-full justify-center">
      {!scrolled && <ChevronDown className="size-8 animate-bounce" />}
    </div>
  )
}
