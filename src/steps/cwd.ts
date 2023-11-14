import { globals } from "../globals";
import { StepI } from "./step";

export class CwdStep extends StepI {
  public async execute(): Promise<boolean> {
    if (this.parameters.length === 1) {
      const toDirectory = this.parameters[0];
      globals.cwd = toDirectory;

      return true;

    } else {
      throw new Error(`Invalid number of parameters for cwd step.`);
    }
  }
}