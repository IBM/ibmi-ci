import { StepI } from "../step";

export class CommandStep extends StepI {
  public readonly id = `cmd`;
  public readonly description = `Execute a command on the remote system`;
  public readonly requiredParams: string[] = [`shellCommand`];

  public async execute(): Promise<boolean> {
    const command = this.parameters[0];
    const fromDirectory = this.state.rcwd;

    console.log(`${fromDirectory} $ ${command}`);

    const cmdResult = await this.getConnection().sendCommand({
      command,
      directory: fromDirectory,
      onStdout: (chunk) => {
        process.stdout.write(chunk.toString());
      },
      onStderr: (chunk) => {
        process.stdout.write(chunk.toString());
      }
    });

    console.log(``);

    return cmdResult.code === 0;
  }

  public validateParameters(): boolean {
    return this.parameters.length === this.requiredParams.length;
  }
}