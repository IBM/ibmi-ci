
import * as node_ssh from "node-ssh";

import { CommandData, CommandResult } from "./typings";

export class IBMi {
  client: node_ssh.NodeSSH;
  currentHost: string;
  currentPort: number;
  currentUser: string;

  constructor() {
    this.client = new node_ssh.NodeSSH;
    this.currentHost = ``;
    this.currentPort = 22;
    this.currentUser = ``;
  }

  /**
   * @returns {Promise<{success: boolean, error?: any}>} Was succesful at connecting or not.
   */
  async connect(connectionObject: node_ssh.Config): Promise<{ success: boolean, error?: any }> {
    try {
      connectionObject.keepaliveInterval = 35000;

      await this.client.connect(connectionObject);

      this.currentHost = connectionObject.host;
      this.currentPort = connectionObject.port;
      this.currentUser = connectionObject.username;

      // const checkShellText = `This should be the only text!`;
      // const checkShellResult = await this.sendCommand({
      //   command: `echo "${checkShellText}"`,
      //   directory: `.`
      // });
      // if (checkShellResult.stdout.split(`\n`)[0] !== checkShellText) {
      //   const chosen = await vscode.window.showErrorMessage(`Error in shell configuration!`, {
      //     detail: [
      //       `This extension can not work with the shell configured on ${this.currentConnectionName},`,
      //       `since the output from shell commands have additional content.`,
      //       `This can be caused by running commands like "echo" or other`,
      //       `commands creating output in your shell start script.`, ``,
      //       `The connection to ${this.currentConnectionName} will be aborted.`
      //     ].join(`\n`),
      //     modal: true
      //   }, `Read more`);

      //   if (chosen === `Read more`) {
      //     vscode.commands.executeCommand(`vscode.open`, `https://codefori.github.io/docs/#/pages/tips/setup`);
      //   }

      //   throw (`Shell config error, connection aborted.`);
      // }

      // let defaultHomeDir;
      /*
      const echoHomeResult = await this.sendCommand({
        command: `echo $HOME && cd && test -w $HOME`,
        directory: `.`
      });
      // Note: if the home directory does not exist, the behavior of the echo/cd/test command combo is as follows:
      //   - stderr contains 'Could not chdir to home directory /home/________: No such file or directory'
      //       (The output contains 'chdir' regardless of locale and shell, so maybe we could use that 
      //        if we iterate on this code again in the future)
      //   - stdout contains the name of the home directory (even if it does not exist)
      //   - The 'cd' command causes an error if the home directory does not exist or otherwise can't be cd'ed into
      //   - The 'test' command causes an error if the home directory is not writable (one can cd into a non-writable directory)
      let isHomeUsable = (0 == echoHomeResult.code);
      if (isHomeUsable) {
        defaultHomeDir = echoHomeResult.stdout.trim();
      } else {
        // Let's try to provide more valuable information to the user about why their home directory
        // is bad and maybe even provide the opportunity to create the home directory

        let actualHomeDir = echoHomeResult.stdout.trim();

        // we _could_ just assume the home directory doesn't exist but maybe there's something more going on, namely mucked-up permissions
        let doesHomeExist = (0 === (await this.sendCommand({ command: `test -e ${actualHomeDir}` })).code);
        if (doesHomeExist) {
          // Note: this logic might look backward because we fall into this (failure) leg on what looks like success (home dir exists).
          //       But, remember, but we only got here if 'cd $HOME' failed.
          //       Let's try to figure out why....
          if (0 !== (await this.sendCommand({ command: `test -d ${actualHomeDir}` })).code) {
            await vscode.window.showWarningMessage(`Your home directory (${actualHomeDir}) is not a directory! Code for IBM i may not function correctly. Please contact your system administrator`, { modal: !reconnecting });
          }
          else if (0 !== (await this.sendCommand({ command: `test -w ${actualHomeDir}` })).code) {
            await vscode.window.showWarningMessage(`Your home directory (${actualHomeDir}) is not writable! Code for IBM i may not function correctly. Please contact your system administrator`, { modal: !reconnecting });
          }
          else if (0 !== (await this.sendCommand({ command: `test -x ${actualHomeDir}` })).code) {
            await vscode.window.showWarningMessage(`Your home directory (${actualHomeDir}) is not usable due to permissions! Code for IBM i may not function correctly. Please contact your system administrator`, { modal: !reconnecting });
          }
          else {
            // not sure, but get your sys admin involved
            await vscode.window.showWarningMessage(`Your home directory (${actualHomeDir}) exists but is unusable. Code for IBM i may not function correctly. Please contact your system administrator`, { modal: !reconnecting });
          }
        }
        else if (reconnecting) {
          vscode.window.showWarningMessage(`Your home directory (${actualHomeDir}) does not exist. Code for IBM i may not function correctly.`, { modal: false });
        }
        else if (await vscode.window.showWarningMessage(`Home directory does not exist`, {
          modal: true,
          detail: `Your home directory (${actualHomeDir}) does not exist, so Code for IBM i may not function correctly. Would you like to create this directory now?`,
        }, `Yes`)) {
          console.log(`creating home directory ${actualHomeDir}`);
          let mkHomeCmd = `mkdir -p ${actualHomeDir} && chown ${connectionObject.username.toLowerCase()} ${actualHomeDir} && chmod 0755 ${actualHomeDir}`;
          let mkHomeResult = await this.sendCommand({ command: mkHomeCmd, directory: `.` });
          if (0 === mkHomeResult.code) {
            defaultHomeDir = actualHomeDir;
          } else {
            let mkHomeErrs = mkHomeResult.stderr;
            // We still get 'Could not chdir to home directory' in stderr so we need to hackily gut that out, as well as the bashisms that are a side effect of our API
            mkHomeErrs = mkHomeErrs.substring(1 + mkHomeErrs.indexOf(`\n`)).replace(`bash: line 1: `, ``);
            await vscode.window.showWarningMessage(`Error creating home directory (${actualHomeDir}):\n${mkHomeErrs}.\n\n Code for IBM i may not function correctly. Please contact your system administrator`, { modal: true });
          }
        }
      }
      */

      //Since the compiles are stateless, then we have to set the library list each time we use the `SYSTEM` command
      //We setup the defaultUserLibraries here so we can remove them later on so the user can setup their own library list
      // let currentLibrary = `QGPL`;
      // this.defaultUserLibraries = [];

      // const liblResult = await this.sendQsh({
      //   command: `liblist`
      // });
      // if (liblResult.code === 0) {
      //   const libraryListString = liblResult.stdout;
      //   if (libraryListString !== ``) {
      //     const libraryList = libraryListString.split(`\n`);

      //     let lib, type;
      //     for (const line of libraryList) {
      //       lib = line.substring(0, 10).trim();
      //       type = line.substring(12);

      //       switch (type) {
      //         case `USR`:
      //           this.defaultUserLibraries.push(lib);
      //           break;

      //         case `CUR`:
      //           currentLibrary = lib;
      //           break;
      //       }
      //     }

      //     //If this is the first time the config is made, then these arrays will be empty
      //     if (this.config.currentLibrary.length === 0) {
      //       this.config.currentLibrary = currentLibrary;
      //     }
      //     if (this.config.libraryList.length === 0) {
      //       this.config.libraryList = this.defaultUserLibraries;
      //     }
      //   }
      // }


      return {
        success: true
      };

    } catch (e) {

      if (this.client.isConnected()) {
        this.client.dispose();
      }

      return {
        success: false,
        error: e
      };
    }
  }

