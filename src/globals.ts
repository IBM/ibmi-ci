import { IBMi } from "./connection/IBMi";

export const globals = {
  connection: new IBMi(),
  lcwd: process.cwd(),
  rcwd: `.`
}