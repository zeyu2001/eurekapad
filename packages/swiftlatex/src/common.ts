export class CompileResult {
  pdf: Uint8Array | undefined = undefined
  status: number = -254
  log: string = 'No log'
}

export enum EngineStatus {
  Init = 1,
  Ready,
  Busy,
  Error,
}
