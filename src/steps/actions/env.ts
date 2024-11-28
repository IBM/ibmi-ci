import { StepI } from "../step";

export class EnvironmentStep extends StepI {
  public readonly id = `env`;
  public readonly description = `Sets the environment variables for the connected IBM i based on the host`;
  public readonly requiredParams: string[] = [];

  public async execute(): Promise<boolean> {
    const ignoredEnvironmentVariables = [
      `IBMI_HOST`, `IBMI_SSH_PORT`, `IBMI_USER`, `IBMI_PASSWORD`, `IBMI_PRIVATE_KEY`,
      `PWD`, `USER`, `HOME`, `SHELL`, `TERM`, `EDITOR`, `LANG`, `LC_ALL`, `LC_CTYPE`, `_`, `LOGNAME`, `PATH`,
      `CommonProgramFiles(x86)`, `ProgramFiles(x86)`
    ];

    const environmentVariables = Object.keys(process.env).filter(key => !ignoredEnvironmentVariables.includes(key) && !key.includes('.'));
    const commandString = environmentVariables.map(key => `${key}='${process.env[key]}'`).join(` `);

    this.log(`Setting environment variables: ${environmentVariables.join(`, `)}`);

    const result = await this.getConnection().sendCommand({
      command: commandString
    });

    return result.code === 0;
  }
}