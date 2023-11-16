import { getValidLocalPath, globals } from "../globals";
import { StepI } from "./step";

import * as path from "path";

export class LocalCwdStep extends StepI {
  public readonly id = `lcwd`;
  public readonly description = `Sets the current working directory on the local system`;
  public readonly requiredParams = ['localDirectory'];

  public async execute(): Promise<boolean> {    
    globals.lcwd = getValidLocalPath(this.parameters[0]);

    console.log(`Set local working directory to '${globals.lcwd}'`);

    return true;
  }

  validate(): boolean {
    return this.parameters.length >= this.requiredParams.length;
  }
}