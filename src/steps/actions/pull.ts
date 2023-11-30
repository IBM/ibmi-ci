import * as fs from "fs";
import * as path from "path";

import { getValidRemotePath, globals } from "../../globals";
import { StepI } from "../step";

export class PullStep extends StepI {
  public readonly id = `pull`;
  public readonly description = `Pulls a directory from IBM i to the local current working directory`;
  public readonly requiredParams: string[] = [`remoteRelativeDirectory`];

  public async execute(): Promise<boolean> {
    const fromDirectory =  getValidRemotePath(this.parameters[0]);
    const toDirectory = globals.lcwd;

    console.log(`Downloading files from '${fromDirectory}' to '${toDirectory}'`);

    try {
      fs.mkdirSync(toDirectory, {recursive: true});
    } catch (e) {};

    await globals.connection.downloadDirectory(toDirectory, fromDirectory, {tick(localFile, remoteFile, error) {
      console.log(`\t${remoteFile} -> ${localFile}`)
    }, concurrency: 10});

    return true;
  }
}