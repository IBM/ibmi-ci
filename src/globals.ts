import * as path from "path";
import { IBMi } from "./connection/IBMi";

export const globals = {
  connection: new IBMi(),
  lcwd: process.cwd(),
  rcwd: `.`
}

export function getValidRemotePath(inString: string) {
  return inString.startsWith(`.`) ? path.posix.join(globals.rcwd, inString) : inString
}