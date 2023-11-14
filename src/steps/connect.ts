import { IBMi } from "../connection/IBMi";
import { globals } from "../globals";
import { StepI } from "./step";

import * as node_ssh from "node-ssh";

export class ConnectStep extends StepI {
  public id = `connect`;
  public description = `Connect to the IBM i`;
  public requiredParams: string[] = [];

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

    globals.connection = new IBMi();

    const connectResult = await globals.connection.connect(connectionDetail);

    if (!connectResult.success) {
      throw new Error(`Failed to connect to IBMi: ${connectResult.error}`);
    }

    console.log(`Connected to system.`);

    const pwdResult = await globals.connection.sendCommand({command: `pwd`, directory: `.`});
    if (pwdResult.code !== 0) {
      throw new Error(`Failed to get current working directory: ${pwdResult.stderr}`);
    }

    globals.rcwd = pwdResult.stdout.trim();
    console.log(`Remote working directory is '${globals.rcwd}'`);
    
    return connectResult.success;
  }
}