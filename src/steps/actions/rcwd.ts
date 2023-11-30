import { StepI } from "../step";

export class RemoteCwdStep extends StepI {
  public readonly id = `rcwd`;
  public readonly description = `Sets the current working directory on the remote system. It will be created if it does not exist.`;
  public readonly requiredParams = ['remoteDirectory'];

  public async execute(): Promise<boolean> {
    const toDirectory = this.getValidRemotePath(this.parameters[0]);

    await this.getConnection().sendCommand({command: `mkdir -p "${toDirectory}"`});

    const cmdResult = await this.getConnection().sendCommand({command: `cd "${toDirectory}"`});

    if (cmdResult.code !== 0) {
      throw new Error(`Could not change directory to '${toDirectory}'. ${cmdResult.stderr}`);
    }

    this.state.rcwd = toDirectory;
    this.log(`Set remote working directory to '${toDirectory}'`);
    
    return true;
  }

  validate(): boolean {
    return this.parameters.length >= this.requiredParams.length;
  }
}