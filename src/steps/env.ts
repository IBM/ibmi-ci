import { globals } from "../globals";
import { StepI } from "./step";

export class EnvironmentStep extends StepI {
  public async execute(): Promise<boolean> {
    const ignoredEnvironmentVariables = [
      `IBMI_HOST`, `IBMI_SSH_POST`, `IBMI_USER`, `IBMI_PASSWORD`, `IBMI_PRIVATE_KEY`,
      `PWD`, `USER`, `HOME`, `SHELL`, `TERM`, `EDITOR`, `LANG`, `LC_ALL`, `LC_CTYPE`,
    ];

    const environmentVariables = Object.keys(process.env).filter(key => !ignoredEnvironmentVariables.includes(key));
    const commandString = environmentVariables.map(key => `${key}="${process.env[key]}"`).join(` `);

    const result = await globals.connection.sendCommand({
      command: commandString
    });

    return result.code !== 0;
  }
}