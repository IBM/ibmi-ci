import { globals } from "../globals";
import { StepI } from "./step";

export class CommandStep extends StepI {
  public id = `cmd`;
  public description = `Execute a command on the remote system`;
  public requiredParams: string[] = [`shellCommand`];

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
}