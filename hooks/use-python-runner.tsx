import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { SingletonPythonRunner } from "@/lib/singleton-python-runner";

export const usePythonRunner = (
  setStderr: Dispatch<SetStateAction<string>>,
  setStdout: Dispatch<SetStateAction<string>>
) => {
  const [runner, setRunner] = useState<SingletonPythonRunner | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const runner = SingletonPythonRunner.getInstance(
      (msg) => setStderr((prev: string) => `${prev}\r\n${msg}`),
      (msg) => setStdout((prev: string) => `${prev}\r\n${msg}`)
    );

    setRunner(runner);
    runner.initPyodide().then(() => {
      setLoaded(true);
    });
  }, [setStderr, setStdout]);

  return { runner, loaded };
};
