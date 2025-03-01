import { ContentsManager, type KernelMessage } from '@jupyterlab/services'
import type { IDisplayDataMsg, IInputRequestMsg, IStreamMsg } from '@jupyterlab/services/lib/kernel/messages'
import { PyodideKernel } from '@jupyterlite/pyodide-kernel'

import { PYODIDE } from './constants'

const handleMessage = (msg: KernelMessage.IMessage<KernelMessage.MessageType>) => {
  SingletonPythonRunner.getInstance().sendMessage(msg)
}

export class SingletonPythonRunner {
  private static instance: SingletonPythonRunner
  private kernel!: PyodideKernel
  private loaded: boolean = false
  private idle: Promise<void> = Promise.resolve()
  private stdout: (_msg: string) => void = () => {}
  private stderr: (_msg: string) => void = () => {}
  private image: (_format: string, _b64Data: string) => void = () => {}

  private constructor() {}

  public static getInstance() {
    if (!SingletonPythonRunner.instance) {
      SingletonPythonRunner.instance = new SingletonPythonRunner()
    }
    return SingletonPythonRunner.instance
  }

  public isLoaded() {
    return this.loaded
  }

  public async initPyodide() {
    this.kernel = new PyodideKernel({
      id: 'pyodide',
      name: 'Python',
      location: '',
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
    })
    // @ts-expect-error: _parent is a private property
    // this should have been a parent Jupyter kernel, but we don't need it
    this.kernel._parent = new Object()

    await this.kernel.ready
    this.loaded = true
    console.log('Pyodide kernel ready')
  }

  public sendMessage(msg: KernelMessage.IMessage<KernelMessage.MessageType>) {
    console.log('[+] Message received', msg)

    if (msg.channel === 'iopub') {
      switch (msg.header.msg_type) {
        case 'stream': {
          const message = msg as IStreamMsg
          if (message.content.name === 'stdout') {
            this.stdout(message.content.text)
          } else if (message.content.name === 'stderr') {
            this.stderr(message.content.text)
          }
          break
        }
        case 'display_data': {
          const message = msg as IDisplayDataMsg
          const formats = Object.keys(message.content.data).filter(key => key.startsWith('image/'))
          if (formats.length > 0) {
            const format = formats[0]
            const data = message.content.data[format] as string
            this.image(format, data)
          }
          break
        }
      }
    } else if (msg.channel === 'stdin') {
      switch (msg.header.msg_type) {
        case 'input_request': {
          const message = msg as IInputRequestMsg
          // We use prompt here to block the thread, which is needed for the package
          const value = prompt(message.content.prompt) ?? ''
          // TODO: Implement hiding of input if `message.content.password` is true
          this.kernel.inputReply({ value, status: 'ok' })
          break
        }
      }
    }
  }

  private async _runPython(
    code: string,
    stdout: (_msg: string) => void,
    stderr: (_msg: string) => void,
    image: (_format: string, _b64Data: string) => void,
  ) {
    this.stdout = stdout
    this.stderr = stderr
    this.image = image

    // TODO: Before running code, we may want to consider hotpatching
    // any calls to Input, as they currently need to be 'awaited' in the code

    const result = await this.kernel.executeRequest({
      code: code,
    })

    console.log('[+] Execution result', result)

    if (result.status === 'error') {
      this.stderr(result.ename + ': ' + result.evalue)
      for (const line of result.traceback) {
        this.stderr(line)
      }
    }
  }

  public async runPython(
    code: string,
    stdout: (_msg: string) => void,
    stderr: (_msg: string) => void,
    image: (_format: string, _b64Data: string) => void,
  ) {
    if (!this.loaded) {
      throw new Error('Pyodide is not loaded yet')
    }

    // Ensure that only one execution is running at a time
    this.idle = this.idle.then(() => this._runPython(code, stdout, stderr, image))
    return this.idle
  }

  // TODO: Functionality to stop the process
  // public async stopPython() {
  //   if (!this.loaded) {
  //     throw new Error('Pyodide is not loaded yet')
  //   }
  // }
}
