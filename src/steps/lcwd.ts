import { globals } from "../globals";
import { StepI } from "./step";

export class LocalCwdStep extends StepI {
  public id = `lcwd`;
  public description = `Sets the current working directory on the local system`;
  public requiredParams = ['localDirectory'];

  public async execute(): Promise<boolean> {
    const toDirectory = this.parameters[0];
    globals.cwd = toDirectory;

    return true;
  }

  validate(): boolean {
    return this.parameters.length >= this.requiredParams.length;
  }
}