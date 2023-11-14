import { ConnectStep } from "./connect";
import { LocalCwdStep } from "./lcwd";
import { EnvironmentStep } from "./env";
import { PushStep } from "./push";
import { StepI } from "./step";

export const StepTypes: {[id: string]: typeof StepI} = {
  'connect': ConnectStep,
  'env': EnvironmentStep,
  'lcwd': LocalCwdStep,
  'push': PushStep,
}