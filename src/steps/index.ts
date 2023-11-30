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

export function buildStepsFromArray(parameters: string[]): StepI[] {
	let steps: StepI[] = [];
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
						process.exit(1);
					}

					const newStep = (new stepType());

					if (ignoreNext) {
						newStep.ignoreErrors(true);
						ignoreNext = false;
					}

					steps.push(newStep);
					break;
			}

		} else {
			const step = steps[steps.length - 1];
			if (step) {
				step.addParameter(parameters[i]);
			} else {
				console.log(`Unknown parameter: ${parameters[i]}`);
				process.exit(1);
			}
		}
	}

	return steps;
}

export function getInvalidSteps(steps: StepI[]): StepI[] {
	let invalidSteps: StepI[] = [];

	for (let i = 0; i < steps.length; i++) {
		const step = steps[i];

		if (!step.validateParameters()) {
			invalidSteps.push(step);
		}
	}

	return invalidSteps;
}