import * as vscode from 'vscode';
import * as mineblock from './mineblock';

export function activate(context: vscode.ExtensionContext) {
	new mineblock.MineBlock(context);
}

// this method is called when your extension is deactivated
export function deactivate() {}
