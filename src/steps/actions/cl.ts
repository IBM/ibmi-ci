import { StepI } from "../step";

export class ClStep extends StepI {
  public readonly id = `cl`;
  public readonly description = `Execute a CL command on the remote system`;
  public readonly requiredParams: string[] = [`clCommand`];

  public async execute(): Promise<boolean> {
    const command = this.parameters[0];
    const fromDirectory = this.getState().rcwd;

    this.log(`> ${fromDirectory}`);
    this.log(`> ${command}`);

    const withSystem = `system "${command}"`;

    const cmdResult = await this.getConnection().sendCommand({
      command: withSystem,
      directory: fromDirectory,
    });

    this.log(cmdResult.stderr);
    this.log(``)
    this.log(cmdResult.stdout);

    return cmdResult.code === 0;
  }
}