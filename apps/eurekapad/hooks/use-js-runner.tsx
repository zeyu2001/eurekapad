import { useEffect, useState } from 'react'

import { SingletonJSRunner } from '@/lib/singleton-js-runner'

export const useJSRunner = (language: string) => {
  const [runner, setRunner] = useState<SingletonJSRunner | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (language !== 'javascript' && language !== 'typescript') return
    const runner = SingletonJSRunner.getInstance()

    setRunner(runner)

    if (runner.isLoaded()) {
      setLoaded(true)
      return
    }

    runner.initJS().then(() => {
      setLoaded(true)
    })
  }, [])

  return { runner, loaded }
}
