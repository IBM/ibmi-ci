import { StepTypes } from "./steps";
import { StepI } from "./steps/step";

main();

async function main() {
	const parms = process.argv.slice(2);

	if (parms.length === 0) {
		printHelpAndQuit();
	}

	let steps: StepI[] = [
		StepTypes.connect,
		StepTypes.env
	];

	for (let i = 0; i < parms.length; i++) {
		if (parms[i].startsWith(`--`)) {
			const stepName = parms[i].substring(2);
			const step = StepTypes[stepName];

			if (!step) {
				console.log(`Unknown step: ${stepName}`);
				process.exit(1);
			}

			steps.push(step);

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
		try {
			const result = await step.execute();

			if (!result) {
				console.log();
				console.log(`Failed to execute step: ${step.name}`);
				process.exit(1);
			}
		} catch (e) {
			console.log();
			console.log(`Failed to execute step: ${step.name}`);
			console.log(e.message);
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

	// `connect` and `env` are special steps that are always run first.
	const parameters = Object.keys(StepTypes).filter(key => ![`connect`, `env`].includes(key));

	console.log(`Available parameters:`);
	for (let i = 0; i < parameters.length; i++) {
		const step = StepTypes[parameters[i]];
		console.log(`\t--${step.name}\t\t${step.description}`);
	}

	console.log();

	process.exit();
}