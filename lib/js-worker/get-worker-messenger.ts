// https://formsort.com/article/sandboxed-code-in-browsers/

import { WORKER_TEMPLATE } from "./worker-template";

interface IError {
  name: string;
  message: string;
  stack: string;
}

interface IResult {
  stdout: unknown;
  error?: IError;
}

interface ICallback {
  (_error: Error | undefined, _stdout: unknown): void;
}

export const getWorkerMessenger = () => {
  const sendMessage = (
    functionBody: string,
    args: unknown[] = [],
    callback: ICallback,
  ) => {
    const blob = new Blob(
      [WORKER_TEMPLATE.replace("FUNCTION_BODY_PLACEHOLDER", functionBody)],
      {
        type: "application/javascript",
      },
    );

    const workerURL = URL.createObjectURL(blob);
    const worker = new Worker(workerURL);

    const cleanup = () => {
      worker.terminate();
      // Release memory as we may have many and large functions
      URL.revokeObjectURL(workerURL);
    };

    worker.onmessage = ({ data: { stdout, error } }: { data: IResult }) => {
      callback(error, stdout);
    };

    worker.onerror = (err) => {
      err.preventDefault();
      err.stopPropagation();
      let error = err.error;
      if (!error) {
        error = new SyntaxError(err.message, err.filename, err.lineno);
      }
      callback(error, undefined);
    };

    // Kill the worker after 60 seconds
    setTimeout(() => {
      cleanup();
      callback(new Error("Execution timed out"), undefined);
    }, 60000);

    worker.postMessage(args);
  };
  sendMessage.type = "worker";
  return sendMessage;
};
