import { StepI } from "../step";

export class CommandStep extends StepI {
  public readonly id = `cmd`;
  public readonly description = `Execute a command on the remote system`;
  public readonly requiredParams: string[] = [`shellCommand`];

  public async execute(): Promise<boolean> {
    const command = this.parameters[0];
    const fromDirectory = this.state.rcwd;

    this.log(`${fromDirectory} $ ${command}`);

    const cmdResult = await this.getConnection().sendCommand({
      command,
      directory: fromDirectory,
      onStdout: (chunk) => {
        this.log(chunk.toString(), true);
      },
      onStderr: (chunk) => {
        this.log(chunk.toString(), true);
      }
    });

    this.log(``);

    return cmdResult.code === 0;
  }

  public validateParameters(): boolean {
    return this.parameters.length === this.requiredParams.length;
  }
}