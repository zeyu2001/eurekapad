import { PdfTeXEngine } from '@eurekapad/swiftlatex'
import { CompileResult } from '@eurekapad/swiftlatex/dist/common'

const WORKER_PATH = '/_next/static/swiftlatex/swiftlatexpdftex.js'

export class SingletonSwiftLatexEngine {
  private static instance: SingletonSwiftLatexEngine
  private idle: Promise<CompileResult> = Promise.resolve({ status: 0, log: '', pdf: undefined })
  private engine: PdfTeXEngine

  private constructor() {
    this.engine = new PdfTeXEngine()
  }

  public static getInstance() {
    if (!SingletonSwiftLatexEngine.instance) {
      SingletonSwiftLatexEngine.instance = new SingletonSwiftLatexEngine()
    }
    return SingletonSwiftLatexEngine.instance
  }

  public isLoaded() {
    return this.engine.isReady()
  }

  public compile(latex: string, files: Record<string, Uint8Array> = {}) {
    // Ensure that only one compilation is running at a time
    this.idle = this.idle.then(() => {
      this.engine.flushCache()
      this.engine.writeMemFSFile('main.tex', latex)
      this.engine.setEngineMainFile('main.tex')
      for (const [fileName, fileData] of Object.entries(files)) {
        this.engine.writeMemFSFile(fileName, fileData)
      }
      return this.engine.compileLaTeX()
    })
    return this.idle
  }

  public async initEngine() {
    await this.engine.loadEngine(WORKER_PATH)
  }
}
