// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const utils = require('./utils');
const defaultConfig = require('./defaults');
const path = require('path');
if (!fs.existsSync(`${vscode.workspace.workspaceFolders[0].uri.fsPath}/boxedConfig.json`)) {
    fs.writeFileSync(`${vscode.workspace.workspaceFolders[0].uri.fsPath}/boxedConfig.json`, JSON.stringify(defaultConfig))
}
const configPath = `${vscode.workspace.workspaceFolders[0].uri.fsPath}/boxedConfig.json`;

const createChosenBox = async (config, template) => {
	const projectRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
	const userPath = config ? config.hasOwnProperty('path') && path.normalize(config.path) : '';

	const componentName = await vscode.window.showInputBox({
		placeholder: 'Name your component...',
		prompt: 'Box it up',
		validateInput: text => {

			if (!text) {
				return `You have to give it a name 😂`;
			}

			if (fs.existsSync(`${projectRoot}/${userPath}/${text}`)) {
				return `${text} already exists? 😐`;
			}

			return null;
		}
	});

	if (config.templates)
	{
		utils.copyDir(`${projectRoot}/${config['templates'][template]['src']}`,
			`${projectRoot}/${config['templates'][template]['dest']}/${componentName}`,
			componentName);
	}
	else {
		vscode.window.showErrorMessage(`Couldn't find any templates in boxedConfig.js`);
	}

	vscode.window.showInformationMessage(`Created ${componentName} successfully! 👋`);
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let createBox = vscode.commands.registerCommand('boxed-components.createBox', () => {
		let template = null;
		delete require.cache[configPath];
		const config = require(configPath);

		const quickPick = vscode.window.createQuickPick();
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
