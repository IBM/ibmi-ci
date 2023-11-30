import { StepTypes, buildStepsFromArray, getInvalidSteps } from "./steps";
import { ConnectStep } from "./steps/actions/connect";
import { EnvironmentStep } from "./steps/actions/env";
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

	steps.push(...buildStepsFromArray(parms));

	if (steps.length > 2) {
		const invalidSteps = getInvalidSteps(steps);
		if (invalidSteps.length > 0) {
			console.log(`Invalid steps found: ${invalidSteps.length}`);
			console.log(``);

			invalidSteps.forEach(step => {
				console.log(`\t> ${step.id} step`);
				console.log(`\t\tRequired parameters: ${step.requiredParams.join(`, `)}`);
				console.log(`\t\tPassed: ${step.parameters.map(p => `\`${p}\``).join(`, `)}`);
				console.log(``);
			});
			process.exit(1);

		} else {
			console.log(`All steps are valid.`);
		}

		executeSteps(steps);
	}
}

async function executeSteps(steps: StepI[]) {
	for (let i = 0; i < steps.length; i++) {
		const step = steps[i];
		let shouldExit = false;

		console.log(``);
		console.log(`==========================================`);
		console.log(`Executing step ${i + 1}: ${step.id}`);
		console.log(`==========================================`);
		console.log(``);

		if (step.validateParameters()) {
			try {
				const result = await step.execute();

				if (!result) {
					console.log(`Failed to execute step: ${step.id}`);
					shouldExit = true;
				}
			} catch (e) {
				console.log(`Failed to execute step: ${step.id}`);
				console.log(e.message);
				shouldExit = true;
			}

			if (shouldExit) {
				// Step errors can be ignored with the `--ignore` flag
				if (step.ignoreStepError()) {
					console.log(`Ignoring error for this step.`);
				} else {
					process.exit(1);
				}
			}

		} else {
			console.log(`Runtime error, which is odd because the validation should have caught it!`);
			console.log(`Invalid parameters for step: ${step.id}`);
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