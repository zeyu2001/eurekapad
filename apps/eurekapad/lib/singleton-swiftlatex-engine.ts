import { PdfTeXEngine } from '@eurekapad/swiftlatex'
import { CompileResult } from '@eurekapad/swiftlatex/dist/common'

const WORKER_PATH = '/_next/static/swiftlatex/swiftlatexpdftex.js'

export class SingletonSwiftLatexEngine {
  private static instance: SingletonSwiftLatexEngine
  private idle: Promise<void> = Promise.resolve()
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

  public compile(latex: string) {
    return this.idle.then(() => {
      return new Promise<CompileResult>((resolve, _reject) => {
        this.engine.flushCache
        this.engine.writeMemFSFile('main.tex', latex)
        this.engine.setEngineMainFile('main.tex')
        this.engine.compileLaTeX().then(result => {
          resolve(result)
        })
      })
    })
  }

  public async initEngine() {
    await this.engine.loadEngine(WORKER_PATH)
  }
}
