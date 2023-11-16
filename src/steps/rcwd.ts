import { getValidRemotePath, globals } from "../globals";
import { StepI } from "./step";

export class RemoteCwdStep extends StepI {
  public id = `rcwd`;
  public description = `Sets the current working directory on the remote system`;
  public requiredParams = ['remoteDirectory'];

  public async execute(): Promise<boolean> {
    const toDirectory = getValidRemotePath(this.parameters[0]);

    // TODO: Check for optional `-create` flag to automatically create it too.

    const cmdResult = await globals.connection.sendCommand({command: `cd "${toDirectory}"`});

    if (cmdResult.code !== 0) {
      throw new Error(`Could not change directory to '${toDirectory}'. ${cmdResult.stderr}`);
    }

    globals.rcwd = toDirectory;
    console.log(`Set remote working directory to '${toDirectory}'`);
    
    return true;
  }

  validate(): boolean {
    return this.parameters.length >= this.requiredParams.length;
  }
}