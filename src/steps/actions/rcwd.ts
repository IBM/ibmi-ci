import { getValidRemotePath, globals } from "../../globals";
import { StepI } from "../step";

export class RemoteCwdStep extends StepI {
  public readonly id = `rcwd`;
  public readonly description = `Sets the current working directory on the remote system. It will be created if it does not exist.`;
  public readonly requiredParams = ['remoteDirectory'];

  public async execute(): Promise<boolean> {
    const toDirectory = getValidRemotePath(this.parameters[0]);

    await globals.connection.sendCommand({command: `mkdir -p "${toDirectory}"`});

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