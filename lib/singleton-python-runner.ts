declare global {
  interface Document {
    pyodideMplTarget: HTMLDivElement;
  }

  interface Window {
    loadPyodide: typeof loadPyodide;
  }
}

import { loadPyodide, PyodideInterface } from "pyodide";
import { RefObject } from "react";

export class SingletonPythonRunner {
  private static instance: SingletonPythonRunner;
  private pyodide!: PyodideInterface;
  private stderr: (msg: string) => void;
  private stdout: (msg: string) => void;

  private constructor(
    onStderr: (msg: string) => void,
    onStdout: (msg: string) => void
  ) {
    this.stderr = onStderr;
    this.stdout = onStdout;
  }

  public static getInstance(
    onStderr: (msg: string) => void,
    onStdout: (msg: string) => void
  ) {
    if (!SingletonPythonRunner.instance) {
      SingletonPythonRunner.instance = new SingletonPythonRunner(
        onStderr,
        onStdout
      );
    }
    return SingletonPythonRunner.instance;
  }

  private async loadPackages() {
    await this.pyodide.loadPackage("numpy");
    await this.pyodide.loadPackage("pandas");
    await this.pyodide.loadPackage("matplotlib");
  }

  public async initPyodide() {
    this.pyodide = await window.loadPyodide({
      stderr: this.stderr,
      stdout: this.stdout,
    });

    await this.loadPackages();
  }

  public runPython(code: string, mplTargetRef: RefObject<HTMLDivElement>) {
    if (!mplTargetRef.current) {
      this.stderr("No target found for matplotlib");
      return;
    }
    document.pyodideMplTarget = mplTargetRef.current;
    this.pyodide.runPythonAsync(code).catch((err) => {
      this.stderr(err.message);
    });
  }
}
