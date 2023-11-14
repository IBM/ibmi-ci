
export interface StandardIO {
  onStdout?: (data: Buffer) => void;
  onStderr?: (data: Buffer) => void;
  stdin?: string;
}

/**
 * External interface for extensions to call `code-for-ibmi.runCommand`
 */
export interface RemoteCommand {
  title?: string;
  command: string;
  environment?: "ile" | "qsh" | "pase";
  cwd?: string;
  env?: Record<string, string>;
}

export interface CommandData extends StandardIO {
  command: string;
  directory?: string;
  env?: Record<string, string>;
}

export interface CommandResult {
  code: number | null;
  stdout: string;
  stderr: string;
  command?: string;
}

export interface Server {
  name: string
}

export interface Profile {
  profile: string
}

export interface QsysPath {
  library: string,
  name: string,
}

export interface IBMiObject extends QsysPath {
  type: string,
  text: string,
  attribute?: string
}

export interface IBMiFile extends IBMiObject {
  count?: number
}

export interface IBMiMember {
  library: string
  file: string
  name: string
  extension: string
  recordLength?: number
  text?: string
  asp?: string
  lines?: number
  created?: Date
  changed?: Date
}

export interface IFSFile {
  type: "directory" | "streamfile"
  name: string
  path: string
  size?: number
  modified?: Date | string
  owner?: string
}

export interface IBMiError {
  code: string
  text: string
}

export interface FileError {
  sev: number
  lineNum: number
  toLineNum: number
  column: number
  toColumn: number
  text: string
  code: string
}

export interface QsysFsOptions {
  readonly?: boolean
}

