import { useEffect, useState } from 'react'

import { SingletonSwiftLatexEngine } from '@/lib/singleton-swiftlatex-engine'

export const useSwiftLatexEngine = () => {
  const [engine, setEngine] = useState<SingletonSwiftLatexEngine | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const engine = SingletonSwiftLatexEngine.getInstance()
    setEngine(engine)

    if (engine.isLoaded()) {
      setLoaded(true)
    }

    engine.initEngine().then(() => {
      setLoaded(engine.isLoaded())
    })
  }, [])

  return { engine, loaded }
}
