import * as path from "path";

import { IBMi } from "../connection/IBMi";
import { ExecutorState, LoggerFunction } from "./executor";


export class StepI {
  public id = `base`;
  public description = `Base Step Description`;
  public requiredParams: string[] = [];

  public canError = false;
  public parameters: string[] = [];
  public state: ExecutorState|undefined;
  public logger?: LoggerFunction;

  constructor() {}

  log(value: string, append: boolean = false) {
    if (this.logger) {
      this.logger(value, append);
    }
  }

  setLogger(newLogger: LoggerFunction) {
    this.logger = newLogger;
  }

  addParameter(value: string) {
    this.parameters.push(value);
  }

  async execute(): Promise<boolean> { return false };

  validateParameters(): boolean {
    return this.parameters.length >= this.requiredParams.length;
  }

  ignoreErrors(value: boolean) {
    this.canError = value;
  }

  ignoreStepError(): boolean {
    return this.canError;
  }

  getState(): ExecutorState {
    return this.state!;
  }

  setState(newState: ExecutorState) {
    this.state = newState;
  }

  getConnection(): IBMi {
    return this.state!.connection!;
  }

  getValidRemotePath(inString: string) {
    return inString.startsWith(`.`) ? path.posix.join(this.state!.rcwd, inString) : inString;
  }

  getValidLocalPath(inString: string) {
    return inString.startsWith(`.`) ? path.join(this.state!.lcwd, inString) : inString;
  }
}