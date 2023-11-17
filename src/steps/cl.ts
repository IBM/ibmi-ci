import { globals } from "../globals";
import { StepI } from "./step";

export class ClStep extends StepI {
  public readonly id = `cl`;
  public readonly description = `Execute a CL command on the remote system`;
  public readonly requiredParams: string[] = [`clCommand`];

  public async execute(): Promise<boolean> {
    const command = this.parameters[0];
    const fromDirectory = globals.rcwd;

    console.log(`> ${fromDirectory}`);
    console.log(`> ${command}`);

    const withSystem = `system "${command}"`;

    const cmdResult = await globals.connection.remoteCommand(withSystem, fromDirectory);

    console.log(cmdResult.stderr);
    console.log(``)
    console.log(cmdResult.stdout);

    return cmdResult.code === 0;
  }
}