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
  private loaded: boolean = false;

  private constructor() {}

  public static getInstance() {
    if (!SingletonPythonRunner.instance) {
      SingletonPythonRunner.instance = new SingletonPythonRunner();
    }
    return SingletonPythonRunner.instance;
  }

  private async loadPackages() {
    await this.pyodide.loadPackage("numpy");
    await this.pyodide.loadPackage("pandas");
    await this.pyodide.loadPackage("matplotlib");
  }

  public isLoaded() {
    return this.loaded;
  }

  public async initPyodide() {
    this.pyodide = await window.loadPyodide();

    await this.loadPackages();
    this.loaded = true;
  }

  public runPython(
    code: string,
    mplTargetRef: RefObject<HTMLDivElement>,
    stdout: (msg: string) => void,
    stderr: (msg: string) => void
  ) {
    this.pyodide.setStdout({ batched: stdout });
    this.pyodide.setStderr({ batched: stderr });

    if (!mplTargetRef.current) {
      stderr("No target found for matplotlib");
      return;
    }

    document.pyodideMplTarget = mplTargetRef.current;

    try {
      this.pyodide.runPython(code);
    } catch (err) {
      stderr((err as Error).message);
    }
  }
}
