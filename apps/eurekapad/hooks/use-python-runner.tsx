import { useEffect, useState } from 'react'

import { SingletonPythonRunner } from '@/lib/singleton-python-runner'

export const usePythonRunner = () => {
  const [runner, setRunner] = useState<SingletonPythonRunner | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (language !== 'python') return
    const runner = SingletonPythonRunner.getInstance()

    setRunner(runner)

    if (runner.isLoaded()) {
      setLoaded(true)
      return
    }

    runner.initPyodide().then(() => {
      setLoaded(true)
    })
  }, [])

  return { runner, loaded }
}
