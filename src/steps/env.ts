import { globals } from "../globals";
import { StepI } from "./step";

export class EnvironmentStep extends StepI {
  public id = `env`;
  public description = `Sets the environment variables for the connected IBM i based on the host`;
  public requiredParams: string[] = [];

  public async execute(): Promise<boolean> {
    const ignoredEnvironmentVariables = [
      `IBMI_HOST`, `IBMI_SSH_POST`, `IBMI_USER`, `IBMI_PASSWORD`, `IBMI_PRIVATE_KEY`,
      `PWD`, `USER`, `HOME`, `SHELL`, `TERM`, `EDITOR`, `LANG`, `LC_ALL`, `LC_CTYPE`, `_`, `LOGNAME`
    ];

    const environmentVariables = Object.keys(process.env).filter(key => !ignoredEnvironmentVariables.includes(key));
    const commandString = environmentVariables.map(key => `${key}="${process.env[key]}"`).join(` `);

    console.log(`Setting environment variabless: ${environmentVariables.join(`, `)}`);

    const result = await globals.connection.sendCommand({
      command: commandString
    });

    console.log(`Environment variables have been set.`);

    return result.code !== 0;
  }
}