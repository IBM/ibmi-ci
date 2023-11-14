import { ConnectStep } from "./connect";
import { CwdStep } from "./cwd";
import { EnvironmentStep } from "./env";
import { PushStep } from "./push";

export const StepTypes = {
  'connect': new ConnectStep(`Connect`, `Connects to the chosen IBM i`),
  'env': new EnvironmentStep(`Environment`, `Sets the environment variables for the chosen IBM i based on the host`),
  'cwd': new CwdStep(`cwd`, `Sets the current working directory on the local system`),
  'push': new PushStep(`Push`, `Pushes the current directory to a chosen directory on the IBM i`),
}