  isConnected() {
    return this.client && this.client.isConnected();
  }

  async sendQsh(options: CommandData) {
    options.stdin = options.command;

    return this.sendCommand({
      ...options,
      command: `/QOpenSys/usr/bin/qsh`
    });
  }

  /**
   * Send commands to pase through the SSH connection.
   * Commands sent here end up in the 'Code for IBM i' output channel.
   */
  async sendCommand(options: CommandData): Promise<CommandResult> {
    let commands: string[] = [];
    if (options.env) {
      commands.push(...Object.entries(options.env).map(([key, value]) => `export ${key}="${value?.replace(/\$/g, `\\$`).replace(/"/g, `\\"`) || ``
        }"`))
    }

    commands.push(options.command);

    const command = commands.join(` && `);
    const directory = options.directory || `.`;

    const result = await this.client.execCommand(command, {
      cwd: directory,
      stdin: options.stdin,
      onStdout: options.onStdout,
      onStderr: options.onStderr,
    });

    // Some simplification
    if (result.code === null) result.code = 0;

    return result;
  }

  async end() {
    this.client.connection?.removeAllListeners();
    this.client.dispose();
  }

  async uploadFiles(files: { local: string, remote: string }[], options?: node_ssh.SSHPutFilesOptions) {
    await this.client.putFiles(files.map(f => { return { local: f.local, remote: f.remote } }), options);
  }

  async downloadFile(localFile: string, remoteFile: string) {
    await this.client.getFile(localFile, remoteFile);
  }

  async uploadDirectory(localDirectory: string, remoteDirectory: string, options?: node_ssh.SSHGetPutDirectoryOptions) {
    await this.client.putDirectory(localDirectory, remoteDirectory, options);
  }

  async downloadDirectory(localDirectory: string, remoteDirectory: string, options?: node_ssh.SSHGetPutDirectoryOptions) {
    await this.client.getDirectory(localDirectory, remoteDirectory, options);
  }
}
