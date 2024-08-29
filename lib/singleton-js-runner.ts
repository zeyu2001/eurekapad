import * as swc from "@swc/wasm-web";

import { getWorkerMessenger } from "./js-worker/get-worker-messenger";

type FunctionConstructor = {
  new (_code: string): Function;
};

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
    stdout: (_msg: string) => void,
    stderr: (_msg: string) => void,
  ) {
    if (!this.loaded) {
      throw new Error("JS runner is not loaded yet");
    }

    // Ensure that only one execution is running at a time
    this.idle = this.idle.then(() =>
      this._runJS(code, language, stdout, stderr),
    );
    return this.idle;
  }

  private async _runJS(
    code: string,
    language: string,
    stdout: (_msg: string) => void,
    stderr: (_msg: string) => void,
  ) {
    try {
      // Determine the filename based on the language
      const filename = language === "typescript" ? "input.ts" : "input.js";

      // Transpile the code using SWC
      const transpiledOutput = await swc.transform(code, {
        filename,
        jsc: {
          parser: {
            syntax: language === "typescript" ? "typescript" : "ecmascript",
          },
          target: "es2022",
        },
        module: {
          type: "commonjs",
        },
      });

      const transpiledCode = transpiledOutput.code;
      const sendMessage = getWorkerMessenger();

      const AsyncFunction = async function () {}
        .constructor as FunctionConstructor;

      return new Promise<void>((resolve, _reject) => {
        sendMessage(
          new AsyncFunction(transpiledCode).toString(),
          [],
          (error, result, done) => {
            if (error) {
              stderr(error.message);
            }
            if (result) {
              stdout(result.toString());
            }
            if (done) {
              resolve();
            }
          },
        );
      });
    } catch (error) {
      stderr(error?.toString() ?? "An unknown error occurred");
    }
  }
}
