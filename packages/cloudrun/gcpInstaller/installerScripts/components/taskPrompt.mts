import {execSync} from 'child_process';
import readline from 'readline';
import {colorCode} from './colorCodes.mjs';

export function taskPrompt(projectID: string) {
	return new Promise((resolve) => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		rl.question(
			`What would you like to do?\n[1] Cloud Run rendering in ${colorCode.blueText}${projectID}${colorCode.resetText} - Setup / Update Remotion version.\n[2] ${colorCode.blueText}${projectID}${colorCode.resetText} is already set up for Remotion, generate a new .env file or manage keys for the Remotion Service Account.\n${colorCode.blueText}`,
			async (answer) => {
				// reset terminal color
				rl.write(`\n${colorCode.resetText}`);

				if (answer.trim() === '1') {
					rl.write(
						`${colorCode.blueText}<Terraform selected>\n\n${colorCode.resetText}`
					);
					rl.close();
					return resolve('runTerraform');
				}

				if (answer.trim() === '2') {
					rl.write(
						`${colorCode.blueText}<.env creation selected>\n\n${colorCode.resetText}`
					);
					rl.close();
					return resolve('generateEnv');
				}

				rl.close();
				execSync(
					`echo "${colorCode.redText}Invalid selection. Please enter 1 or 2.\n${colorCode.resetText}"`,
					{
						stdio: 'inherit',
					}
				);

				const result = await taskPrompt(projectID);

				resolve(result);
			}
		);
	});
}
