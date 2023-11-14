import * as fs from "fs";
import * as path from "path";

import { getValidLocalPath, getValidRemotePath, globals } from "../globals";
import { StepI } from "./step";

export class GetStep extends StepI {
  public id = `get`;
  public description = `Gets a specific file from IBM i`;
  public requiredParams: string[] = [`remoteRelativeDirectory`, `localRelativePath`];

  public async execute(): Promise<boolean> {
    const remoteFile =  getValidRemotePath(this.parameters[0]);
    const localFile = getValidLocalPath(this.parameters[1]);

    console.log(`Downloading file '${remoteFile}' to '${localFile}'`);

    const toDirectory = path.dirname(localFile);

    try {
      fs.mkdirSync(toDirectory, {recursive: true});
    } catch (e) {};

    await globals.connection.downloadFile(localFile, remoteFile);

    return true;
  }
}