import { ConnectStep } from "./actions/connect";
import { LocalCwdStep } from "./actions/lcwd";
import { EnvironmentStep } from "./actions/env";
import { PushStep } from "./actions/push";
import { StepI } from "./step";
import { CommandStep } from "./actions/cmd";
import { RemoteCwdStep } from "./actions/rcwd";
import { PullStep } from "./actions/pull";
import { GetStep } from "./actions/get";
import { ClStep } from "./actions/cl";
import { Executor } from "./executor";

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

export function buildStepsFromArray(executor: Executor, parameters: string[]): boolean {
	let ignoreNext = false;

	for (let i = 0; i < parameters.length; i++) {
		if (parameters[i].startsWith(`--`)) {
			switch (parameters[i]) {
				case `--ignore`:
					ignoreNext = true;
					break;

				default:
					const stepName = parameters[i].substring(2);
					const stepType = StepTypes[stepName];

					if (!stepType) {
						console.log(`Unknown step: ${stepName}`);
						return false;
					}

					const newStep = new stepType();

					if (ignoreNext) {
						newStep.ignoreErrors(true);
						ignoreNext = false;
					}

					executor.addSteps(newStep);
					break;
			}

		} else {
			const step = executor.getLastStep();
			if (step) {
				step.addParameter(parameters[i]);
			} else {
				console.log(`Unknown parameter: ${parameters[i]}`);
				return false;
			}
		}
	}

	return true;
}