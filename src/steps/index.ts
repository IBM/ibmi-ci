import { ConnectStep } from "./connect";
import { LocalCwdStep } from "./lcwd";
import { EnvironmentStep } from "./env";
import { PushStep } from "./push";
import { StepI } from "./step";
import { CommandStep } from "./cmd";
import { RemoteCwdStep } from "./rcwd";

export const StepTypes: {[id: string]: typeof StepI} = {
  'connect': ConnectStep,
  'env': EnvironmentStep,
  'lcwd': LocalCwdStep,
  'rcwd': RemoteCwdStep,
  'push': PushStep,
  'cmd': CommandStep
}