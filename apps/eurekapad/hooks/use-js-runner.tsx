import { useEffect, useState } from 'react'

import { SingletonJSRunner } from '@/lib/singleton-js-runner'

export const useJSRunner = () => {
  const [runner, setRunner] = useState<SingletonJSRunner | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const runner = SingletonJSRunner.getInstance()

    setRunner(runner)

    if (runner.isLoaded()) {
      setLoaded(true)
      return
    }
    console.log('initJS')
    runner.initJS().then(() => {
      setLoaded(true)
    })
  }, [])

  return { runner, loaded }
}
