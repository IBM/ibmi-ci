import { globals } from "../globals";
import { StepI } from "./step";

export class CommandStep extends StepI {
  public readonly id = `cmd`;
  public readonly description = `Execute a command on the remote system`;
  public readonly requiredParams: string[] = [`shellCommand`];

  public async execute(): Promise<boolean> {
    const command = this.parameters[0];
    const fromDirectory = globals.rcwd;

    console.log(`${fromDirectory} $ ${command}`);

    const cmdResult = await globals.connection.sendCommand({
      command,
      directory: fromDirectory,
      onStdout: (chunk) => {
        console.log(chunk.toString());
      },
      onStderr: (chunk) => {
        console.log(chunk.toString());
      }
    });

    return cmdResult.code === 0;
  }

  public validateParameters(): boolean {
    return this.parameters.length === this.requiredParams.length;
  }
}