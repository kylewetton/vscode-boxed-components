// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const sections = require('./sections');
const config = require(`${vscode.workspace.workspaceFolders[0].uri.fsPath}/bc.json`) || null;

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

		// Parent Component Folder
		fs.mkdirSync(mainComponentFolder);
		createMainFiles(mainComponentFolder, componentName);
		createStyleSection(mainComponentFolder, componentName);
		createTestSection(mainComponentFolder, componentName);
		createStorySection(mainComponentFolder, componentName);
		

		vscode.window.showInformationMessage(`Created ${componentName} successfully! 👋`, {

		});
	});

	context.subscriptions.push(createBox);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
