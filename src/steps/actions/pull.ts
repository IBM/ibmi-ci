import * as fs from "fs";
import * as path from "path";

import { StepI } from "../step";

export class PullStep extends StepI {
  public readonly id = `pull`;
  public readonly description = `Pulls a directory from IBM i to the local current working directory`;
  public readonly requiredParams: string[] = [`remoteRelativeDirectory`];

  public async execute(): Promise<boolean> {
    const fromDirectory =  this.getValidRemotePath(this.parameters[0]);
    const toDirectory = this.state.lcwd;

    this.log(`Downloading files from '${fromDirectory}' to '${toDirectory}'`);

    try {
      fs.mkdirSync(toDirectory, {recursive: true});
    } catch (e) {};

    await this.getConnection().downloadDirectory(toDirectory, fromDirectory, {tick: (localFile, remoteFile, error) => {
      this.log(`\t${remoteFile} -> ${localFile}`)
    }, concurrency: 10});

    this.log(``);
    this.log(`Downloaded files from '${fromDirectory}' to '${toDirectory}'`);

    return true;
  }
}