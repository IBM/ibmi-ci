import * as fs from "fs";
import * as path from "path";

import { StepI } from "../step";

export class GetStep extends StepI {
  public readonly id = `get`;
  public readonly description = `Gets a specific file from IBM i`;
  public readonly requiredParams: string[] = [`remoteRelativeDirectory`, `localRelativePath`];

  public async execute(): Promise<boolean> {
    const remoteFile =  this.getValidRemotePath(this.parameters[0]);
    const localFile = this.getValidLocalPath(this.parameters[1]);

    console.log(`Downloading file '${remoteFile}' to '${localFile}'`);

    const toDirectory = path.dirname(localFile);

    try {
      fs.mkdirSync(toDirectory, {recursive: true});
    } catch (e) {};

    await this.getConnection().downloadFile(localFile, remoteFile);

    return true;
  }
}