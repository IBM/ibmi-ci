import { ConnectStep } from "./connect";
import { LocalCwdStep } from "./lcwd";
import { EnvironmentStep } from "./env";
import { PushStep } from "./push";
import { StepI } from "./step";
import { CommandStep } from "./cmd";
import { RemoteCwdStep } from "./rcwd";
import { PullStep } from "./pull";
import { GetStep } from "./get";
import { ClStep } from "./cl";

export const StepTypes: {[id: string]: typeof StepI} = {
  'connect': ConnectStep,
  'env': EnvironmentStep,
  'lcwd': LocalCwdStep,
  'rcwd': RemoteCwdStep,
  'push': PushStep,
  'pull': PullStep,
  'get': GetStep,
  'cmd': CommandStep,
  'cl': ClStep
}