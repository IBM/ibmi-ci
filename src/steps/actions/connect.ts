import { IBMi } from "../../connection/IBMi";
import { StepI } from "../step";

import * as node_ssh from "node-ssh";

export class ConnectStep extends StepI {
  public readonly id = `connect`;
  public readonly description = `Connect to the IBM i`;
  public readonly requiredParams: string[] = [];

  public async execute(): Promise<boolean> {
    const requiredEnvironmentVariables = [
      `IBMI_HOST`, `IBMI_SSH_PORT`, `IBMI_USER`, 
    ];

    for (const variable of requiredEnvironmentVariables) {
      if (!process.env[variable]) {
        throw new Error(`${variable} is required.`);
      }
    }

    const connectionDetail: node_ssh.Config = {
      host: process.env.IBMI_HOST,
      port: Number(process.env.IBMI_SSH_PORT),
      username: process.env.IBMI_USER,
    };

    if (!process.env.IBMI_PASSWORD && !process.env.IBMI_PRIVATE_KEY) {
      throw new Error(`IBMI_PASSWORD or IBMI_PRIVATE_KEY is required`);
    }

    let authType: `password`|`privateKey` = `password`;
    let authToken: string = process.env.IBMI_PASSWORD;

    if (process.env.IBMI_PRIVATE_KEY) {
      authType = `privateKey`;
      authToken = process.env.IBMI_PRIVATE_KEY;
    }

    connectionDetail[authType] = authToken;

    this.state.connection = new IBMi();

    const connectResult = await this.getConnection().connect(connectionDetail);

    if (!connectResult.success) {
      throw new Error(`Failed to connect to IBMi: ${connectResult.error}`);
    }

    console.log(`Connected to system.`);

    // Let's also grab the users initial working directory
    const pwdResult = await this.getConnection().sendCommand({command: `pwd`, directory: `.`});
    if (pwdResult.code !== 0) {
      throw new Error(`Failed to get current working directory: ${pwdResult.stderr}`);
    }

    this.state.rcwd = pwdResult.stdout.trim();
    console.log(`Remote working directory is '${this.state.rcwd}'`);

    // To make debugging easier. Let's also display their `PATH` environment variable
    const pathResult = await this.getConnection().sendCommand({command: `echo $PATH`, directory: `.`});
    if (pathResult.code === 0 && pathResult.stdout) {
      const paths = pathResult.stdout.trim().split(`:`).map(p => `${p}:`);
      console.log(`Remote PATH environment variable is:`);
      for (const path of paths) {
        console.log(`\t${path}`);
      }
    } else {
      console.log(`Failed to get remote PATH environment variable. ${pathResult.stderr}`);
    }
    
    return connectResult.success;
  }
}