// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const utils = require('./utils');
const path = require('path');

const createChosenBox = async (config, template) => {
	/**
	 * TODO: This appears to only point to the first folder in the workspace.
	 * Personally never really have more than one project open in one workspace at a time
	 * */ 
	const projectRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
	const destURI = `${projectRoot}/${config[template]['dest']}`;
	const srcURI = `${projectRoot}/${config[template]['src']}`;

	const componentName = await vscode.window.showInputBox({
		placeholder: 'Name your component...',
		prompt: 'Box it up',
		validateInput: text => {

			if (!text) {
				return `You have to give it a name 😂`;
			}

			if (fs.existsSync(`${destURI}/${text}`)) {
				return `${text} already exists? 😐`;
			}

			return null;
		}
	});

	if (config)
	{

		if (!componentName)
		{
			vscode.window.showErrorMessage(`Something went wrong here, the component name you entered didn't reach me.`);
			return false;
		}
			
		utils.copyDir(srcURI,
			`${destURI}/${componentName}`,
			componentName).then(() => {
				utils.rename(`${destURI}/${componentName}`,
				componentName);
			});



			vscode.window.showInformationMessage(`Created ${componentName} ${template} successfully! 👋`);
	}
	else {
		vscode.window.showErrorMessage(`Couldn't find any templates in settings.json`);
	}
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const createBox = vscode.commands.registerCommand('boxed-components.createBox', () => {

		const quickPick = vscode.window.createQuickPick();
		quickPick.title = 'Select one of your templates';
		quickPick.items = Object.keys(vscode.workspace.getConfiguration().get('boxed-components.useTemplates')).map(label => ({ label }));
		quickPick.onDidChangeSelection(selection => {
			if (selection[0]) {
				createChosenBox(vscode.workspace.getConfiguration().get('boxed-components.useTemplates'), selection[0].label);
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
