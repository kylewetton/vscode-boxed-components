// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const utils = require('./utils');
const path = require('path');

const createChosenBox = async (config, template, projectRoot) => {
	/**
	 * TODO: This appears to only point to the first folder in the workspace.
	 * Personally never really have more than one project open in one workspace at a time
	 * */ 
	const destURI = `${projectRoot}/${config[template]['dest']}`;
	const srcURI = `${projectRoot}/${config[template]['src']}`;

	const componentName = await vscode.window.showInputBox({
		placeHolder: 'Name your component...',
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

		utils.copyDir(srcURI,`${destURI}/${componentName}`,componentName);
		vscode.window.showInformationMessage(`Created ${componentName} ${template} successfully! 👋`);
	}
	else {
	}
}

const quickPickTemplate = (templates, projectRoot) => {

	if (!templates) {
		vscode.window.showErrorMessage(`Couldn't find any templates in settings.json`);
		return false;
	}
	
	const quickPick = vscode.window.createQuickPick();
		quickPick.placeholder = 'Select the template to copy from...';
		quickPick.items = Object.keys(templates).map(label => ({ label }));
		quickPick.onDidChangeSelection(selection => {
			if (selection[0]) {
				createChosenBox(templates, selection[0].label, projectRoot);
			}
		});
		quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();
}

const quickPickWorkspace =  async () => {
	const folder = await vscode.window.showWorkspaceFolderPick({ placeHolder: 'Warning: Multi-root support has known bugs...' });
	if (folder) {
		const configuration = vscode.workspace.getConfiguration('', folder.uri);
		const templates = configuration.get('boxed-components.useTemplates');
		quickPickTemplate(templates, folder.uri.fsPath);
	}
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const createBox = vscode.commands.registerCommand('boxed-components.createBox', () => {
		
		if (!vscode.workspace.workspaceFolders.length) {
			vscode.workspace.showErrorMessage(`Box Components can't any projects in this workspace.`);
		}
		if (vscode.workspace.workspaceFolders.length > 1) {
			quickPickWorkspace();
		}
		else {
			quickPickTemplate(vscode.workspace.getConfiguration('boxed-components').get('useTemplates'), vscode.workspace.workspaceFolders[0].uri.fsPath);
		}
		
	});

	context.subscriptions.push(createBox);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate,
}
