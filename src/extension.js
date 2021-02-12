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

const sections = require('./sections');

const {createMainFiles, createStorySection, createStyleSection, createTestSection} = sections;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let createBox = vscode.commands.registerCommand('boxed-components.createBox', async () => {
		delete require.cache[configPath];
		const config = require(configPath);
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

		const mainComponentFolder = `${projectRoot}/${userPath}/${componentName}`;

		if (config.template)
		{
			utils.copyDir(`${projectRoot}/${config.template}/__box__`, `${projectRoot}/${userPath}/${componentName}`, componentName);
		}
		else {
			fs.mkdirSync(mainComponentFolder, config);
			createMainFiles(mainComponentFolder, componentName, config);
			createStyleSection(mainComponentFolder, componentName, config);
			createTestSection(mainComponentFolder, componentName, config);
			createStorySection(mainComponentFolder, componentName, config);
		}

		
		
		
		
		
		

		vscode.window.showInformationMessage(`Created ${componentName} successfully! 👋`, {

		});
	});

	context.subscriptions.push(createBox);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate,
}
