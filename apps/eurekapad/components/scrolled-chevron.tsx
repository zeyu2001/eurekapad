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
    <div className="absolute bottom-4 flex justify-center w-full">
      {!scrolled && <ChevronDown className="h-8 w-8 transform animate-bounce" />}
    </div>
  )
}
