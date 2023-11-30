import { StepI } from "../step";

import * as path from "path";

export class LocalCwdStep extends StepI {
  public readonly id = `lcwd`;
  public readonly description = `Sets the current working directory on the local system`;
  public readonly requiredParams = ['localDirectory'];

  public async execute(): Promise<boolean> {    
    this.getState().lcwd = this.getValidLocalPath(this.parameters[0]);

    this.log(`Set local working directory to '${this.getState().lcwd}'`);

    return true;
  }

  validate(): boolean {
    return this.parameters.length >= this.requiredParams.length;
  }
}