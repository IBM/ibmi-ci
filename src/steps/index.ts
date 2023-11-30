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

import { parse } from 'yaml'
import { GitHubAssetStep } from "./actions/ghasset";

export const StepTypes: {[id: string]: typeof StepI} = {
  'connect': ConnectStep,
  'env': EnvironmentStep,
  'lcwd': LocalCwdStep,
  'rcwd': RemoteCwdStep,
  'push': PushStep,
  'pull': PullStep,
  'get': GetStep,
  'cmd': CommandStep,
  'cl': ClStep,
	'ghasset': GitHubAssetStep
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

export interface ExecutorDocument {
	steps: {
		type: string;
		parameters?: string[];
		ignore?: boolean;
	}[]
}

export function buildStepsFromYaml(executor: Executor, yaml: string) {
	const parsed: ExecutorDocument = parse(yaml)

	return buildStepsFromJson(executor, parsed);
}

export function buildStepsFromJson(executor: Executor, document: ExecutorDocument): boolean {
	if (!document.steps) {
		console.log(`No steps property found.`);
		return false;
	}

	for (const step of document.steps) {
		const stepType = StepTypes[step.type];

		if (!stepType) {
			console.log(`Unknown step: ${step.type}`);
			return false;
		}

		const newStep = new stepType();

		if (step.ignore) {
			newStep.ignoreErrors(true);
		}

		if (step.parameters) {
			for (const param of step.parameters) {
				newStep.addParameter(param);
			}
		}

		executor.addSteps(newStep);
	}

	return true;
}