import { globals } from "../globals";
import { StepI } from "./step";

export class PushStep extends StepI {
  public id = `push`;
  public description = `Pushes the current directory to a chosen directory on the IBM i`;
  public requiredParams: string[] = [`remoteDirectory`];

  public async execute(): Promise<boolean> {
    const toDirectory = this.parameters[0];
    const fromDirectory = globals.lcwd;

    console.log(`Uploading files to ${toDirectory}`);

    await globals.connection.sendCommand({command: `mkdir -p "${toDirectory}"`});
    await globals.connection.uploadDirectory(fromDirectory, toDirectory, {tick(localFile, remoteFile, error) {
      console.log(`\t${localFile} -> ${remoteFile}`)
    }, concurrency: 10});

    return true;
  }
}