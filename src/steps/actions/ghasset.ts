import * as fs from "fs";
import { writeFile } from "fs/promises";
import * as path from "path";

import { StepI } from "../step";
import { Octokit } from "octokit";

const octokit = new Octokit();

export class GitHubAssetStep extends StepI {
  public readonly id = `ghasset`;
  public readonly description = `Pulls assets from a GitHub release to the local current working directory`;
  public readonly requiredParams: string[] = [`owner/repo`, `tag`, `assetName`];

  public async execute(): Promise<boolean> {
    const [owner, repo] = this.parameters[0].split('/');
    const tag = this.parameters[1];
    const findName = this.parameters[2];

    const toDirectory = this.state.lcwd;

    this.log(`Downloading files from ${owner}/${repo}@${tag} to '${toDirectory}'`);

    const result = await octokit.request(`GET /repos/{owner}/{repo}/releases/tags/${tag}`, {
      owner,
      repo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    const newAsset = result.data.assets.find(asset => asset.name.endsWith(findName));

    if (newAsset) {
      const url = newAsset.browser_download_url;
      const localFile = path.join(toDirectory, newAsset.name);

      try {
        fs.mkdirSync(toDirectory, {recursive: true});
      } catch (e) {};

      await downloadFile(url, localFile);
      this.log(`Downloaded asset: ${owner}/${repo}@${tag}:${newAsset.name} -> ${localFile}`)

      return true;
      
    } else {
      this.log(`No asset found with name '${findName}'. Available assets:`);
      for (const asset of result.data.assets) {
        this.log(`\t${asset.name}`);
      }

      return false;
    }
  }

  validateParameters(): boolean {
    return this.parameters.length === this.requiredParams.length && this.parameters[0].includes('/');
  }
}


function downloadFile(url, outputPath) {
  return fetch(url)
      .then(x => x.arrayBuffer())
      .then(x => writeFile(outputPath, Buffer.from(x)));
}
