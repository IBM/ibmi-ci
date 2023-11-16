import { getValidRemotePath, globals } from "../globals";
import { StepI } from "./step";

import * as path from "path";

export class PushStep extends StepI {
  public readonly id = `push`;
  public readonly description = `Pushes the current working directory to a chosen directory on the IBM i`;
  public readonly requiredParams: string[] = [`remoteRelativeDirectory`];

  public async execute(): Promise<boolean> {
    const toDirectory = getValidRemotePath(this.parameters[0]);
    const fromDirectory = globals.lcwd;

    console.log(`Uploading files to ${toDirectory}`);

    await globals.connection.sendCommand({command: `mkdir -p "${toDirectory}"`});
    await globals.connection.uploadDirectory(fromDirectory, toDirectory, {tick(localFile, remoteFile, error) {
      console.log(`\t${localFile} -> ${remoteFile}`)
    }, concurrency: 10});

    return true;
  }
}