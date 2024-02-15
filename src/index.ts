import { ExecutorDocument, StepTypes, buildStepsFromArray, buildStepsFromJson, buildStepsFromYaml } from "./steps";
import { Executor, LoggerFunction } from "./steps/executor";
import * as path from "path";
import * as fs from "fs";

main();

async function main() {
	const parms = process.argv.slice(2);

	let validSteps = true;
	let executor = new Executor();

	executor.addSteps(new StepTypes.connect(), new StepTypes.env());

	if (parms.length === 0) {
		printHelpAndQuit();

	} else if (parms[0] === `--file`) {
		const relativePath = parms[1];
		const detail = path.parse(relativePath);

		const content = fs.readFileSync(relativePath, {encoding: `utf8`});

		switch (detail.ext) {
			case `.json`:
				validSteps = buildStepsFromJson(executor, JSON.parse(content));
				break;

			case `.yaml`:
			case `.yml`:
				validSteps = buildStepsFromYaml(executor, content);
				break;

			default:
				console.log(`Unknown file type: ${detail.ext}`);
				process.exit(1);
		}
	} else {
		validSteps = buildStepsFromArray(executor, parms);
	}

	if (!validSteps) {
		process.exit(1);
	}

	if (executor.getSteps().length > 2) {
		const invalidSteps = executor.getInvalidSteps();
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

		const logger: LoggerFunction = (value, append) => {
			if (append) {
				process.stdout.write(value);
			} else {
				console.log(value);
			}
		}

		const result = await executor.executeSteps({log: logger});
		executor.dispose();
	}
}

function printHelpAndQuit() {
	console.log(`IBM i CLI`);
	console.log(`The CLI is used to interact with the IBM i from the command line.`);
	console.log();
	console.log(`It assumes these environment variables are set:`);
	console.log(`\tIBMI_HOST, IBMI_SSH_PORT, IBMI_USER`);
	console.log(`At least one of these environment variables is required:`);
	console.log(`\tIBMI_PASSWORD, IBMI_PRIVATE_KEY`);
	console.log();

	// `connect` and `env` are special steps that are always run first.
	const uniqueSteps = Object.keys(StepTypes)
		.filter(key => ![`connect`, `env`].includes(key))
		.map(key => new StepTypes[key]());

	console.log(`Available parameters:`);
	console.log(`\t--file <relativePath>`);
	console.log(`\t\tLoads steps from a JSON or YAML file. This cannot`);
	console.log(`\t\tuse this in conjunction with other paramaters.`);
	console.log();

	for (let i = 0; i < uniqueSteps.length; i++) {
		const step = uniqueSteps[i];

		console.log(`\t--${step.id} ${step.requiredParams.map(p => `<${p}>`).join(` `)}`);
		console.log(`\t\t${step.description}`);
	}

	console.log();

	process.exit();
}