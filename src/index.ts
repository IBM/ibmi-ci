import { StepTypes } from "./steps";
import { ConnectStep } from "./steps/connect";
import { EnvironmentStep } from "./steps/env";
import { StepI } from "./steps/step";

main();

async function main() {
	const parms = process.argv.slice(2);

	if (parms.length === 0) {
		printHelpAndQuit();
	}

	let steps: StepI[] = [
		new ConnectStep(),
		new EnvironmentStep(),
	];

	for (let i = 0; i < parms.length; i++) {
		if (parms[i].startsWith(`--`)) {
			const stepName = parms[i].substring(2);
			const step = StepTypes[stepName];

			if (!step) {
				console.log(`Unknown step: ${stepName}`);
				process.exit(1);
			}

			steps.push(new step());

		} else {
			const step = steps[steps.length - 1];
			if (step) {
				step.addParameter(parms[i]);
			} else {
				console.log(`Unknown parameter: ${parms[i]}`);
				process.exit(1);
			}
		}
	}

	if (steps.length > 2) {
		executeSteps(steps);
	}
}

async function executeSteps(steps: StepI[]) {
	for (let i = 0; i < steps.length; i++) {
		const step = steps[i];
		if (step.validateParameters()) {
			try {
				const result = await step.execute();

				if (!result) {
					console.log();
					console.log(`Failed to execute step: ${step.id}`);
					process.exit(1);
				}
			} catch (e) {
				console.log();
				console.log(`Failed to execute step: ${step.id}`);
				console.log(e.message);
				process.exit(1);
			}

		} else {
			// TODO: might be better to do this before executing any steps??
			console.log();
			console.log(`Invalid parameters for step: ${step.id}`);
			console.log(`Required parameters: ${step.requiredParams.join(`, `)}`);
			process.exit(1);
		}
	}

	process.exit();
}

function printHelpAndQuit() {
	console.log(`IBM i CLI`);
	console.log(`The CLI is used to interact with the IBM i from the command line.`);
	console.log();
	console.log(`It assumes these environment variables are set:`);
	console.log(`\tIBMI_HOST, IBMI_SSH_POST, IBMI_USER`);
	console.log(`At least one of these environment variables is required:`);
	console.log(`\tIBMI_PASSWORD, IBMI_PRIVATE_KEY`);
	console.log();

	const uniqueSteps = Object.keys(StepTypes)
		.filter(key => ![`connect`, `env`].includes(key))
		.map(key => new StepTypes[key]());

	// `connect` and `env` are special steps that are always run first.

	console.log(`Available parameters:`);
	for (let i = 0; i < uniqueSteps.length; i++) {
		const step = uniqueSteps[i];

		console.log(`\t--${step.id} ${step.requiredParams.map(p => `<${p}>`).join(` `)}`);
		console.log(`\t\t${step.description}`);
	}

	console.log();

	process.exit();
}