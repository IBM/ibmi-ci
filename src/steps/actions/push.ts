
import { StepI } from "../step";

import * as path from "path";

export class PushStep extends StepI {
  public readonly id = `push`;
  public readonly description = `Pushes the current working directory to a chosen directory on the IBM i`;
  public readonly requiredParams: string[] = [`remoteRelativeDirectory`];

  public async execute(): Promise<boolean> {
    const toDirectory = this.getValidRemotePath(this.parameters[0]);
    const fromDirectory = this.getState().lcwd;

    this.log(`Uploading files to ${toDirectory}`);

    await this.getConnection().sendCommand({command: `mkdir -p "${toDirectory}"`});
    await this.getConnection().uploadDirectory(fromDirectory, toDirectory, {tick: (localFile, remoteFile, error) => {
      this.log(`\t${localFile} -> ${remoteFile}`)
    }, concurrency: 10});

    return true;
  }
}