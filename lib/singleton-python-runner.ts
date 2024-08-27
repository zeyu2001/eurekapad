declare global {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface Document {
    pyodideMplTarget: HTMLDivElement;
  }
}

import { type IMimeBundle } from "@jupyterlab/nbformat";
import { ContentsManager, type KernelMessage } from "@jupyterlab/services";
import { PyodideKernel } from "@jupyterlite/pyodide-kernel";
import { type PartialJSONObject } from "@lumino/coreutils";

import { PYODIDE } from "./constants";

type StreamContent = {
  name: "stdout" | "stderr";
  text: string;
};

type DisplayDataContent = {
  data: IMimeBundle;
  metadata: PartialJSONObject;
  transient?: {
    display_id?: string;
  };
};

const handleMessage = (
  msg: KernelMessage.IMessage<KernelMessage.MessageType>
) => {
  SingletonPythonRunner.getInstance().sendMessage(msg);
};

export class SingletonPythonRunner {
  private static instance: SingletonPythonRunner;
  private kernel!: PyodideKernel;
  private loaded: boolean = false;
  private idle: Promise<void> = Promise.resolve();
  private stdout: (_msg: string) => void = () => {};
  private stderr: (_msg: string) => void = () => {};
  private image: (_format: string, _b64Data: string) => void = () => {};

  private constructor() {}

  public static getInstance() {
    if (!SingletonPythonRunner.instance) {
      SingletonPythonRunner.instance = new SingletonPythonRunner();
    }
    return SingletonPythonRunner.instance;
  }

  public isLoaded() {
    return this.loaded;
  }

  public async initPyodide() {
    this.kernel = new PyodideKernel({
      id: "pyodide",
      name: "Python",
      location: "",
      sendMessage: handleMessage,
      pyodideUrl: PYODIDE.PYODIDE_URL,
      pipliteUrls: [PYODIDE.ALL_JSON_URL],
      pipliteWheelUrl: PYODIDE.PIPLITE_WHEEL_URL,
      disablePyPIFallback: false,
      mountDrive: false,
      loadPyodideOptions: {
        lockFileURL: PYODIDE.LOCKFILE_URL,
        packages: [],
      },
      contentsManager: new ContentsManager(),
    });
    // @ts-ignore: _parent is a private property
    // this should have been a parent Jupyter kernel, but we don't need it
    this.kernel._parent = new Object();

    await this.kernel.ready;
    this.loaded = true;
    console.log("Pyodide kernel ready");
  }

  public sendMessage(msg: KernelMessage.IMessage<KernelMessage.MessageType>) {
    console.log("[+] Message received", msg);

    if (msg.channel === "iopub") {
      switch (msg.header.msg_type) {
        case "stream": {
          const content = msg.content as StreamContent;
          if (content.name === "stdout") {
            this.stdout(content.text);
          }
          break;
        }
        case "display_data": {
          const content = msg.content as DisplayDataContent;
          const formats = Object.keys(content.data).filter((key) =>
            key.startsWith("image/")
          );
          if (formats.length > 0) {
            const format = formats[0];
            const data = content.data[format] as string;
            this.image(format, data);
          }
          break;
        }
      }
    }
  }

  private async _runPython(
    code: string,
    stdout: (_msg: string) => void,
    stderr: (_msg: string) => void,
    image: (_format: string, _b64Data: string) => void
  ) {
    this.stdout = stdout;
    this.stderr = stderr;
    this.image = image;

    const result = await this.kernel.executeRequest({
      code: code,
    });

    console.log("[+] Execution result", result);

    if (result.status === "error") {
      this.stderr(result.ename + ": " + result.evalue);
      for (const line of result.traceback) {
        this.stderr(line);
      }
    }
  }

  public async runPython(
    code: string,
    stdout: (_msg: string) => void,
    stderr: (_msg: string) => void,
    image: (_format: string, _b64Data: string) => void
  ) {
    if (!this.loaded) {
      throw new Error("Pyodide is not loaded yet");
    }

    // Ensure that only one execution is running at a time
    this.idle = this.idle.then(() =>
      this._runPython(code, stdout, stderr, image)
    );
    return this.idle;
  }
}
