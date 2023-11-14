import { globals } from "../globals";
import { StepI } from "./step";

export class PushStep extends StepI {
  public async execute(): Promise<boolean> {
    if (this.parameters.length === 1) {
      const toDirectory = this.parameters[0];
      const fromDirectory = globals.cwd;

      await globals.connection.sendCommand({command: `mkdir -p "${toDirectory}"`});
      await globals.connection.uploadDirectory(fromDirectory, toDirectory);

      return true;

    } else {
      throw new Error(`Invalid number of parameters for push step.`);
    }
  }
}