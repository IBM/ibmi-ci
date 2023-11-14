import { IBMi } from "./connection/IBMi";

export const globals = {
  connection: new IBMi(),
  cwd: process.cwd(),
}