import * as swc from '@swc/wasm-web';
import { RefObject } from 'react';

export class SingletonJSRunner {
  private static instance: SingletonJSRunner;
  private loaded: boolean = false;
  private idle: Promise<void> = Promise.resolve();

  private constructor() {}

  public static getInstance() {
    if (!SingletonJSRunner.instance) {
      SingletonJSRunner.instance = new SingletonJSRunner();
    }
    return SingletonJSRunner.instance;
  }

  public isLoaded() {
    return this.loaded;
  }

  public async initJS() {
    // Initialize SWC
    await swc.default();
    this.loaded = true;
  }

  public async runJS(
    code: string,
    language: string,
    mediaTargetRef: RefObject<HTMLDivElement>,
    stdout: (_msg: string) => void,
    stderr: (_msg: string) => void
  ) {
    if (!this.loaded) {
      throw new Error("JS runner is not loaded yet");
    }

    // Ensure that only one execution is running at a time
    this.idle = this.idle.then(() => this._runJS(code, language, mediaTargetRef, stdout, stderr));
    return this.idle;
  }

  private async _runJS(
    code: string,
    language: string,
    mediaTargetRef: RefObject<HTMLDivElement>,
    stdout: (_msg: string) => void,
    stderr: (_msg: string) => void
  ) {
    try {
      // Determine the filename based on the language
      const filename = language === 'typescript' ? 'input.ts' : 'input.js';

      // Transpile the code using SWC
      const transpiledOutput = await swc.transform(code, {
        filename,
        jsc: {
          parser: {
            syntax: language === 'typescript' ? 'typescript' : 'ecmascript',
          },
          target: 'es2022',
        },
        module: {
          type: 'commonjs',
        },
      });

      const transpiledCode = transpiledOutput.code;

      // Create a sandboxed environment
      const sandbox = {
        console: {
          log: (...args: any[]) => stdout(args.join(' ')),
          error: (...args: any[]) => stderr(args.join(' '))
        },
        document: {
          getElementById: (id: string) => mediaTargetRef.current?.querySelector(`#${id}`),
        },
      };

      // Execute the code in the sandbox
      const result = new Function('sandbox', `with(sandbox){${transpiledCode}}`)(sandbox);

      return result;
    } catch (error) {
      if (error instanceof Error) {
        stderr(error.toString());
      } else {
        stderr('An unknown error occurred');
      }
    }
  }
}