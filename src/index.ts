
const isCli = process.argv.length >= 2 && process.argv[1].endsWith(`so`);

if (isCli || process.env.VSCODE_INSPECTOR_OPTIONS) {
	main();
} else {
	process.exit(1);
}

async function main() {
	const parms = process.argv.slice(2);
	let cwd = process.cwd();

	for (let i = 0; i < parms.length; i++) {
		switch (parms[i]) {}
	}
}