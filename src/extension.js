// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const utils = require('./utils');
const defaultConfig = require('./defaults');


const createChosenBox = async (config, template) => {
	const projectRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;

	const componentName = await vscode.window.showInputBox({
		placeholder: 'Name your component...',
		prompt: 'Box it up',
		validateInput: text => {

			if (!text) {
				return `You have to give it a name 😂`;
			}

			if (fs.existsSync(`${projectRoot}/${config['templates'][template]['dest']}/${text}`)) {
				return `${text} already exists? 😐`;
			}

			return null;
		}
	});

	if (config.templates)
	{
		if (!componentName)
		{
			vscode.window.showErrorMessage(`Something went wrong here, the component name you entered didn't reach me.`);
			return false;
		}
			
		utils.copyDir(`${projectRoot}/${config['templates'][template]['src']}`,
			`${projectRoot}/${config['templates'][template]['dest']}/${componentName}`,
			componentName);
		utils.rename(`${projectRoot}/${config['templates'][template]['dest']}/${componentName}`,
			componentName);


			vscode.window.showInformationMessage(`Created *${componentName} ${template}* successfully! 👋`);
	}
	else {
		vscode.window.showErrorMessage(`Couldn't find any templates in boxedConfig.json`);
	}
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const createBox = vscode.commands.registerCommand('boxed-components.createBox', () => {

		const configPath = vscode.workspace.workspaceFolders.length ? `${vscode.workspace.workspaceFolders[0].uri.fsPath}/boxedConfig.json` : null;	
		delete require.cache[configPath];
		const config = require(configPath);


		if (!configPath)
		{
			vscode.window.showErrorMessage(`Open a project in your workspace first.`);
			return false;
		}


		if (!fs.existsSync(configPath)) {
			fs.writeFileSync(configPath, JSON.stringify(defaultConfig));
			vscode.window.showInformationMessage(`Created a blank boxedConfig.json file, add your template information and try again.`);
			vscode.window.showErrorMessage(`Couldn't find boxedConfig.json file`);
			return false;
		}

		

		const quickPick = vscode.window.createQuickPick();
		quickPick.title = 'Select one of your templates';
		quickPick.items = Object.keys(config.templates).map(label => ({ label }));
		quickPick.onDidChangeSelection(selection => {
			if (selection[0]) {
				createChosenBox(config, selection[0].label);
			}
		});
		quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();

	});

	context.subscriptions.push(createBox);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate,
}
